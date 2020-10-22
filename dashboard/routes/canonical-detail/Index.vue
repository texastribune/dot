<script lang="ts">
import Vue from 'vue';
import { DataTableHeader } from 'vuetify';
import { MetaInfo } from 'vue-meta';
import gql from 'graphql-tag';

import { ViewsList, ViewsItemByDomain } from '../../../shared-types';
import ViewsTable, {
  ViewsTableItem,
  formatViewsTableItems,
  contentHeader,
} from '../../components/ViewsTable.vue';

interface QueryVariables {
  startDate: string;
  endDate: string;
  canonical: string;
}

interface ComponentData {
  header: DataTableHeader;
  viewsListByDomain: ViewsList<ViewsItemByDomain>;
}

export default Vue.extend({
  name: 'CanonicalDetailRoute',

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
        text: 'Domain',
        sortable: false,
      },

      viewsListByDomain: {
        items: [],
        totalViews: 0,
      },
    };
  },

  computed: {
    totalViews(): number {
      return this.viewsListByDomain.totalViews;
    },

    domainsList(): ViewsTableItem[] {
      return formatViewsTableItems<{ domain: string | null }, 'domain'>(
        this.viewsListByDomain.items,
        'domain'
      );
    },

    routeCanonical(): string {
      return this.$route.params.canonical;
    },
  },

  apollo: {
    viewsListByDomain: {
      query: gql`
        query ViewsListByDomain(
          $startDate: DateTime!
          $endDate: DateTime!
          $canonical: String!
        ) {
          viewsListByDomain(
            startDate: $startDate
            endDate: $endDate
            canonical: $canonical
          ) {
            totalViews
            items {
              views
              ... on ViewsItemByDomain {
                domain
              }
            }
          }
        }
      `,
      variables(): QueryVariables {
        return {
          startDate: this.gqlStartDate,
          endDate: this.gqlEndDate,
          canonical: this.routeCanonical,
        };
      },
    },
  },

  metaInfo(): MetaInfo {
    return {
      title: `Canonical detail ${
        this.domainsList.length ? `: ${this.routeCanonical}` : ''
      }`,
    };
  },
});
</script>

<template>
  <views-table
    search-form-label="domains that republished route canonical URL"
    :content-header="header"
    :is-loading="$apollo.queries.viewsListByDomain.loading"
    :items="domainsList"
    :total-views="totalViews"
  >
    <template #heading="{ classes }">
      <h1 :class="classes">{{ routeCanonical }}</h1>
    </template>
  </views-table>
</template>
