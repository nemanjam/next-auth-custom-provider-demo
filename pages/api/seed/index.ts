import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { main } from 'prisma/seed';

// GET /api/seed
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  req.setTimeout(10 * 1000); // 10 sec

  try {
    await main();

    res.status(200).send({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong with reseed.', error });
  }
}
