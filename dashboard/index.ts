import Vue from 'vue';

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
      return logIn();
    }

    if (!isAllowed(routePermissions)) {
      return next(new NotAllowedError());
    }

    return next();
  });
});

// eslint-disable-next-line no-new
new Vue({
  ...App,
  el: '#app',
  render: (h): Vue.VNode => h(App),
  router,
  store,
});
