import Vue from 'vue';
import Vuex from 'vuex';

import userModule from './user';

Vue.use(Vuex);

const USER_MODULE = 'user';

const store = new Vuex.Store({
  modules: {
    [USER_MODULE]: userModule,
  },
});

export { USER_MODULE };
export default store;
