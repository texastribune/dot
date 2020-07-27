<script lang="ts">
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../node_modules/vuetify/types/lib.d.ts" />

import Vue, { PropType } from 'vue';
import {
  VProgressCircular,
  VDataTable,
  VTextField,
  VCard,
  VCardTitle,
  VCardText,
  VSpacer,
} from 'vuetify/lib';
import { DataTableHeader } from 'vuetify';

interface ComponentData {
  search: string;
}

export interface ViewsTableItem {
  content: string | null;
  views: number;
}

export function formatViewsTableItems<
  T extends { [key: string]: string | null },
  K extends keyof T
>(items: (T & { views: number })[], key: K): ViewsTableItem[] {
  return items.map((item) => ({ content: item[key], views: item.views }));
}

export const contentHeader = {
  value: 'content',
  align: 'start' as const,
};

export default Vue.extend({
  name: 'ViewsTable',

  components: {
    VProgressCircular,
    VDataTable,
    VTextField,
    VCard,
    VCardTitle,
    VCardText,
    VSpacer,
  },

  props: {
    contentHeader: {
      type: Object as PropType<DataTableHeader>,
      required: true,
    },

    isLoading: {
      type: Boolean,
      required: true,
    },

    items: {
      type: Array as PropType<ViewsTableItem[]>,
      required: true,
    },

    totalViews: {
      type: Number,
      required: true,
    },
  },

  data(): ComponentData {
    return { search: '' };
  },

  computed: {
    headers(): DataTableHeader[] {
      return [
        this.contentHeader,
        {
          text: 'Views',
          sortable: true,
          value: 'views',
          align: 'start',
        },
      ];
    },
  },

  methods: {
    formatViews(views: number): string {
      return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
});
</script>

<template>
  <div>
    <v-progress-circular
      v-if="isLoading"
      :width="3"
      :size="50"
      color="#539bae"
      indeterminate
    />

    <v-card v-else>
      <v-card-title v-if="items.length">
        <slot name="heading"></slot>
        <v-spacer />
        <v-text-field
          v-model="search"
          label="Search the below table"
          single-line
          hide-details
        />
        <v-card-text>
          <p>
            Total views: <strong>{{ formatViews(totalViews) }}</strong>
          </p>
        </v-card-text>
      </v-card-title>

      <v-data-table :headers="headers" :items="items" :search="search">
        <template #item.content="{ item: { content } }">
          <slot name="content" :content="content"></slot>
        </template>

        <template #item.views="{ item: { views } }">
          <span>{{ formatViews(views) }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
