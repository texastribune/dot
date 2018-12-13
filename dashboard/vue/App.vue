<template>
  <v-app light>
    <v-container>
      <date-form
        @setTableDates="setTableDates"
        class="mb-5"
      />
      <router-view
        :from-date="dbFormattedDate(tableFromDate)"
        :to-date="dbFormattedDate(tableToDate)"
      />
    </v-container>
  </v-app>
</template>

<script>
import format from 'date-fns/format';
import addWeeks from 'date-fns/add_weeks';

import DateForm from './form/index.vue';

export default {
  name: 'App',

  components: {
    DateForm,
  },

  data() {
    const data = {};
    const twoWeeksAgo = addWeeks(new Date(Date.now()), -2);
    const now = new Date(Date.now());

    data.tableFromDate = twoWeeksAgo;
    data.tableToDate = now;

    return data;
  },

  methods: {
    dbFormattedDate(date) {
      return format(date, 'YYYY-MM-DD');
    },

    setTableDates(fromDate, toDate) {
      this.tableFromDate = fromDate;
      this.tableToDate = toDate;
    },
  },
};
</script>
