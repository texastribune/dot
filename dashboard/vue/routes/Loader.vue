<template>
  <v-layout>
    <v-flex class="text-xs-center">
      <v-progress-circular
        indeterminate
        :size="100"
        color="primary"
      />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Loader',
};
</script>
