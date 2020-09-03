import { WebAuth } from 'auth0-js';
import { Route } from 'vue-router';

import {
  AUTH0_DOMAIN,
  AUTH0_API_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URI,
} from '../../shared-config';

const auth = new WebAuth({
  audience: AUTH0_API_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
  redirectUri: AUTH0_REDIRECT_URI,
  responseType: 'code',
  scope: 'openid email profile',
});

const logIn = (route: Route): void => {
  const { name, query, params } = route;
  const next = encodeURIComponent(
    JSON.stringify({
      name: name || 'overview',
      query,
      params,
    })
  );

  auth.authorize({
    clientID: AUTH0_CLIENT_ID,
    redirectUri: `${AUTH0_REDIRECT_URI}?next=${next}`,
  });
};

export { logIn };
export default auth;
