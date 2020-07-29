<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { Route } from 'vue-router';
import { mapActions, mapGetters } from 'vuex';
import { VApp, VAppBar, VOverlay, VProgressCircular } from 'vuetify/lib';

import { NotAllowedError } from './errors';
import { RouteMeta } from './types';
import { logIn } from './auth';
import { CONTEXT_MODULE, USER_MODULE } from './store';
import { SET_APP_ERROR } from './store/actions';
import ErrorView from './ErrorView.vue';

export default Vue.extend({
  name: 'App',

  components: { ErrorView, VApp, VAppBar, VOverlay, VProgressCircular },

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError', 'appIsLoading']),
    ...mapGetters(USER_MODULE, ['isLoggedIn', 'userHasPerms', 'userError']),

    logInRequired(): boolean {
      const route = this.$route as Route;
      const { requiresLogIn } = route.meta as RouteMeta;
      const { isLoggedIn } = this;

      return requiresLogIn && !isLoggedIn;
    },

    morePermsRequired(): boolean {
      const route = this.$route as Route;
      const { permissions: routePermissions } = route.meta as RouteMeta;

      return !this.userHasPerms(routePermissions);
    },

    showLoader(): boolean {
      const { logInRequired, morePermsRequired, appIsLoading, appError } = this;
      return (logInRequired || morePermsRequired || appIsLoading) && !appError;
    },

    blurLoader(): boolean {
      const { logInRequired, morePermsRequired } = this;
      return logInRequired || morePermsRequired;
    },
  },

  mounted() {
    if (this.appError) {
      return;
    }

    if (this.logInRequired) {
      logIn(this.$route);
    }

    if (this.morePermsRequired) {
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
  <v-app style="background-color: #f9f9f9;">
    <v-overlay
      v-if="showLoader"
      :style="[blurLoader && { 'backdrop-filter': 'blur(5px)' }]"
      opacity=".8"
      aria-hidden="true"
      light
    >
      <v-progress-circular
        color="primary"
        :width="3"
        :size="50"
        indeterminate
      />
    </v-overlay>

    <v-app-bar app absolute dark dense class="primary">
      <router-link
        :to="{ name: 'overview' }"
        class="headline white--text"
        style="text-decoration: none;"
        >Texas Tribune pixel tracker</router-link
      >
    </v-app-bar>

    <error-view v-if="appError" />
    <router-view v-else />
  </v-app>
</template>
