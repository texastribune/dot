<template>
  <v-card>
    <v-card-title>...</v-card-title>
    <v-card-text>...</v-card-text>
  </v-card>
</template>

<script lang="ts">
/// <reference path="../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { VCard, VCardText, VCardTitle } from 'vuetify/lib';

export default Vue.extend({
  name: 'TestComponent',

  components: {
    VCard,
    VCardText,
    VCardTitle,
  },
});
</script>
