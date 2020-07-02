<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import { CONTEXT_MODULE } from './store';
import { NotAllowedError } from './errors';

export default Vue.extend({
  name: 'ErrorView',

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError']),

    message(): string {
      if (this.appError instanceof NotAllowedError) {
        return 'You do not have sufficient permissions to view this route.';
      }
      return 'Sorry about that! Something went wrong.';
    },
  },
});
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>
