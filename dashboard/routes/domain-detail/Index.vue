<script lang="ts">
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vue-apollo/types/vue.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { DataTableHeader } from 'vuetify';
import gql from 'graphql-tag';

import { USER_MODULE } from '../../store';
import { ViewsList, ViewsItemByCanonical } from '../../../shared-types';
import ViewsTable, {
  ViewsTableItem,
  formatViewsTableItems,
  contentHeader,
} from '../../components/ViewsTable.vue';

interface QueryVariables {
  startDate: string;
  endDate: string;
  domain: string;
}

interface ComponentData {
  header: DataTableHeader;
  viewsListByCanonical: ViewsList<ViewsItemByCanonical>;
}

export default Vue.extend({
  name: 'DomainDetailRoute',

  components: { ViewsTable },

  props: {
    gqlStartDate: {
      type: String,
      required: true,
    },

    gqlEndDate: {
      type: String,
      required: true,
    },
  },

  data(): ComponentData {
    return {
      header: {
        ...contentHeader,
        text: 'Canonical',
        sortable: false,
      },

      viewsListByCanonical: {
        items: [],
        totalViews: 0,
      },
    };
  },

  computed: {
    ...mapGetters(USER_MODULE, ['userIsReady']),

    totalViews(): number {
      return this.viewsListByCanonical.totalViews;
    },

    canonicalsList(): ViewsTableItem[] {
      return formatViewsTableItems<{ canonical: string }, 'canonical'>(
        this.viewsListByCanonical.items,
        'canonical'
      );
    },
  },

  apollo: {
    viewsListByCanonical: {
      query: gql`
        query ViewsListByCanonical(
          $startDate: DateTime!
          $endDate: DateTime!
          $domain: String!
        ) {
          viewsListByCanonical(
            startDate: $startDate
            endDate: $endDate
            domain: $domain
          ) {
            totalViews
            items {
              views
              ... on ViewsItemByCanonical {
                canonical
              }
            }
          }
        }
      `,
      variables(): QueryVariables {
        return {
          startDate: this.gqlStartDate,
          endDate: this.gqlEndDate,
          domain: this.$route.params.domain,
        };
      },
      skip(): boolean {
        return !this.userIsReady;
      },
    },
  },
});
</script>

<template>
  <main>
    <views-table
      :content-header="header"
      :is-loading="$apollo.queries.viewsListByCanonical.loading"
      :items="canonicalsList"
      :total-views="totalViews"
    >
      <template #content="{ content }">
        {{ content }}
      </template>
    </views-table>
  </main>
</template>