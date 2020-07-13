<script lang="ts">
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { VDatePicker } from 'vuetify/lib';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import getInitialDates from './get-initial-dates';

const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';

export default Vue.extend({
  name: 'MainRoute',

  components: { VDatePicker },

  data() {
    return {
      finalDates: getInitialDates(this.$route),
      pickerDates: getInitialDates(this.$route),
    };
  },

  computed: {
    canUpdate(): boolean {
      return this.pickerDates.length === 2;
    },

    startDate(): string {
      return this.finalDates[0];
    },

    endDate(): string {
      return this.finalDates[1];
    },

    displayStartDate(): string {
      return formatDate(parseISO(this.startDate), DISPLAY_DATE_FORMAT);
    },

    displayEndDate(): string {
      return formatDate(parseISO(this.endDate), DISPLAY_DATE_FORMAT);
    },

    queryStartDate(): string {
      return parseISO(this.startDate).toISOString();
    },

    queryEndDate(): string {
      return addDays(parseISO(this.endDate), 1).toISOString();
    },
  },

  watch: {
    finalDates(): void {
      const { startDate, endDate } = this;
      this.$router.push({ query: { startDate, endDate } });
    },
  },

  methods: {
    onBtnClick(): void {
      this.finalDates = this.pickerDates;
    },

    onPickerChange(newDates: string[]): void {
      this.pickerDates = newDates.sort();
    },
  },
});
</script>

<template>
  <div>
    <v-date-picker v-model="pickerDates" range @change="onPickerChange" />
    <button :disabled="!canUpdate" type="button" @click="onBtnClick">
      Update
    </button>
    <router-view
      :display-start-date="displayStartDate"
      :display-end-date="displayEndDate"
      :query-start-date="queryStartDate"
      :query-end-date="queryEndDate"
    />
  </div>
</template>
