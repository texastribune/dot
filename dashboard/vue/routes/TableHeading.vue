<template>
  <header class="mb-3">
    <h1 class="mb-3">{{ headline }}</h1>
    <h2 class="subheading">
      <strong>{{ numberWithCommas(number) }}</strong> {{ numberLabel }} from
      {{ fromDateFormatted }} through {{ toDateFormatted }}
    </h2>
  </header>
</template>

<script>
import format from 'date-fns/format';

import { numberMixin } from '../mixins';

export default {
  name: 'TableHeading',

  mixins: [numberMixin],

  props: {
    headline: {
      type: String,
      required: true,
    },

    number: {
      type: Number,
      required: true,
    },

    numberLabel: {
      type: String,
      required: true,
    },

    fromDate: {
      type: String,
      required: true,
    },

    toDate: {
      type: String,
      required: true,
    },
  },

  computed: {
    fromDateFormatted() {
      return format(this.fromDate, 'MMMM D, YYYY');
    },

    toDateFormatted() {
      return format(this.toDate, 'MMMM D, YYYY');
    },
  },
};
</script>
