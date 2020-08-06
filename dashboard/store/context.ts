/* eslint-disable no-param-reassign */

import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';

import { SET_APP_ERROR, SET_APP_IS_LOADING } from './actions';

interface State {
  appError: Error | null;
  appIsLoading: boolean;
}

function createDefaultState(): State {
  return { appError: null, appIsLoading: false };
}

const mutations: MutationTree<State> = {
  SET_ERROR(state: State, error: Error): void {
    state.appError = error;
  },

  SET_IS_LOADING(state: State, isLoading: boolean): void {
    state.appIsLoading = isLoading;
  },
};

const actions: ActionTree<State, {}> = {
  [SET_APP_ERROR]: ({ commit }, error): void => {
    commit('SET_ERROR', error);
  },

  [SET_APP_IS_LOADING]: ({ commit }, isLoading): void => {
    commit('SET_IS_LOADING', isLoading);
  },
};

const getters: GetterTree<State, {}> = {
  appError: ({ appError }) => appError,
  appIsLoading: ({ appIsLoading }) => appIsLoading,
};

const module: Module<State, {}> = {
  namespaced: true,
  state: createDefaultState(),
  mutations,
  actions,
  getters,
};

export default module;
