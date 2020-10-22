<script lang="ts">
import Vue from 'vue';
import { DataTableHeader } from 'vuetify';
import { MetaInfo } from 'vue-meta';
import gql from 'graphql-tag';

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
    totalViews(): number {
      return this.viewsListByCanonical.totalViews;
    },

    canonicalsList(): ViewsTableItem[] {
      return formatViewsTableItems<{ canonical: string }, 'canonical'>(
        this.viewsListByCanonical.items,
        'canonical'
      );
    },

    routeDomain(): string {
      return this.$route.params.domain;
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
          domain: this.routeDomain,
        };
      },
    },
  },

  metaInfo(): MetaInfo {
    return {
      title: `Domain detail ${
        this.canonicalsList.length ? `: ${this.routeDomain}` : ''
      }`,
    };
  },
});
</script>

<template>
  <views-table
    :search-form-label="`canonical URLs republished by ${routeDomain}`"
    :content-header="header"
    :is-loading="$apollo.queries.viewsListByCanonical.loading"
    :items="canonicalsList"
    :total-views="totalViews"
  >
    <template #heading="{ classes }">
      <h1 :class="classes">{{ routeDomain }}</h1>
    </template>
  </views-table>
</template>
