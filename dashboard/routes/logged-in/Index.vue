<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import VueRouter, { Route } from 'vue-router';

import { USER_MODULE } from '../../store';
import { GET_TOKENS } from '../../store/actions';

export default Vue.extend({
  name: 'LoggedInRoute',

  async mounted() {
    const route = this.$route as Route;
    const router = this.$router as VueRouter;

    await this[GET_TOKENS](route.query.code);

    setTimeout(() => {
      // extract out Auth0 query params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { next, code, state, ...restQueryParams } = route.query;

      router.push({
        name: route.query.next as string,
        query: restQueryParams,
      });
    }, 3000);
  },

  methods: {
    ...mapActions(USER_MODULE, [GET_TOKENS]),
  },
});
</script>

<template>
  <h1>Logged in!</h1>
</template>
