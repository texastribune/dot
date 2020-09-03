/* eslint-disable no-param-reassign */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import { ActionTree, GetterTree, MutationTree, Module } from 'vuex';
import { setUser } from '@sentry/browser';

import { USER_PERMISSIONS } from '../../shared-config';
import { AccessTokenPayload } from '../../shared-types';
import auth from '../utils/auth';
import { GET_TOKENS, REFRESH_TOKENS } from './actions';

interface State {
  accessToken: string;
  accessTokenPayload: AccessTokenPayload;
  userError: Error | null;
  isLoggedIn: boolean;
}

function getInitialAccessTokenPayload(): AccessTokenPayload {
  return {
    sub: '',
    permissions: [],
  };
}

function createDefaultState(): State {
  return {
    accessToken: '',
    accessTokenPayload: getInitialAccessTokenPayload(),
    userError: null,
    isLoggedIn: false,
  };
}

const mutations: MutationTree<State> = {
  DESTROY(state: State): void {
    Object.assign(state, createDefaultState());
  },

  SET_ERROR(state: State, error: Error): void {
    state.userError = error;
    state.isLoggedIn = false;
    state.accessToken = '';
    state.accessTokenPayload = getInitialAccessTokenPayload();
  },

  SET_LOGGED_OUT(state: State): void {
    Object.assign(state, createDefaultState());
  },

  SET_READY(state: State, accessToken: string): void {
    const accessTokenPayload = jwt.decode(accessToken) as AccessTokenPayload;

    state.isLoggedIn = true;
    state.accessToken = accessToken;
    state.accessTokenPayload = accessTokenPayload;

    setUser({ id: accessTokenPayload.sub });
  },
};

const actions: ActionTree<State, {}> = {
  [GET_TOKENS]: async ({ commit }, code): Promise<void> => {
    const {
      data: { tokens },
    } = await axios.get<{
      tokens: { access_token: string };
    }>(`/api/v2/tokens/?code=${code}`);

    commit('SET_READY', tokens.access_token);
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
  accessToken: ({ accessToken }) => accessToken,

  userHasPerms: ({ accessTokenPayload: { permissions } }) => (
    requiredPermissions: USER_PERMISSIONS[]
  ): boolean => requiredPermissions.every((perm) => permissions.includes(perm)),

  isLoggedIn: ({ isLoggedIn }) => isLoggedIn,

  userError: ({ userError }) => userError,
};

const module: Module<State, {}> = {
  namespaced: true,
  state: createDefaultState(),
  mutations,
  actions,
  getters,
};

export default module;
