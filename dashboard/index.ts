import Vue from 'vue';

import TestComponent from './TestComponent.vue';

// eslint-disable-next-line no-new
new Vue({
  ...TestComponent,
  el: '#app',
  render: (h): Vue.VNode => h(TestComponent),
});
