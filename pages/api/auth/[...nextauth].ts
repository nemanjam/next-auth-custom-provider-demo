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
    //
    // {
    //   id: 'twilio',
    //   name: 'Twilio',
    //   type: 'oauth',
    //   version: '2.0',
    //   // scope: 'openid',
    //   // params: { grant_type: 'authorization_code' },
    //   accessTokenUrl: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    //   requestTokenUrl: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    //   // authorizationUrl: 'https://www.twilio.com/console/verify/services',
    //   profileUrl: null,
    //   // callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/twilio`,
    //   clientId: process.env.TWILIO_ACCOUNT_SID,
    //   clientSecret: process.env.TWILIO_AUTH_TOKEN,
    //   profile: (profile, token) => {
    //     return null;
    //   },
    // },
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
