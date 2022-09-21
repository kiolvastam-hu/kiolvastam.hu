import { Router } from "express";
import Entry from "../entities/entry";

const tagRouter = Router();

tagRouter
	.use((req, _res, next) => {
		req.entryRepository = req.orm.em.getRepository(Entry);
		next();
	})
	.get('/:id', async (req, res) => {
		const { id } = req.params;
		const tag = await req.entryRepository?.find({
			tags: id,
			private: false
		},
			{
				populate: ['user', 'createdAt', 'updatedAt', 'likes'],
				orderBy: { createdAt: -1 },
			}
		);
		return res.send(tag);
	})
	.get('/', async (req, res) => {

		const entries = await req.entryRepository?.find({
			private: false
		});
		const tagsWithCount: { tag: string, count: number, covers: string[] }[] = [];
		entries?.forEach(entry => {
			const { tags } = entry;
			tags.forEach(tag => {
				const tagWithCount = tagsWithCount.find(t => t.tag === tag);
				if (tagWithCount) {
					// eslint-disable-next-line no-plusplus
					tagWithCount.count++;
					tagWithCount.covers.push(entry.book.cover_url);
				} else {
					tagsWithCount.push({ tag, count: 1, covers: [entry.book.cover_url] });
				}
			})

		})
		// return sorted	 by count
		res.json(tagsWithCount.map(e => ({
			tag: e.tag,
			count: e.count,
			covers: [...new Set(e.covers)]
		})).sort((a, b) => b.count - a.count));
	});

export default tagRouter;
