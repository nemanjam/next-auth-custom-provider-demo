import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/print-env for debugging
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const envVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SQUARE_APPLICATION_ID: process.env.SQUARE_APPLICATION_ID,
    SQUARE_APPLICATION_SECRET: process.env.SQUARE_APPLICATION_SECRET,
    SQUARE_ENVIRONMENT: process.env.SQUARE_ENVIRONMENT,
  };

  try {
    console.log('app envVars:', JSON.stringify(envVars, null, 2));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Something went wrong with printing.', error });
  }
}
