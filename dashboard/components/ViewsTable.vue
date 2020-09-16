<script lang="ts">
import Vue, { PropType } from 'vue';
import { VDataTable, VTextField } from 'vuetify/lib';
import { DataTableHeader } from 'vuetify';
import { mdiMagnify } from '@mdi/js';

import LoadingWheel from './LoadingWheel.vue';

interface ComponentData {
  search: string;
  searchIcon: string;
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
    VDataTable,
    VTextField,
    LoadingWheel,
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

    searchFormLabel: {
      type: String,
      required: true,
    },

    totalViews: {
      type: Number,
      required: true,
    },
  },

  data(): ComponentData {
    return {
      search: '',
      searchIcon: mdiMagnify,
    };
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
  <section>
    <div class="mb-2">
      <slot name="heading" :classes="['headline, font-weight-bold']"></slot>
    </div>

    <div class="text-center">
      <loading-wheel v-if="isLoading" />
    </div>

    <template v-if="!isLoading">
      <p class="text-subtitle-1">
        Page views: <strong>{{ formatViews(totalViews) }}</strong>
      </p>

      <form role="search" :aria-label="searchFormLabel">
        <v-text-field v-model="search" label="Search" single-line hide-details>
          <template #append>
            <v-icon>{{ searchIcon }}</v-icon>
          </template></v-text-field
        >
      </form>

      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:[`item.content`]="{ item: { content } }">
          <slot name="content" :content="content"></slot>
        </template>

        <template v-slot:[`item.views`]="{ item: { views } }">
          <span>{{ formatViews(views) }}</span>
        </template>
      </v-data-table>
    </template>
  </section>
</template>
