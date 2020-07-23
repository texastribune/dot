<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { VDatePicker } from 'vuetify/lib';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import getInitialDates from './get-initial-dates';

const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';

const Component = Vue.extend({
  name: 'MainRoute',

  components: { VDatePicker },

  data() {
    const { startDate, endDate, error } = getInitialDates(this.$route);

    return {
      finalDates: [startDate, endDate],
      pickerDates: [startDate, endDate],
      pickerError: error,
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
      this.updateQueryParams();
    },
  },

  mounted(): void {
    if (this.pickerError) {
      this.updateQueryParams();
    }
  },

  methods: {
    onBtnClick(): void {
      this.finalDates = this.pickerDates;
    },

    onPickerChange(newDates: string[]): void {
      this.pickerDates = newDates.sort();
    },

    updateQueryParams(): void {
      const { startDate, endDate } = this;
      this.$router.replace({ query: { startDate, endDate } });
    },
  },
});

export default Component;
</script>

<template>
  <div>
    <h1>Texas Tribune pixel tracker</h1>
    <v-date-picker v-model="pickerDates" range @change="onPickerChange" />
    <button :disabled="!canUpdate" type="button" @click="onBtnClick">
      Update
    </button>
    <router-view
      :gql-start-date="queryStartDate"
      :gql-end-date="queryEndDate"
      :query-param-start-date="startDate"
      :query-param-end-date="endDate"
    />
  </div>
</template>
