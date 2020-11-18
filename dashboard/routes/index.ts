import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import { RouteMeta } from '../types';
import LoggedIn from './logged-in/Index.vue';

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
    component: (): Promise<typeof import('*.vue')> =>
      import(/* webpackChunkName: "main-route" */ './main/Index.vue'),
    pathToRegexpOptions: { strict: true },
    meta: buildRouteMeta({
      requiresLogIn: true,
      permissions: ['dot:view_data'],
    }),
    children: [
      {
        path: '',
        name: 'overview',
        component: (): Promise<typeof import('*.vue')> =>
          import(
            /* webpackChunkName: "overview-route" */ './overview/Index.vue'
          ),
        pathToRegexpOptions: { strict: true },
        meta: buildRouteMeta({
          requiresLogIn: true,
          permissions: ['dot:view_data'],
        }),
      },
      {
        path: 'canonical/:canonical/',
        name: 'canonicalDetail',
        component: (): Promise<typeof import('*.vue')> =>
          import(
            /* webpackChunkName: "canonical-detail-route" */ './canonical-detail/Index.vue'
          ),
        pathToRegexpOptions: { strict: true },
        meta: buildRouteMeta({
          requiresLogIn: true,
          permissions: ['dot:view_data'],
        }),
      },
      {
        path: 'domain/:domain/',
        name: 'domainDetail',
        component: (): Promise<typeof import('*.vue')> =>
          import(
            /* webpackChunkName: "domain-detail-route" */ './domain-detail/Index.vue'
          ),
        pathToRegexpOptions: { strict: true },
        meta: buildRouteMeta({
          requiresLogIn: true,
          permissions: ['dot:view_data'],
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
