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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  secret: process.env.SECRET,
  adapter: PrismaAdapter(prisma),
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
