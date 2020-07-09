<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Route } from 'vue-router';

import { NotAllowedError } from '../../errors';
import { USER_MODULE } from '../../store';
import { RouteMeta } from '../../types';
import { logIn } from '../../auth';

export default Vue.extend({
  name: 'DomainDetailRoute',

  computed: {
    ...mapGetters(USER_MODULE, ['isLoggedIn', 'isAllowed', 'userError']),
  },

  mounted(): void {
    const route = this.$route as Route;
    const {
      requiresLogIn,
      permissions: routePermissions,
    } = route.meta as RouteMeta;

    if (requiresLogIn && this.userError) {
      throw this.userError;
    } else if (requiresLogIn && !this.isLoggedIn) {
      logIn(route.name || undefined);
    } else if (!this.isAllowed(routePermissions)) {
      throw new NotAllowedError();
    }
  },
});
</script>

<template>
  <h1>Domain Detail</h1>
</template>
