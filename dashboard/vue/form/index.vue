<template>
  <v-layout justify-center align-end>
    <v-flex class="xs2">
      <v-layout column align-center>
        <span>From</span>
        <from-date
          v-model="fromDate"
          input-class="input"
        />
      </v-layout>
    </v-flex>

    <v-flex class="xs2">
      <v-layout column align-center>
        <span>Through</span>
        <to-date
          v-model="toDate"
          :from-date="fromDate"
          input-class="input-class"
        />
      </v-layout>
    </v-flex>

    <v-flex class="xs2">
      <v-layout column>
        <v-btn
          color="primary"
          @click="handleClick"
        >
          Update
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import addWeeks from 'date-fns/add_weeks';

import FromDate from './FromDate.vue';
import ToDate from './ToDate.vue';

export default {
  name: 'DateForm',

  components: {
    FromDate,
    ToDate,
  },

  data() {
    const data = {};
    const twoWeeksAgo = addWeeks(new Date(Date.now()), -2);
    const now = new Date(Date.now());

    data.fromDate = twoWeeksAgo;
    data.toDate = now;

    return data;
  },

  methods: {
    handleClick() {
      this.$emit('setTableDates', this.fromDate, this.toDate);
    },
  },
};
</script>

<style>
  .input-class {
    background-color: #FFF;
    border: 1px solid #000;
    padding: 10px;
  }
</style>
