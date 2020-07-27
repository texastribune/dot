<script lang="ts">
/* eslint-disable @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { VDatePicker, VAppBar, VDialog, VTextField, VBtn } from 'vuetify/lib';
import moment from 'moment-timezone';

import getInitialDates from './get-initial-dates';

const DISPLAY_DATE_FORMAT = 'MMMM Do, YYYY';

const Component = Vue.extend({
  name: 'MainRoute',

  components: {
    VDatePicker,
    VAppBar,
    VDialog,
    VTextField,
    VBtn,
  },

  data() {
    const { startDate, endDate, error } = getInitialDates(this.$route);

    return {
      finalDates: [startDate, endDate],
      pickerDates: [startDate, endDate],
      pickerError: error,
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

  mounted(): void {
    if (this.pickerError) {
      this.updateQueryParams();
    }
  },

  methods: {
    onUpdateClick(): void {
      this.finalDates = this.pickerDates;
      this.updateQueryParams();
      this.closeModal();
    },

    onCancelClick(): void {
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

    showModal(): void {
      this.modalIsVisible = true;
    },

    closeModal(): void {
      this.modalIsVisible = false;
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
    <v-app-bar app color="indigo" dark>
      <h1>
        <router-link :to="{ name: 'overview' }"
          >Texas Tribune pixel tracker</router-link
        >
      </h1>
    </v-app-bar>

    <section>
      <h2>Date range</h2>

      <v-dialog v-model="modalIsVisible" width="290px">
        <template #activator="{ on, attrs }">
          <v-text-field
            ref="input"
            :value="inputValue"
            readonly
            v-bind="attrs"
            v-on="on"
            @keyup.enter="on.click"
          />
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

    <main>
      <router-view
        :gql-start-date="queryStartDate"
        :gql-end-date="queryEndDate"
        :query-param-start-date="startDate"
        :query-param-end-date="endDate"
      />
    </main>
  </div>
</template>
