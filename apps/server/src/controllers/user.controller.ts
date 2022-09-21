import { wrap } from "@mikro-orm/core";
import { Router } from "express";
import { body, validationResult } from 'express-validator';
import hashPassword from "../auth/pass";
import Entry from "../entities/entry";
import User from "../entities/user";
import { authMiddleware } from "../middlewares";

const userRouter = Router();

userRouter
  .use((req, res, next) => {
    req.userRepository = req.orm.em.getRepository(User);
    req.entryRepository = req.orm.em.getRepository(Entry);
    next();
  })
  // this route is for registering a new user
  .post("/register",
    body('username').isLength({ max: 20 }).withMessage('A felhasználónév legfeljebb 20 karakter lehet'),
    body('password').isLength({ min: 5, max: 20 }).withMessage('A jelszónak legalább 5 és legfeljebb 20 karakter hosszúnak kell lennie'),
    body('email').isEmail().withMessage('Érvénytelen email cím'),
    body('birthday').isISO8601(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password, email, birthday } = req.body;
      let user = await req.userRepository?.findOne({ username });

      if (user) {
        return res.status(406).send({ errors: [{ 'param': 'username', 'msg': 'Felhasználónév foglalt.' }] });
      }

      if (!username || !password || !email) {
        return res.sendStatus(422);
      }

      const hashedPassword = await hashPassword(password);
      user = new User();
      wrap(user).assign({
        username, email, password: hashedPassword, birthday: new Date(birthday),
        emailPrivate: false, birthdayPrivate: false, role: 'user', following: [],
      });
      await req.userRepository?.persistAndFlush(user);
      req.session.userId = user.id;
      return res.status(201).send(user);
    })

  .post("/login", async (req, res) => {
    const { username, password }: AuthenticationDto = req.body;
    const { userId } = req.session;
    if (userId) {
      return res.send({ 'msg': 'already logged in' })
    }
    const user = await req.userRepository?.findOne({ username }, { populate: ['role'] });
    if (!user) {
      return res.status(404).send({
        errors: [{ 'param': 'username-password', 'msg': 'Incorrect username or password' }]
      });
    }
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== user.password) {
      return res.status(401).send({
        errors: [{ 'param': 'username-password', 'msg': 'Incorrect username or password' }]
      });
    }
    req.session.userId = user.id;

    return res.send({ id: user.id, username: user.username, role: user.role });
  })
  .patch('/change-password', authMiddleware,
    body('oldPassword').isLength({ min: 1, max: 20 }).withMessage('A jelszó nem lehet üres'),
    body('newPassword').isLength({ min: 5, max: 20 }).withMessage('Az új jelszónak legalább 5 és legfeljebb 20 karakter hosszúnak kell lennie'),
    async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      const { user } = req;
      const hashedPassword = await hashPassword(oldPassword);
      if (hashedPassword !== user?.password) {
        return res.status(401).send({
          errors: [{ 'param': 'oldPassword', 'msg': 'Hibás jelszó' }]
        });
      }
      user.password = await hashPassword(newPassword);
      await req.userRepository?.persistAndFlush(user);
      return res.send(user);
    })
  .get('/me', authMiddleware, async (req, res) => {
    const { user } = req;
    const entries = await req.entryRepository?.find({ user }, { populate: ['tags', 'user', 'createdAt', 'likes'] });
    return res.send({
      id: user?.id,
      ...user,
      entries
    })
  })
  .get('/me.json', authMiddleware, async (req, res) => {
    const { user } = req;
    // set header to download response as json
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${user?.username}.json`);

    // fetch entries
    const entries = await req.entryRepository?.find({ user }, { populate: ['tags', 'user', 'createdAt', 'likes'] });
    return res.send({
      ...user,
      entries
    })
  })

  .get('/me/settings', authMiddleware, async (req, res) => {
    const { birthdayPrivate, emailPrivate, email } = req.user!;
    return res.send({ birthdayPrivate, emailPrivate, email })
  })

  .put('/me/settings', authMiddleware, async (req, res) => {
    const { user } = req;
    await req.userRepository!.nativeUpdate(user!, { ...req.body, updatedAt: new Date() });
    const modifiedUser = await req.userRepository?.findOne(user!.id, {
      populate: ['birthdayPrivate', 'email', 'emailPrivate', 'birthday']
    });
    return res.send(modifiedUser);
  })

  .put('/update',
    authMiddleware,
    body('userId').isString(),
    body('role').isIn(['user', 'admin']),
    async (req, res) => {
      // only admin can use this route
      if (req.user?.role !== 'admin') {
        return res.sendStatus(401);
      }
      const { userId, role } = req.body;
      const user = await req.userRepository?.findOne({ id: userId });
      if (!user) {
        return res.sendStatus(404);
      }
      user.role = role;
      await req.userRepository?.persistAndFlush(user);
      return res.send(user);
    })
  // delete user
  .delete('/me/settings', authMiddleware, async (req, res) => {

    const { user } = req;
    await req.userRepository?.removeAndFlush(user!);
    return res.send({
      msg: 'user deleted'
    })

  })
  // get a user by username with public posts
  .get("/:username", async (req, res) => {
    const user = await req.userRepository?.findOne(
      { username: req.params.username },
      { populate: ['createdAt', 'email', 'emailPrivate', 'birthday', 'birthdayPrivate'] }
    );
    if (!user) {
      return res.sendStatus(404);
    }
    const entries = await req.entryRepository?.find({ user: user.id, private: false }, { populate: ['tags', 'user', 'createdAt', 'likes'] });
    return res.send({
      username: user.username,
      role: user.role,
      id: user.id,
      birthday: user.birthday,
      email: user.email,
      emailPrivate: user.emailPrivate,
      birthdayPrivate: user.birthdayPrivate,
      createdAt: user.createdAt,
      entries
    });
  })

  .put('/:username/follow', authMiddleware, async (req, res) => {
    const user: User = req.user as User;
    const { username } = req.params;
    // can't follow yourself
    if (username === user.username) {
      return res.sendStatus(400);
    }
    const followedUser = await req.userRepository?.findOne({ username });
    if (!followedUser) {
      return res.sendStatus(404);
    }
    
    if (user.following.includes(followedUser.id)) {
      // toggle
      user.following = user.following.filter(id => id !== followedUser.id);
    } else {
      user.following.push(followedUser.id);
    }
    await req.userRepository?.persistAndFlush(user);
    return res.send(user);
  })

  .get('/:username/following', authMiddleware, async (req, res) => {
    // return whether authenticated user is following the other user
    const { user } = req;
    const { username } = req.params;
    const followedUser = await req.userRepository?.findOne({ username });
    if (!followedUser) {
      return res.sendStatus(404);
    }
    if (!user) {
      return res.sendStatus(401);
    }
    return res.send({
      following: user.following.includes(followedUser.id)
    });
  })

  // this should return a message saying that the user is logged out
  // eslint-disable-next-line consistent-return
  .post('/logout', async (req, res) => {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).send({ 'error': 'not logged in' })
    }
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie('qid')
      }
      return res.send({ 'msg': 'logout successful' })
    });
  })
  .get("/", authMiddleware, async (req, res) => {

    const users = await req.userRepository?.find({}, { fields: ['username'] });
    return res.send(users);
  })

  // search route
  .get("/search/:query", async (req, res) => {
    const { query } = req.params;
    const users = await req.userRepository?.find({ username: { $re: query } }, { populate: ['entries', 'entries.likes'] });
    return res.send(users)
  })

interface AuthenticationDto {
  username: string;
  password: string;
}

export default userRouter;
