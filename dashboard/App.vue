<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { VApp, VAppBar, VOverlay } from 'vuetify/lib';

import { CONTEXT_MODULE } from './store';
import { SET_APP_ERROR } from './store/actions';
import LoadingWheel from './components/LoadingWheel.vue';
import ErrorView from './ErrorView.vue';

export default Vue.extend({
  name: 'App',

  components: { ErrorView, VApp, VAppBar, VOverlay, LoadingWheel },

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError', 'appIsLoading']),

    showLoader(): boolean {
      const { appIsLoading, appError } = this;
      return appIsLoading && !appError;
    },
  },

  methods: {
    ...mapActions(CONTEXT_MODULE, [SET_APP_ERROR]),
  },

  errorCaptured(error) {
    this[SET_APP_ERROR](error);
  },

  metaInfo: {
    titleTemplate: '%s | Dot',
    title: 'Loading ...',
  },
});
</script>

<template>
  <v-app class="has-bg">
    <transition name="fade"
      ><v-overlay
        v-if="showLoader"
        class="has-blur"
        opacity=".6"
        aria-hidden="true"
        light
      >
        <loading-wheel /> </v-overlay
    ></transition>

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
