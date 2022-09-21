// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const { MOLY_API_KEY } = process.env
export interface Data {
  books: Book[];
}

export interface Book {
  id: number;
  author: string;
  title: string;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req.query;
  console.log('query', query)
  const _res = await fetch(`https://moly.hu/api/books.json?q=${query}&key=${MOLY_API_KEY}`)
  const { books } = await _res.json()
  res.status(200).json(books.filter((e: { author: any; }) => e.author))
}
