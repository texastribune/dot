<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

import { USER_MODULE } from '../../store';
import { GET_TOKENS } from '../../store/actions';

export default Vue.extend({
  name: 'LoggedInRoute',

  async mounted() {
    await this[GET_TOKENS](this.$route.query.code);

    setTimeout(() => {
      this.$router.push({ name: 'overview' });
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
