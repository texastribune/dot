<script lang="ts">
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { VDatePicker } from 'vuetify/lib';
import addDays from 'date-fns/addDays';
import parseISO from 'date-fns/parseISO';

import getInitialDates from './get-initial-dates';

export default Vue.extend({
  name: 'MainRoute',

  components: { VDatePicker },

  data() {
    return {
      dates: getInitialDates(this.$route),
      queryStartDate: '',
      queryEndDate: '',
    };
  },

  computed: {
    bothDatesSelected(): boolean {
      return !!this.startDate && !!this.endDate;
    },

    startDate(): string {
      return this.dates[0];
    },

    endDate(): string {
      if (this.dates.length === 2) {
        return this.dates[1];
      }
      return '';
    },
  },

  methods: {
    updateQueryDates(): void {
      this.queryStartDate = parseISO(this.startDate).toISOString();
      this.queryEndDate = addDays(parseISO(this.endDate), 1).toISOString();
    },

    onBtnClick(): void {
      const { startDate, endDate } = this;

      this.updateQueryDates();
      this.$router.push({ query: { startDate, endDate } });
    },

    onPickerChange(newDates: string[]): void {
      this.dates = newDates.sort();
    },
  },
});
</script>

<template>
  <div>
    <v-date-picker v-model="dates" range @change="onPickerChange" />
    <button :disabled="!bothDatesSelected" type="button" @click="onBtnClick">
      Update
    </button>
    <router-view :start-date="queryStartDate" :end-date="queryEndDate" />
  </div>
</template>
