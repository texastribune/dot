import Vue from 'vue';

import store from './store';
import App from './App.vue';

// eslint-disable-next-line no-new
new Vue({
  ...App,
  el: '#app',
  render: (h): Vue.VNode => h(App),
  store,
});
