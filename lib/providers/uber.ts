import { OAuthConfig } from 'next-auth/providers';
import axios from 'axios';
import { OAuthProviderOptions } from 'types';

const redirect_uri = `${process.env.NEXTAUTH_URL}/api/auth/callback/uber`;

const UberProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'uber',
    name: 'Uber',
    type: 'oauth',
    version: '2.0',
    callbackUrl: redirect_uri,
    authorization: {
      url: 'https://login.uber.com/oauth/v2/authorize',
      params: {
        // scope must be explicitly omitted in development
        scope: undefined,
        // scope: 'profile',
        // next-auth passes by default, double params
        // client_id: options.clientId,
        // redirect_uri,
        // response_type: 'code',
      },
    },
    token: 'https://login.uber.com/oauth/v2/token',
    // userinfo: 'https://api.uber.com/v1.2/me',

    userinfo: {
      async request(context) {
        try {
          const { access_token, expires_at, refresh_token } = context.tokens;

          console.log('access_token', access_token);

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

export default UberProvider;
