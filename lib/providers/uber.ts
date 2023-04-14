import { OAuthConfig } from 'next-auth/providers';
import { OAuthProviderOptions } from 'types';

const UberProvider = (options: OAuthProviderOptions): OAuthConfig<any> => ({
  ...{
    id: 'uber',
    name: 'Uber',
    type: 'oauth',
    version: '2.0',
    authorization: {
      url: 'https://login.uber.com/oauth/v2/authorize',
      params: { grant_type: 'authorization_code' },
    },
    accessTokenUrl: 'https://login.uber.com/oauth/v2/token',
    profileUrl: 'https://api.uber.com/v1.2/me',
    profile: (profile) => {
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
