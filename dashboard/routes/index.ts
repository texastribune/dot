import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import LoggedIn from './logged-in/Index.vue';
import Main from './main/Index.vue';
import Overview from './overview/Index.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/logged-in/',
    name: 'loggedIn',
    component: LoggedIn,
    pathToRegexpOptions: { strict: true },
    meta: {
      requiresLogIn: false,
    },
  },
  {
    path: '/',
    component: Main,
    pathToRegexpOptions: { strict: true },
    meta: {
      requiresLogIn: true,
    },
    children: [
      {
        path: '',
        name: 'overview',
        component: Overview,
        pathToRegexpOptions: { strict: true },
        meta: {
          requiresLogIn: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  base: '/dashboard/',
  mode: 'history',
  routes,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
