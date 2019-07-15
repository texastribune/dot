import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import VueApollo from 'vue-apollo';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';

import App from './App.vue';
import routes from './routes';
// import config from '../config';
import sharedConfig from '../../shared-config';
import logToConsoleOrSentry from '../errors';

// require('vuetify/dist/vuetify.min.css');

// const { sentryUrl } = config;
const {
  isDev,
  isTest,
  prodDomain,
  testDomain,
} = sharedConfig;

// error handling
if (isDev) {
  Vue.config.errorHandler = (err) => {
    console.error(err); // eslint-disable-line no-console
  };
} else {
  // Raven.config(sentryUrl).addPlugin(RavenVue, Vue).install();
}

// general Vue config
Vue.use(VueApollo);
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.config.productionTip = false;

// Apollo set-up
let uri;
if (isDev) {
  uri = '/graphql';
} else if (isTest) {
  uri = `${testDomain}graphql`;
} else {
  uri = `${prodDomain}graphql`;
}

const link = new HttpLink({ uri });
const defaultClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient,

  errorHandler(err) {
    logToConsoleOrSentry(err);
    this.error = true;
    this.$router.push({ name: 'error' });
  },

  watchLoading(isLoading) {
    this.loading = isLoading;
  },
});

// router set-up
const router = new VueRouter({
  routes,
  base: '/dashboard/',
  mode: 'history',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  apolloProvider,
  router,
  render: h => h(App),
});
