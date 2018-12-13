import Summary from './routes/summary/index.vue';
import Article from './routes/article/index.vue';
import Reprinter from './routes/reprinter/index.vue';
import ErrorRoute from './routes/error/index.vue';

export default [
  {
    path: '/',
    component: Summary,
    name: 'summary',
    props: true,
  },
  {
    path: '/article/:canonical',
    component: Article,
    name: 'article',
    props: true,
  },
  {
    path: '/reprinter/:domain',
    component: Reprinter,
    name: 'reprinter',
    props: true,
  },
  {
    path: '/error',
    component: ErrorRoute,
    name: 'error',
  },
];
