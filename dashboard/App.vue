<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { VApp, VAppBar, VOverlay } from 'vuetify/lib';

import { NetworkError } from '../shared-errors';
import reportError from './utils/report-error';
import reportNetworkError from './utils/report-network-error';
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

    if (error instanceof NetworkError) {
      reportNetworkError(error);
    } else {
      reportError(error);
    }

    return false;
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
