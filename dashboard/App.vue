<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { Route } from 'vue-router';
import { mapActions, mapGetters } from 'vuex';
import { VApp } from 'vuetify/lib';

import { NotAllowedError } from './errors';
import { RouteMeta } from './types';
import { logIn } from './auth';
import { CONTEXT_MODULE, USER_MODULE } from './store';
import { SET_APP_ERROR } from './store/actions';
import ErrorView from './ErrorView.vue';

export default Vue.extend({
  name: 'App',

  components: { ErrorView, VApp },

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError']),
    ...mapGetters(USER_MODULE, ['isLoggedIn', 'isAllowed', 'userError']),
  },

  mounted() {
    const route = this.$route as Route;
    const {
      requiresLogIn,
      permissions: routePermissions,
    } = route.meta as RouteMeta;

    if (requiresLogIn && this.userError) {
      throw this.userError;
    } else if (requiresLogIn && !this.isLoggedIn) {
      logIn(route);
    } else if (!this.isAllowed(routePermissions)) {
      throw new NotAllowedError();
    }
  },

  methods: {
    ...mapActions(CONTEXT_MODULE, [SET_APP_ERROR]),
  },

  errorCaptured(error) {
    this[SET_APP_ERROR](error);
  },

  metaInfo: {
    titleTemplate: '%s | Dot',
  },
});
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto;">
    <v-app>
      <error-view v-if="appError" />
      <router-view v-else />
    </v-app>
  </div>
</template>
