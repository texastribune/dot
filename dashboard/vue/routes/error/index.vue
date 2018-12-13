<template>
  <header>
    <h1>There was an error. Sorry about that!</h1>
    <router-link :to="{ name: 'summary' }">
      Go back to summary dashboard.
    </router-link>
  </header>
</template>

<script>
export default {
  name: 'ErrorRoute',
};
</script>
