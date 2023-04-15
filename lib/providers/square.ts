import { OAuthConfig } from 'next-auth/providers';
import type { TokenSetParameters } from 'openid-client';
import axios from 'axios';
import { ApiError, Client, Environment } from 'square';
import { OAuthProviderOptions } from 'types';

const redirect_uri = `${process.env.NEXTAUTH_URL}/api/auth/callback/square`;

const squareClient = new Client({
  environment: Environment.Sandbox,
  userAgentDetail: 'first-app',
});
const oauthInstance = squareClient.oAuthApi;

const SquareProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'uber',
    name: 'Uber',
    type: 'oauth',
    version: '2.0',
    // set in dashboard
    callbackUrl: redirect_uri,
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
        console.log('token context', context);

        try {
          const { code } = context.params;

          const { result } = await oauthInstance.obtainToken({
            code,
            clientId: process.env.SQUARE_APPLICATION_ID,
            clientSecret: process.env.SQUARE_APPLICATION_SECRET,
            grantType: 'authorization_code',
          });

          // const { accessToken, refreshToken, expiresAt, merchantId } = result;
          return { tokens: result as TokenSetParameters };
        } catch (error) {
          console.log(error);
        }
      },
    },
    userinfo: {
      async request(context) {
        try {
          const { accessToken, refreshToken, expiresAt, merchantId } = context.tokens;

          console.log('accessToken', accessToken);

          // here

          const options = {
            method: 'GET',
            url: 'https://api.uber.com/v1.2/me',
            headers: {
              Authorization: 'Bearer ' + access_token,
              'Accept-Language': 'en_US',
              'Content-Type': 'application/json',
            },
          };

          const { data: user } = await axios(options);
          return user;
        } catch (error) {
          // console.log(error);
        }
      },
    },

    profile: (profile) => {
      console.log('profile', profile);

      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.picture,
      };
    },
  },
  ...options,
});

export default SquareProvider;
