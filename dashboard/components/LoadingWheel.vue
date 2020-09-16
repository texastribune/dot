<script lang="ts">
import Vue from 'vue';
import { VProgressCircular } from 'vuetify/lib';

export default Vue.extend({
  name: 'LoadingWheel',

  components: {
    VProgressCircular,
  },
});
</script>

<template>
  <v-progress-circular color="primary" :width="3" :size="50" indeterminate />
</template>
