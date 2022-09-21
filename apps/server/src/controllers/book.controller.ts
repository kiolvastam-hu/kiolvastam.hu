/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import 'dotenv/config';
import { Router } from "express";
import Entry from "../entities/entry";

const bookRouter = Router();
const { MOLY_API_KEY } = process.env;

bookRouter
	.use((req, res, next) => {
		req.entryRepository = req.orm.em.getRepository(Entry);

		next();
	})

	.get('/:id', async (req, res) => {
		const { id } = req.params;
		const bookPromise = axios.get(`https://moly.hu/api/book/${id}.json?key=${MOLY_API_KEY}`);
		const opinionsPromise = req.entryRepository!.find({
			'book.moly_id': parseInt(id, 10),
			'private': false,
		} as any, {
			populate: ['user', 'opinion', 'likes', 'createdAt']
		})
		const summariesPromise = req.entryRepository!.find({
			'book.moly_id': parseInt(id, 10),
			'private': false,
		} as any, {
			populate: ['user', 'summary', 'likes', 'createdAt']
		})
		const [bookResponse, opinions, summaries] = await Promise.all(
			[bookPromise, opinionsPromise, summariesPromise]);

		return res.send({

			book: bookResponse.data.book,
			opinions,
			summaries
		});
	})

	// search for books - by author or title
	.get('/search/:query', async (req, res) => {
		const { query } = req.params;
		const allEntries = await req.entryRepository!.find({ private: false });
		const books = allEntries.filter((entry: Entry) =>
			entry.book.title.toLowerCase().includes(query.toLowerCase()) || entry.book.author.toLowerCase().includes(query.toLowerCase()))
			.map((entry: Entry) => entry.book);
		const uniqueBooks = books.filter((book, index, self) => self.findIndex((b: any) => b.moly_id === book.moly_id) === index);
		return res.send(uniqueBooks);
	})

export default bookRouter;