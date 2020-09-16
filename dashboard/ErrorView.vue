<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { VMain, VContainer, VRow, VCol } from 'vuetify/lib';

import { AppError } from './errors';
import { CONTEXT_MODULE } from './store';

export default Vue.extend({
  name: 'ErrorView',

  components: { VMain, VContainer, VRow, VCol },

  computed: {
    ...mapGetters(CONTEXT_MODULE, ['appError']),

    message(): string {
      if (this.appError instanceof AppError) {
        return `${this.appError.message}.`;
      }
      return 'We\'re working hard to fix the problem.';
    },
  },

  metaInfo: {
    title: 'Error',
  },
});
</script>

<template>
  <v-main class="text-center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4"
          ><h1 class="mb-4">Oops, something went wrong.</h1>
          <p>{{ message }}</p>
          <p>Try <a href="/dashboard/">returning home</a>.</p></v-col
        ></v-row
      >
    </v-container>
  </v-main>
</template>
