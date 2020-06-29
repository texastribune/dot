/* eslint-disable no-param-reassign */

import jwt from 'jsonwebtoken';
import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';

import { AccessTokenPayload, UserPermissions } from '../../shared-types';
import auth from '../auth';
import { GET_USER } from './actions';

interface State {
  accessToken: string;
  accessTokenPayload: AccessTokenPayload;
  error: Error | null;
  isLoggedIn: boolean;
}

function getInitialAccessTokenPayload(): AccessTokenPayload {
  return { permissions: [] };
}

function createDefaultState(): State {
  return {
    accessToken: '',
    accessTokenPayload: getInitialAccessTokenPayload(),
    error: null,
    isLoggedIn: false,
  };
}

const mutations: MutationTree<State> = {
  // equivalent to being logged out
  DESTROY(state: State): void {
    Object.assign(state, createDefaultState());
  },

  SET_ACCESS_TOKEN(state: State, accessToken: string | null): void {
    if (accessToken) {
      state.accessToken = accessToken;
      state.accessTokenPayload = jwt.decode(accessToken) as AccessTokenPayload;
    } else {
      state.accessToken = '';
      state.accessTokenPayload = getInitialAccessTokenPayload();
    }
  },

  SET_ERROR(state: State, error: Error | null): void {
    state.error = error;
  },

  SET_LOGGED_IN(state: State, isLoggedIn: boolean): void {
    state.isLoggedIn = isLoggedIn;
  },
};

const actions: ActionTree<State, {}> = {
  [GET_USER]: async ({ commit }): Promise<void> => {
    try {
      await new Promise((resolve, reject) => {
        auth.checkSession(
          { responseType: 'token id_token' },
          (err, authResult) => {
            if (err) {
              reject(err);
            } else {
              commit('SET_LOGGED_IN', true);
              commit('SET_ACCESS_TOKEN', authResult.accessToken);
              commit('SET_ERROR', null);
              resolve();
            }
          }
        );
      });
    } catch (error) {
      if (error.code === 'login_required') {
        commit('DESTROY');
      } else {
        commit('SET_LOGGED_IN', true);
        commit('SET_ACCESS_TOKEN', null);
        commit('SET_ERROR', error);
      }
    }
  },
};

const getters: GetterTree<State, {}> = {
  canViewData: ({ accessTokenPayload: { permissions } }) =>
    permissions.includes(UserPermissions.ReadViews),

  error: ({ error }) => error,

  isLoggedIn: ({ isLoggedIn }) => isLoggedIn,

  isReady: ({ isLoggedIn, error }) => isLoggedIn && !error,
};

const module: Module<State, {}> = {
  namespaced: true,
  state: createDefaultState(),
  mutations,
  actions,
  getters,
};

export default module;
