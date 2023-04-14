import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib/prisma';
import Twilio from 'lib/providers/twilio';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: NextAuthOptions = {
  providers: [
    Twilio({
      clientId: process.env.TWILIO_ACCOUNT_SID,
      clientSecret: process.env.TWILIO_AUTH_TOKEN,
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
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
