<script lang="ts">
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../../../node_modules/vuetify/types/lib.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Route } from 'vue-router';
import { VDatePicker } from 'vuetify/lib';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { NotAllowedError } from '../../errors';
import { USER_MODULE } from '../../store';
import { RouteMeta } from '../../types';
import { logIn } from '../../auth';

import getInitialDates from './get-initial-dates';

const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';

const Component = Vue.extend({
  name: 'MainRoute',

  components: { VDatePicker },

  data() {
    const finalDates: string[] = [];
    const pickerDates: string[] = [];
    return {
      isLoading: true,
      finalDates,
      pickerDates,
    };
  },

  computed: {
    ...mapGetters(USER_MODULE, ['isLoggedIn', 'isAllowed', 'userError']),

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

  async mounted() {
    // Vue 3: Refactor with composition API
    const route = this.$route as Route;
    const {
      requiresLogIn,
      permissions: routePermissions,
    } = route.meta as RouteMeta;

    if (requiresLogIn && this.userError) {
      throw this.userError;
    } else if (requiresLogIn && !this.isLoggedIn) {
      logIn(route.name || undefined);
    } else if (!this.isAllowed(routePermissions)) {
      throw new NotAllowedError();
    } else {
      await this.prepareRoute();
      this.isLoading = false;
    }
  },

  methods: {
    prepareRoute(): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          const { startDate, endDate } = getInitialDates(this.$route);
          this.finalDates = [startDate, endDate];
          this.pickerDates = [startDate, endDate];
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    },

    onBtnClick(): void {
      this.finalDates = this.pickerDates;
    },

    onPickerChange(newDates: string[]): void {
      this.pickerDates = newDates.sort();
    },
  },
});

export default Component;
</script>

<template>
  <div v-if="!isLoading">
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
