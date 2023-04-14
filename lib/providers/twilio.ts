import { Twilio } from 'twilio';

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TwilioProvider = (options) => ({
  ...{
    id: 'twilio',
    name: 'Twilio',
    type: 'oauth',
    version: '2.0',
    // scope: 'openid',
    // params: { grant_type: 'authorization_code' },
    accessTokenUrl: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    requestTokenUrl: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    // authorizationUrl: 'https://www.twilio.com/console/verify/services',
    profileUrl: null,
    // callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/twilio`,
    // clientId: process.env.TWILIO_ACCOUNT_SID,
    // clientSecret: process.env.TWILIO_AUTH_TOKEN,
    profile: (profile, token) => {
      return null;
    },
  },
  ...options,
});

export default TwilioProvider;
