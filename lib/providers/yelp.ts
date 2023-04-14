import { OAuthConfig } from 'next-auth/providers';
import api from 'api';
import { OAuthProviderOptions } from 'types';

const sdk = api('@yelp-developers/v1.0#g8jd0e1ialfjg4hue');

const getYelpUser = async ({ client, tokens }) => {
  try {
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${tokens}`,
      },
    });

    if (response.status === 200 && response.data.total > 0) {
      const business = response.data.businesses[0];

      return {
        id: business.id,
        name: business.name,
        email: `${business.id}@example.com`,
      };
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

const YelpProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'yelp',
    name: 'Yelp',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: 'https://biz.yelp.com/oauth2/authorize',
      params: {
        client_id: options.clientId,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/yelp`,
        scope: 'r2r_business_owner',
        response_type: 'code',
        state: '123',
      },
    },
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/yelp`,
    token: {
      request({ params }) {
        console.log('params', params);

        try {
          const data = sdk.oauth2_token(
            { grant_type: 'authorization_code' },
            { accept: 'application/json' }
          );

          console.log('data token', data);
        } catch (error) {
          console.log(error);
        }

        return null;
      },
    },
    userinfo: {
      request() {
        try {
          const data = sdk.getBusinessesAssociatedWithAnAccessToken(
            { grant_type: 'authorization_code' },
            { accept: 'application/json' }
          );

          console.log('data businesses', data);
        } catch (error) {
          console.log(error);
        }

        return null;
      },
    },
    profile(profile) {
      return null;
    },
  },
  ...options,
});

export default YelpProvider;
