<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { CONTEXT_MODULE } from './store';
import { SET_APP_ERROR } from './store/actions';
import ErrorView from './ErrorView.vue';

export default Vue.extend({
  name: 'App',

  components: { ErrorView },

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError']),
  },

  methods: {
    ...mapActions(CONTEXT_MODULE, [SET_APP_ERROR]),
  },

  errorCaptured(error) {
    this[SET_APP_ERROR](error);
  },
});
</script>

<template>
  <error-view v-if="appError" />
  <router-view v-else />
</template>