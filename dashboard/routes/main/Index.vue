<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import {
  VDatePicker,
  VDialog,
  VTextField,
  VBtn,
  VContainer,
  VMain,
} from 'vuetify/lib';
import moment from 'moment-timezone';
import { mdiCalendar } from '@mdi/js';

import getInitialDates from './get-initial-dates';

const DISPLAY_DATE_FORMAT = 'MMMM Do, YYYY';

const Component = Vue.extend({
  name: 'MainRoute',

  components: {
    VDatePicker,
    VDialog,
    VTextField,
    VBtn,
    VContainer,
    VMain,
  },

  data() {
    const { startDate, endDate, error } = getInitialDates(this.$route);

    return {
      defaultDates: [startDate, endDate],
      finalDates: [startDate, endDate],
      pickerDates: [startDate, endDate],
      pickerError: error,
      modalIsVisible: false,
      calendarIcon: mdiCalendar,
    };
  },

  computed: {
    startDate(): string {
      return this.finalDates[0];
    },

    endDate(): string {
      return this.finalDates[1];
    },

    displayStartDate(): string {
      return moment(this.startDate).format(DISPLAY_DATE_FORMAT);
    },

    displayEndDate(): string {
      return moment(this.endDate).format(DISPLAY_DATE_FORMAT);
    },

    queryStartDate(): string {
      return moment.tz(this.startDate, 'America/Chicago').utc().format();
    },

    queryEndDate(): string {
      return moment
        .tz(this.endDate, 'America/Chicago')
        .add(1, 'day')
        .utc()
        .format();
    },

    updateBtnReady(): boolean {
      return this.pickerDates.length === 2;
    },

    inputValue(): string {
      return `${this.displayStartDate} through ${this.displayEndDate}`;
    },
  },

  watch: {
    modalIsVisible(isVisible: boolean): void {
      if (!isVisible) {
        this.focusOnInput();
      }
    },
  },

  beforeRouteUpdate(to, from, next) {
    const { startDate, endDate } = to.query;

    if (
      !startDate ||
      !endDate ||
      Array.isArray(startDate) ||
      Array.isArray(endDate)
    ) {
      this.finalDates = [...this.defaultDates];
    } else {
      this.finalDates = [startDate, endDate];
    }

    this.pickerDates = [...this.finalDates];
    next();
  },

  methods: {
    onUpdateClick(): void {
      const [startDate, endDate] = this.pickerDates;
      this.$router.push({ query: { startDate, endDate } });
      this.closeModal();
    },

    onCancelClick(): void {
      this.pickerDates = [...this.defaultDates];
      this.closeModal();
    },

    onPickerChange(newDates: string[]): void {
      this.pickerDates = newDates.sort();
    },

    focusOnInput(): void {
      Vue.nextTick(() => {
        this.$refs.input.$refs.input.focus();
      });
    },

    closeModal(): void {
      this.modalIsVisible = false;
    },
  },
});

export default Component;
</script>

<template>
  <v-container>
    <section class="mt-16">
      <h2>Date range</h2>

      <v-dialog v-model="modalIsVisible" persistent width="290px">
        <template #activator="{ on, attrs }">
          <v-text-field
            ref="input"
            :value="inputValue"
            readonly
            v-bind="attrs"
            v-on="on"
            @keyup.enter="on.click"
          >
            <template #prepend>
              <v-icon>{{ calendarIcon }}</v-icon>
            </template>
          </v-text-field>
        </template>

        <v-date-picker v-model="pickerDates" range @change="onPickerChange">
          <v-btn text color="primary" @click="onCancelClick">Cancel</v-btn>
          <v-btn
            text
            color="primary"
            :disabled="!updateBtnReady"
            @click="onUpdateClick"
            >Update</v-btn
          >
        </v-date-picker>
      </v-dialog>
    </section>

    <v-main>
      <router-view
        :gql-start-date="queryStartDate"
        :gql-end-date="queryEndDate"
      />
    </v-main>
  </v-container>
</template>
