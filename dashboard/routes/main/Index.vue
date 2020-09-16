<script lang="ts">
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
      // what a user has clicked in the date picker
      chosenPickerDates: [startDate, endDate],
      // fallback in case valid query params not provided
      defaultDates: [defaultStartDate, defaultEndDate],
      // the month the date picker is currently showing
      displayedPickerDates: '',
      // the dates used in GraphQL queries
      finalDates: [startDate, endDate],
      // contains a user-friendly message if valid query params not provided
      pickerError: error,

      calendarIcon: mdiCalendar,
      modalIsVisible: false,
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
      return this.chosenPickerDates.length === 2;
    },

    pickerMax(): string {
      return moment().format('YYYY-MM-DD');
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
      const [startDate, endDate] = this.chosenPickerDates;
      this.$router.push({ query: { startDate, endDate } });
      this.closeModal();
    },

    onPickerChange(newDates: string[]): void {
      this.chosenPickerDates = newDates.sort();
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
      this.chosenPickerDates = [...this.finalDates];
      this.displayedPickerDates = this.finalDates.join();
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

        <v-date-picker
          v-model="chosenPickerDates"
          :max="pickerMax"
          :picker-date.sync="displayedPickerDates"
          range
          @change="onPickerChange"
        >
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
