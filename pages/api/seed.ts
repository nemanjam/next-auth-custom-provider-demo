import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { SeedSingleton } from 'prisma/seed';

// POST /api/seed
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  req.setTimeout(10 * 1000); // 10 sec

  try {
    await SeedSingleton.getInstance(prisma).run();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong with reseed.', error });
  }
}
