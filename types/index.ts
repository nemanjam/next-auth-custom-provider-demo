import { OAuthConfig } from 'next-auth/providers';

export type OAuthProviderOptions = Pick<OAuthConfig<any>, 'clientId' | 'clientSecret'>;
