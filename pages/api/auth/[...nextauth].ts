import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib/prisma';
import Square from 'lib/providers/square';

const options: NextAuthOptions = {
  providers: [
    // Twilio({
    //   clientId: process.env.TWILIO_ACCOUNT_SID,
    //   clientSecret: process.env.TWILIO_AUTH_TOKEN,
    // }),
    // Yelp({
    //   clientId: process.env.YELP_CLIENT_ID,
    //   clientSecret: process.env.YELP_CLIENT_SECRET,
    // }),
    // Uber({
    //   clientId: process.env.UBER_CLIENT_ID,
    //   clientSecret: process.env.UBER_CLIENT_SECRET,
    // }),
    Square({
      clientId: process.env.SQUARE_APPLICATION_ID,
      clientSecret: process.env.SQUARE_APPLICATION_SECRET,
    }),
  ],
  callbacks: {
    async jwt(context) {
      console.log('jwt context', context);
      const { token, user, account } = context;

      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session(context) {
      console.log('session context', context);
      const { session, token } = context;

      session.user.id = token.id as string;
      return session;
    },
  },
  secret: process.env.SECRET,
  adapter: PrismaAdapter(prisma),
  debug: false,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1h
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
