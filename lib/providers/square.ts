import { OAuthConfig } from 'next-auth/providers';
import type { TokenSetParameters } from 'openid-client';
import { Client, Environment, Merchant } from 'square';
import { OAuthProviderOptions } from 'types';

const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/square`;

const squareClientConfig = {
  environment: Environment.Sandbox,
  userAgentDetail: 'first-app',
};

const SquareProvider = (options: OAuthProviderOptions): OAuthConfig<Merchant> => ({
  ...{
    id: 'square',
    name: 'Square',
    type: 'oauth',
    version: '2.0',
    // set in dashboard
    callbackUrl,
    authorization: {
      url: 'https://connect.squareupsandbox.com/oauth2/authorize',
      params: {
        scope: 'MERCHANT_PROFILE_READ',
        // next-auth passes by default, double params
        // client_id: options.clientId,
        // response_type: 'code',
      },
    },
    token: {
      async request(context) {
        try {
          const { code } = context.params;

          const squareClient = new Client(squareClientConfig);
          const oauthInstance = squareClient.oAuthApi;
          const { result } = await oauthInstance.obtainToken({
            code,
            redirectUri: callbackUrl, // must pass it here too
            clientId: options.clientId,
            clientSecret: options.clientSecret,
            grantType: 'authorization_code',
          });

          // match interface for Account Prisma model
          const tokens: TokenSetParameters = {
            userId: result.merchantId,
            access_token: result.accessToken,
            refresh_token: result.refreshToken,
            expires_at: new Date(result.expiresAt).getTime() / 1000, // ms to sec to fit INT
            token_type: result.tokenType,
          };

          return { tokens };
        } catch (error) {
          console.log(error);
        }
      },
    },
    userinfo: {
      async request(context) {
        try {
          // refresh_token, expires_at can be used for refreshing access_token without manual sign in
          const { access_token, userId, refresh_token, expires_at } = context.tokens;

          // create Api client
          // must create new client with accessToken
          const squareClient = new Client({
            ...squareClientConfig,
            accessToken: access_token,
          });
          const { result } = await squareClient.merchantsApi.retrieveMerchant(
            userId as string
          );

          // match request() signature
          return result.merchant as any;
        } catch (error) {
          console.log(error);
        }
      },
    },

    profile: (profile) => {
      // must match Prisma User model
      return {
        id: profile.id,
        name: profile.businessName,
        email: `${profile.businessName}-merchants@square.com`, // dummy email
      };
    },
  },
  ...options,
});

export default SquareProvider;

/**
  merchant example data:

  id: 'MLZ8QHF6HWW7N',
  businessName: 'test-account',
  country: 'US',
  languageCode: 'en-US',
  currency: 'USD',
  status: 'ACTIVE',
  mainLocationId: 'LQPAFJYHWKYX3',
  createdAt: '2023-04-15T07:07:26.543Z'
*/
