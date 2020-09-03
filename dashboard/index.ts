// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import Vuetify, { VIcon } from 'vuetify/lib';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import VueMeta from 'vue-meta';
import { init as initSentry } from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

import {
  APP_URL,
  VUETIFY_NONCE,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
} from '../shared-config';
import configureAxios from '../shared-utils/configure-axios';
import { NotAllowedError } from './errors';
import { RouteMeta } from './types';
import router from './routes';
import store, { USER_MODULE, CONTEXT_MODULE } from './store';
import { SET_APP_ERROR, SET_APP_IS_LOADING } from './store/actions';
import { logIn } from './utils/auth';
import reportError from './utils/report-error';
import App from './App.vue';

// ==============================================================================
// SENTRY
// ==============================================================================
initSentry({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  integrations: [new VueIntegration({ Vue })],
});

// ==============================================================================
// ROUTING
// ==============================================================================
router.onError((error) => {
  store.dispatch(`${CONTEXT_MODULE}/${SET_APP_ERROR}`, error);
  reportError(error);
});

router.beforeEach((to, from, next) => {
  store.dispatch(`${CONTEXT_MODULE}/${SET_APP_IS_LOADING}`, true);

  const isLoggedIn = store.getters[`${USER_MODULE}/isLoggedIn`];
  const userHasPerms = store.getters[`${USER_MODULE}/userHasPerms`];
  const userError = store.getters[`${USER_MODULE}/userError`];
  const { requiresLogIn, permissions: routePermissions } = to.meta as RouteMeta;

  if (requiresLogIn && userError) {
    next(userError);
  } else if (requiresLogIn && !isLoggedIn) {
    logIn(to);
  } else if (!userHasPerms(routePermissions)) {
    next(new NotAllowedError());
  } else {
    next();
  }
});

router.afterEach(() => {
  store.dispatch(`${CONTEXT_MODULE}/${SET_APP_IS_LOADING}`, false);
});

// ==============================================================================
// APOLLO + GRAPHQL
// ==============================================================================
const httpLink = createHttpLink({
  uri: `${APP_URL}/graph/`,
  useGETForQueries: true,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = store.getters[`${USER_MODULE}/accessToken`];

  if (accessToken) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    }));
  }

  return forward(operation);
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authMiddleware.concat(httpLink),
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

// ==============================================================================
// AXIOS
// ==============================================================================
configureAxios();

// ==============================================================================
// GET VUE READY
// ==============================================================================
Vue.use(VueApollo);
Vue.use(Vuetify);
Vue.use(VueMeta);
Vue.component('VIcon', VIcon);

// eslint-disable-next-line no-new
new Vue({
  ...App,
  apolloProvider,
  el: '#app',
  render: (h): Vue.VNode => h(App),
  router,
  store,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      options: {
        cspNonce: VUETIFY_NONCE,
      },
    },
  }),
});
