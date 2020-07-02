<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import { NotAllowedError } from '../../errors';
import { USER_MODULE } from '../../store';
import { RouteMeta } from '../../types';
import { logIn } from '../../auth';

export default Vue.extend({
  name: 'OverviewRoute',

  computed: {
    ...mapGetters(USER_MODULE, ['isLoggedIn', 'isAllowed', 'userError']),
  },

  created(): void {
    const { requiresLogIn, permissions: routePermissions } = this.$route
      .meta as RouteMeta;

    if (requiresLogIn && this.userError) {
      throw this.userError;
    } else if (requiresLogIn && !this.isLoggedIn) {
      logIn();
    } else if (!this.isAllowed(routePermissions)) {
      throw new NotAllowedError();
    }
  },
});
</script>

<template>
  <h1>Overview</h1>
</template>
