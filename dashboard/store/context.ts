/* eslint-disable no-param-reassign */

import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';

import { SET_APP_ERROR } from './actions';

interface State {
  appError: Error | null;
}

function createDefaultState(): State {
  return { appError: null };
}

const mutations: MutationTree<State> = {
  SET_ERROR(state: State, error: Error): void {
    state.appError = error;
  },
};

const actions: ActionTree<State, {}> = {
  [SET_APP_ERROR]: async ({ commit }, error): Promise<void> => {
    commit('SET_ERROR', error);
  },
};

const getters: GetterTree<State, {}> = {
  appError: ({ appError }) => appError,
};

const module: Module<State, {}> = {
  namespaced: true,
  state: createDefaultState(),
  mutations,
  actions,
  getters,
};

export default module;
