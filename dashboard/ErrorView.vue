<script lang="ts">
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
});
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>
