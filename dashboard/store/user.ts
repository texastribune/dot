/* eslint-disable no-param-reassign */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';

import { AccessTokenPayload, UserPermissions } from '../../shared-types';
import auth from '../auth';
import { GET_TOKENS, REFRESH_TOKENS } from './actions';

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
  DESTROY(state: State): void {
    Object.assign(state, createDefaultState());
  },

  SET_ERROR(state: State, error: Error): void {
    state.error = error;
    state.accessToken = '';
    state.accessTokenPayload = getInitialAccessTokenPayload();
  },

  SET_LOGGED_OUT(state: State): void {
    Object.assign(state, createDefaultState());
  },

  SET_READY(state: State, accessToken: string): void {
    state.isLoggedIn = true;
    state.accessToken = accessToken;
    state.accessTokenPayload = jwt.decode(accessToken) as AccessTokenPayload;
  },
};

const actions: ActionTree<State, {}> = {
  [GET_TOKENS]: async ({ commit }, code): Promise<void> => {
    try {
      const {
        data: { tokens },
      } = await axios.get<{
        tokens: { id_token: string; access_token: string };
      }>(`/api/v2/tokens/?code=${code}`);
      commit('SET_READY', tokens.access_token);
    } catch (error) {
      commit('SET_ERROR', error);
    }
  },

  [REFRESH_TOKENS]: async ({ commit }): Promise<void> => {
    try {
      await new Promise((resolve, reject) => {
        auth.checkSession(
          { responseType: 'token id_token' },
          (err, authResult) => {
            if (err) {
              reject(err);
            } else {
              commit('SET_READY', authResult.accessToken);
              resolve();
            }
          }
        );
      });
    } catch (error) {
      if (error.code === 'login_required') {
        commit('SET_LOGGED_OUT');
      } else {
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
