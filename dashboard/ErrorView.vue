<script lang="ts">
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';

import { AppError } from '../server/errors';
import { CONTEXT_MODULE } from './store';

export default Vue.extend({
  name: 'ErrorView',

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError']),

    message(): string {
      if (this.appError instanceof AppError) {
        return this.appError.message;
      }
      return 'Oops! Something went wrong.';
    },
  },

  metaInfo: {
    title: 'Error',
  },
});
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>
