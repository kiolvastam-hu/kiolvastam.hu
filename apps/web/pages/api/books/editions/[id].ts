// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const { MOLY_API_KEY } = process.env;
export interface Data {
  editions: Edition[];
}

export type Edition = {
  id: number;
  isbn: string;
  publisher: string;
  place: string;
  year: number;
  pages: number;
  cover: string;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  const _res = await fetch(`https://moly.hu/api/book_editions/${id}.json?key=${MOLY_API_KEY}`)
  const { editions } = await _res.json()
  res.status(200).json(
    editions.filter((e: Edition) => e.cover && e.publisher && e.year)
  )
}
