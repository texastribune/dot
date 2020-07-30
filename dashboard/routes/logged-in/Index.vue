<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { mapActions } from 'vuex';
import VueRouter, { Route } from 'vue-router';
import { VMain, VContainer, VRow, VCol } from 'vuetify/lib';

import { USER_MODULE } from '../../store';
import { GET_TOKENS } from '../../store/actions';

export default Vue.extend({
  name: 'LoggedInRoute',

  components: { VMain, VContainer, VRow, VCol },

  async mounted() {
    const route = this.$route as Route;
    const router = this.$router as VueRouter;

    await this[GET_TOKENS](route.query.code);

    setTimeout(() => {
      const { next } = route.query;

      if (Array.isArray(next)) {
        return router.push({ name: 'overview' });
      }
      const { name, params, query } = JSON.parse(next);
      return router.push({ name, params, query });
    }, 5000);
  },

  methods: {
    ...mapActions(USER_MODULE, [GET_TOKENS]),
  },

  metaInfo: {
    title: 'Logged In',
  },
});
</script>

<template>
  <v-main class="text-center">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4"
          ><h1 class="mb-4">Logged in!</h1>
          <p>Sit tight, we're redirecting you to another page.</p></v-col
        ></v-row
      >
    </v-container>
  </v-main>
</template>
