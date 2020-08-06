import Vue from 'vue';
import Vuex from 'vuex';

import userModule from './user';
import contextModule from './context';

Vue.use(Vuex);

const USER_MODULE = 'user';
const CONTEXT_MODULE = 'context';

const store = new Vuex.Store({
  modules: {
    [USER_MODULE]: userModule,
    [CONTEXT_MODULE]: contextModule,
  },
});

export { USER_MODULE, CONTEXT_MODULE };
export default store;
