<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../node_modules/vuetify/types/lib.d.ts" />

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
