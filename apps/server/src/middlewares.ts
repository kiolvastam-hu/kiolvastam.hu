import { Request, Response, NextFunction } from "express";
/**
 * Not found middleware.
 */
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
	res.status(404);
	const error = new Error(`Not Found - ${req.originalUrl}`);
	next(error);
};

/**
 * Custom error handler. 
 */
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
	res.status(res.statusCode || 500);
	res.json({
		error: err.message,
		stack: process.env.NODE_ENV === 'production' ? '<prod>' : err.stack,
	});
};

/**
 * This middleware is used to check if the user is authenticated
 * 
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

	if (req.session && req.session.userId) {
		const user = await req.userRepository!.findOne({ id: req.session.userId }, { populate: ['role','createdAt','entries','following','email','entries.likes'] });
		if (user) {
			req.user = user;
			return next();
		}

		res.clearCookie('qid');
		res.status(404);
		return next(new Error('User not found'));

	}
	res.status(401);
	const error = new Error('Unauthorized');
	return next(error);
}
/**
 * Custom middleware to get an entry from the db by id.
 * 
 * @param populate fields to populate
 * 
 * default: `['likes','comments','tags','user']`
 * @returns a request object with `entry` field populated
 */
export const getEntry = (populate: any[] = []) => async (req: Request, res: Response, next: NextFunction) => {
	const entry = await req.entryRepository!.findOne({ id: req.params.id },
		{
			populate: [...populate, 'tags', 'user', 'user.age', 'likes', 'comments', 'comments.user.username', 'comments.createdAt', 'createdAt'],
		});
	if (!entry) {
		res.status(404);
		return next(new Error('Entry not found'));
	}
	req.entry = entry;
	return next();
};

