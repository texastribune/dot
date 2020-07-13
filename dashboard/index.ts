// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

import { APP_URL } from '../shared-config';
import { NotAllowedError } from './errors';
import { RouteMeta } from './types';
import router from './routes';
import store, { USER_MODULE, CONTEXT_MODULE } from './store';
import { SET_APP_ERROR } from './store/actions';
import { logIn } from './auth';
import App from './App.vue';

router.onReady(() => {
  router.onError((error) => {
    store.dispatch(`${CONTEXT_MODULE}/${SET_APP_ERROR}`, error);
  });

  router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters[`${USER_MODULE}/isLoggedIn`];
    const isAllowed = store.getters[`${USER_MODULE}/isAllowed`];
    const userError = store.getters[`${USER_MODULE}/userError`];
    const {
      requiresLogIn,
      permissions: routePermissions,
    } = to.meta as RouteMeta;

    if (requiresLogIn && userError) {
      return next(userError);
    }

    if (requiresLogIn && !isLoggedIn) {
      return logIn(to.name || undefined);
    }

    if (!isAllowed(routePermissions)) {
      return next(new NotAllowedError());
    }

    return next();
  });
});

const apolloClient = new ApolloClient({
  uri: `${APP_URL}/graph/`,
  request: (operation): void => {
    const accessToken = store.getters[`${USER_MODULE}/accessToken`];

    if (accessToken) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  },
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.use(VueApollo);
Vue.use(Vuetify);

// eslint-disable-next-line no-new
new Vue({
  ...App,
  apolloProvider,
  el: '#app',
  render: (h): Vue.VNode => h(App),
  router,
  store,
  vuetify: new Vuetify(),
});
