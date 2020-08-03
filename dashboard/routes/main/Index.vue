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
  VAlert,
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
    VAlert,
  },

  data() {
    const {
      startDate,
      endDate,
      defaultStartDate,
      defaultEndDate,
      error,
    } = getInitialDates(this.$route);

    return {
      defaultDates: [defaultStartDate, defaultEndDate],
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

    rangeSentence(): string {
      return `${this.displayStartDate} through ${this.displayEndDate}`;
    },
  },

  watch: {
    modalIsVisible(isVisible: boolean): void {
      if (!isVisible) {
        this.resetPicker();
        this.focusOnInput();
      }
    },
  },

  mounted(): void {
    if (this.pickerError) {
      this.$router.replace({ query: {} });
    }
  },

  beforeRouteUpdate(to, from, next) {
    const { startDate, endDate } = to.query;

    if (!startDate && !endDate) {
      this.finalDates = [...this.defaultDates];
    } else {
      this.finalDates = [startDate as string, endDate as string];
    }

    this.resetPicker();
    next();
  },

  methods: {
    onUpdateClick(): void {
      const [startDate, endDate] = this.pickerDates;
      this.$router.push({ query: { startDate, endDate } });
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

    resetPicker(): void {
      this.pickerDates = [...this.finalDates];
    },
  },
});

export default Component;
</script>

<template>
  <v-container>
    <section class="mt-16">
      <h2>
        Date range<span class="is-sr-only">: {{ rangeSentence }}</span>
      </h2>

      <v-alert
        v-if="pickerError"
        type="error"
        transition="scale-transition"
        class="mt-4"
        dismissible
      >
        {{ pickerError.message }}. Falling back to default date range of last
        two weeks.
      </v-alert>

      <v-dialog v-model="modalIsVisible" width="290px" eager>
        <template #activator="{ on, attrs }">
          <v-text-field
            ref="input"
            aria-label="Update date range"
            :value="rangeSentence"
            readonly
            v-bind="attrs"
            v-on="on"
            @keydown.enter="on.click"
          >
            <template #prepend>
              <v-icon>{{ calendarIcon }}</v-icon>
            </template>
          </v-text-field>
        </template>

        <v-date-picker v-model="pickerDates" range @change="onPickerChange">
          <v-btn text color="primary" @click="closeModal">Cancel</v-btn>
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
