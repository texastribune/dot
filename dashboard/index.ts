import Vue from 'vue';

import router from './routes';
import store, { USER_MODULE } from './store';
import { logIn } from './auth';
import App from './App.vue';

router.onReady(() => {
  router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters[`${USER_MODULE}/isLoggedIn`];

    if (to.meta.requiresLogIn && !isLoggedIn) {
      return logIn();
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
