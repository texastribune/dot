// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import Vuetify, { VIcon } from 'vuetify/lib';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import VueMeta from 'vue-meta';

import { APP_URL } from '../shared-config';
import { NotAllowedError } from './errors';
import { RouteMeta } from './types';
import router from './routes';
import store, { USER_MODULE, CONTEXT_MODULE } from './store';
import { SET_APP_ERROR, SET_APP_IS_LOADING } from './store/actions';
import { logIn } from './auth';
import App from './App.vue';

router.onError((error) => {
  store.dispatch(`${CONTEXT_MODULE}/${SET_APP_ERROR}`, error);
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
  }),
});
