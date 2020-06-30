<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import { USER_MODULE } from '../../store';
import { logIn } from '../../auth';

export default Vue.extend({
  name: 'OverviewRoute',

  computed: {
    ...mapGetters(USER_MODULE, ['isLoggedIn']),
  },

  mounted(): void {
    if (this.$route.meta.requiresLogIn && !this.isLoggedIn) {
      logIn();
    }
  },
});
</script>

<template>
  <h1>Overview</h1>
</template>
