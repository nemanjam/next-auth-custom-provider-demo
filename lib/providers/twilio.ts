import { OAuthConfig } from 'next-auth/providers';
import { Twilio } from 'twilio';
import { OAuthProviderOptions } from 'types';

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const getTwilioUser = async ({ client, tokens }) => {
  try {
    const response = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: tokens, code: tokens });

    console.log('response', response);

    if (response.status === 'approved') {
      return {
        id: response.to,
        name: response.to,
        email: `${response.to}@example.com`,
      };
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const TwilioProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'twilio',
    name: 'Twilio',
    type: 'oauth',
    version: '2.0',
    scope: 'openid',
    authorization: {
      url: 'https://www.twilio.com/console/verify/services',
      params: { grant_type: 'authorization_code' },
    },
    token: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    requestTokenUrl: `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    profile: async ({ client, tokens }) => {
      try {
        const response = await twilioClient.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: tokens, code: tokens });

        console.log('response', response);

        if (response.status === 'approved') {
          return {
            id: response.to,
            name: response.to,
            email: `${response.to}@example.com`,
          };
        }
      } catch (error) {
        console.log(error);
      }

      return null;
    },
  },
  ...options,
});

export default TwilioProvider;
