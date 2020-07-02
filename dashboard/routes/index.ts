import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import { UserPermissions } from '../../shared-types';
import { RouteMeta } from '../types';
import LoggedIn from './logged-in/Index.vue';
import Main from './main/Index.vue';
import Overview from './overview/Index.vue';

Vue.use(VueRouter);

function buildRouteMeta({ requiresLogIn, permissions }: RouteMeta): RouteMeta {
  return { requiresLogIn, permissions };
}

const routes: RouteConfig[] = [
  {
    path: '/logged-in/',
    name: 'loggedIn',
    component: LoggedIn,
    pathToRegexpOptions: { strict: true },
    meta: buildRouteMeta({ requiresLogIn: false, permissions: [] }),
  },
  {
    path: '/',
    component: Main,
    pathToRegexpOptions: { strict: true },
    children: [
      {
        path: '',
        name: 'overview',
        component: Overview,
        pathToRegexpOptions: { strict: true },
        meta: buildRouteMeta({
          requiresLogIn: true,
          permissions: [UserPermissions.ReadViews],
        }),
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
