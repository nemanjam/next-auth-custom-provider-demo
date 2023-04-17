------------------------------------------------------
------------------------------------------------------
// meeting 2


---------------------------
// test
https://folkslabs.notion.site/folkslabs/Folks-NextJS-Take-Home-Test-ecb512e8713b4bdd9ab305a960223770

na tehnickom pricaj mu iskustva sa next-auth
credentials provider, second auth system in parallel, ridiculous, undocumented, better passport, more flexible
for oauth next.js should be ok
https://github.com/nemanjam/nextjs-prisma-boilerplate/blob/main/docs/next-auth.md
only immutable id in session for user edit without log-out, refresh token
-----
ovo gledaj postojeci custom provideri
https://github.com/nextauthjs/next-auth/tree/main/packages/next-auth/src/providers

--------------------------

// OAuth flow
1. get oauth client_id and client_secret
2. call authorize route with id, secret, scope, redirect_uri, csrf_state
3. receive code and state on your redirect_uri
4. call token route to exchange code for access_token, refresh_token, expires_at, userId
5. call api route with access_token in barer header and userId and get user object
6. put user in database and in session
-----------------------
1.
// next-auth oauth2 overview
https://next-auth.js.org/configuration/providers/oauth
// 1. wellknown
wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
authorization: { params: { scope: "openid email profile" } },
// 2. all 3 routhes, authorization, token, userinfo
authorization: "https://kauth.kakao.com/oauth/authorize",
token: "https://kauth.kakao.com/oauth/token",
userinfo: "https://kapi.kakao.com/v2/user/me",
profile(profile) {...}
// 3. request() callbacks for custom requests
------------------------
2. 
// Uber scopes dashboard
https://developer.uber.com/dashboard/organization/11b8e1e1-4ee3-4638-a340-eeab99d3e37c/application/RuOgVcYA0d90yJGbaraQnrWyJC1k1eBp/access-token
provides authorization and token endpoints, easy to implement, only userinfo callback
------------------------
3.
// Yelp
needs all 3 callbacks, authorization, token, userinfo
------------------------
4.
// Square
sandbox environment for developer accounts
1. main code example connect-examples/oauth/node
https://github.dev/square/connect-api-examples/tree/master/connect-examples/oauth/node
// authorize call params
var url = basePath + `/oauth2/authorize?client_id=${process.env.SQ_APPLICATION_ID}&`
<a class="btn"  href="${url}" />
// token callback
oauthInstance.obtainToken({...})
---------
// userinfo callback
use same client with access_token
GET /v2/merchants/{merchant_id}
https://developer.squareup.com/reference/square/merchants-api/retrieve-merchant
// no avatar image and email
{
    "merchant": {
      "id": "DM7VKY8Q63GNP",
      "business_name": "Apple A Day",
      "country": "US",
      "language_code": "en-US",
      "currency": "USD",
      "status": "ACTIVE",
      "main_location_id": "9A65CGC72ZQG1",
      "created_at": "2021-12-10T19:25:52.484Z"
    }
  }
-------------------------------
5.
// pages/api/auth/[...nextauth].ts
// callbacks:
// async jwt(context) {}
put data in jwt token and return it (passes it into session callback)
----
// async session(context) {}
put data (user) in session object and return session
immutable data for edit user...
-------------------------------
6.
// Square tricky parts
// token callback
1. redirect url in token callback too
redirectUri: callbackUrl, // must pass it here too
-----------
2. tokens returned from token callback must respect both TokenSetParameters and AccountModel from Prisma
const tokens: TokenSetParameters = {
  providerAccountId: result.merchantId, // non existing prop will throw error in db adapter linking phase
  ...
}
3. sqlite bigint
expires_at:
// userinfo callback
must reinstantiate new api client with access_token
const squareClient = new Client({
  ...squareClientConfig,
  accessToken: access_token,
});
// profile callback
next-auth will overwrite id with id from database
  return {
    id: profile.id, // id will be overwritten
-------------------------------
7.
// summary:
how closely provider follows oauth specification and provides interfaces (endpoints)
constraints and restrictions for test accounts, sandbox environments for developers
simple and clear docs, not bloated
-------------------------------
-------------------------------
1.
// vercel demo
// repo
https://github.com/nemanjam/next-auth-custom-provider-demo
// demo
https://next-auth-custom-provider-demo.vercel.app
// square dashboard
https://developer.squareup.com/apps
// vercel dashpoard chrome
https://vercel.com/dashboard
// oracle adminer
// show accounts and user tables
https://adminer.amd1.localhost3002.live/?pgsql=132.226.193.243%3A5433&username=postgres_user&db=postgres-external-1&ns=public
--------------
2.
// local demo
// square dashboard open user again
https://developer.squareup.com/apps
// check adminer and postgres are running
https://localhost:9443/#!/2/docker/containers
separate callback urls
// local adminer
// show accounts and user tables
http://localhost:8080/?pgsql=cp-db-dev%3A5432&username=postgres_user&db=cp-db-dev&ns=public





