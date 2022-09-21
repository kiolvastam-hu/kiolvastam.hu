/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Request, Response, Router } from "express";
import { body, validationResult, oneOf, checkSchema } from "express-validator";
import { wrap } from "@mikro-orm/core";
import Entry from "../entities/entry";
import User from "../entities/user";
import Comment from "../entities/Comment";
import Like from "../entities/like";
import { authMiddleware, getEntry } from "../middlewares";

const entryRouter = Router();
const populate = ['tags', 'user', 'likes', 'comments', 'comments.createdAt', 'comments.user.username', 'createdAt', 'updatedAt'] as any;
entryRouter
	.use((req, _res, next) => {
		req.entryRepository = req.orm.em.getRepository(Entry);
		req.userRepository = req.orm.em.getRepository(User);
		req.likeRepository = req.orm.em.getRepository(Like);
		req.commentRepository = req.orm.em.getRepository(Comment);
		next();
	})
	.get('/', async (req, res) => {
		console.log({ offset: req.query.offset });
		const offset = req.query.offset ? parseInt(req.query.offset.toString(), 10) : 0;
		console.log({ offset });
		const limit = 5;
		const entries = await req.entryRepository?.find({
			private: false,
		}, {
			populate,
			orderBy: { createdAt: -1 },
			limit,
			offset
		});
		const hasMore = entries?.length === limit;
		res.send({ entries, hasMore });
	})

	.get('/following', authMiddleware, async (req, res) => {
		const user = req.user!;
		const offset = req.query.offset ? parseInt(req.query.offset.toString(), 10) : 0;
		const entries = await req.entryRepository?.find({
			private: false,
			user: {
				$in: user!.following
			},
		}, {
			populate,
			orderBy: { createdAt: -1 },
			limit: 5,
			offset
		});
		const hasMore = entries?.length === 5;
		res.send({ entries, hasMore });
	})

	// this route is for getting a single entry with likes & comments
	.get('/:id',
		authMiddleware,
		getEntry(['updatedAt']), async (req, res) => {
			const { user, entry } = req;
			if ((!entry) || (entry.private && entry.user.id !== user!.id)) {
				return res.send(404)
			};

			// check if user has liked the entry and populate the entry with number of likes
			const likeExists = await req.likeRepository!.findOne({
				user,
				entry
			});
			// return entry with extra `liked` property
			return res.send(
				{
					...wrap(entry).toJSON(),
					liked: !!likeExists
				}
			);
		}
	)

	// this route is for creating a new entry
	.post('/',
		authMiddleware,
		oneOf([
			body('opinion').isLength({ min: 1, max: 5000 }).withMessage('A vélemény 1 és 5000 karakter között kell hogy legyen'),
			body('summary').isLength({ min: 1, max: 5000 }).withMessage('A tartalom 1 és 5000 karakter között kell hogy legyen'),
		]),
		body('tags').isArray({ max: 5 }).withMessage('Legfeljebb 5 címkét adhatsz meg'),
		body('book.cover_url').isURL(),
		body('book.title').isLength({ min: 1, max: 100 }),
		body('book.author').isLength({ min: 1, max: 100 }),
		body('book.pub_year').isInt({ min: 1, max: 9999 }),
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			const { opinion, summary, tags, book, private: isPrivate = false, showComments = true } = req.body;
			const { user } = req;
			console.log({ 'incoming': book.moly_id })
			// check if user has already posted an entry with the same book id
			const entryExists = await req.entryRepository!.findOne({
				user,
				'book.moly_id': book.moly_id
			} as never);
			if (entryExists) {
				return res.status(400).json({
					errors: [
						{
							msg: 'Erről a könyvről már írtál egy bejegyzést!',
							param: '__general',
							value: book.moly_id,
							redirect: `/post/${entryExists.id}`
						}
					]
				});
			}

			const entry = req.entryRepository!.create({
				opinion, summary, tags, book, createdAt: new Date(), updatedAt: new Date(), user: user!, private: isPrivate, showComments, likes: []
			});
			await req.entryRepository!.persistAndFlush(entry);
			const newEntry = await req.entryRepository!.findOneOrFail(entry.id, { populate });
			return res.status(201).send(newEntry);
		})

	.post('/search', async (req, res) => {
		const { tags, query } = req.body;
		const entries = await req.entryRepository?.find({ tags, private: false, opinion: { $re: query } });

		res.send(entries);
	})

	.delete('/:id', authMiddleware, getEntry([]), async (req, res) => {
		const { user, entry } = req;
		if (entry!.user.id !== user!.id) {
			return res.send(403);
		}
		await req.entryRepository!.removeAndFlush(entry!);
		return res.send({
			message: 'Entry deleted successfully'
		});
	})

	// updates the entry with the given id by all the properties in the request body
	.patch('/:id',
		authMiddleware,
		getEntry([]),
		async (req: Request, res: Response) => {
			const { user, entry } = req;
			if (entry?.user.id !== user?.id) {
				return res.send(403);
			}

			await req.entryRepository!.nativeUpdate(entry!, { ...req.body, updatedAt: new Date() });

			return res.send(entry);
		})

	// add comments to entry
	.post('/:id/comments', authMiddleware, getEntry([]), async (req, res) => {
		const entry = req.entry!;
		const user = req.user!;

		const { comment } = req.body;
		const commentEntity = await req.orm.em.getRepository(Comment).create({
			text: comment, createdAt: new Date(), updatedAt: new Date(), user, entry
		});
		await req.orm.em.persistAndFlush(commentEntity);
		return res.send(entry)
	})

	// delete a comment
	.delete('/:id/comments/:commentId', authMiddleware, getEntry([]), async (req, res) => {
		const { user, entry } = req;
		const comment = await req.commentRepository!.findOne({
			id: req.params.commentId,
		});
		if (!comment) {
			return res.send(404);
		}
		// only allow delete if user is moderator or admin or the author of the comment or author of the entry
		if (user?.role !== 'admin' && user?.role !== 'moderator' && user?.id !== comment.user.id && user?.id !== entry?.user.id) {
			return res.send(403);
		}
		await req.orm.em.removeAndFlush(comment);
		return res.send(entry)
	})

	// like entry
	.post('/:id/likes',
		authMiddleware,
		getEntry([]),
		async (req, res) => {
			const entry = req.entry!;
			const user = req.user!;
			// check if user has already liked that entry

			const likeEntry = await req.likeRepository!.findOne({ user, entry });
			// if liked, remove like
			if (likeEntry) {
				await req.likeRepository!.removeAndFlush(likeEntry);
			} else {
				const likeEntity = await req.likeRepository!.create({
					user, entry,
					createdAt: new Date(), updatedAt: new Date()
				});
				await req.likeRepository!.persistAndFlush(likeEntity);
			}
			return res.send({ ...wrap(entry).toJSON(), liked: !likeEntry })
		})

	// search for entries
	// searches within the opinion or summary fields
	.get('/search/:query', async (req, res) => {
		const { query } = req.params;
		const entries = await req.entryRepository!.find({
			private: false,
			$or: [

				{ opinion: { $re: query } },
				{ summary: { $re: query } }
			]
		}, {
			populate: ['likes','user']
		});
		res.send(entries);
	})

export default entryRouter;