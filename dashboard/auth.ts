import { WebAuth } from 'auth0-js';

import {
  AUTH0_DOMAIN,
  AUTH0_API_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URI,
} from '../shared-config';

const auth = new WebAuth({
  audience: AUTH0_API_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
  redirectUri: AUTH0_REDIRECT_URI,
  responseType: 'code',
  scope: 'openid email profile',
});

const logIn = (next = 'overview'): void => {
  auth.authorize({
    clientID: AUTH0_CLIENT_ID,
    redirectUri: `${AUTH0_REDIRECT_URI}?next=${next}`,
  });
};

export { logIn };
export default auth;
