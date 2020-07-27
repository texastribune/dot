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
      const { next } = route.query;

      if (Array.isArray(next)) {
        return router.push({ name: 'overview' });
      }
      const { name, params, query } = JSON.parse(next);
      return router.push({ name, params, query });
    }, 3000);
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
  <h1>Logged in!</h1>
</template>
