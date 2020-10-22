<script lang="ts">
import Vue from 'vue';
import { DataTableHeader } from 'vuetify';
import gql from 'graphql-tag';

import {
  ViewsList,
  ViewsItemByDomain,
  ViewsItemByCanonical,
} from '../../../shared-types';
import ViewsTable, {
  ViewsTableItem,
  formatViewsTableItems,
  contentHeader,
} from '../../components/ViewsTable.vue';

interface QueryVariables {
  startDate: string;
  endDate: string;
}

interface ComponentData {
  canonicalHeader: DataTableHeader;
  domainHeader: DataTableHeader;
  viewsListByCanonical: ViewsList<ViewsItemByCanonical>;
  viewsListByDomain: ViewsList<ViewsItemByDomain>;
}

export default Vue.extend({
  name: 'OverviewRoute',

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
      canonicalHeader: {
        ...contentHeader,
        text: 'Canonical',
        sortable: false,
      },

      domainHeader: {
        ...contentHeader,
        text: 'Domain',
        sortable: false,
      },

      viewsListByCanonical: {
        items: [],
        totalViews: 0,
      },

      viewsListByDomain: {
        items: [],
        totalViews: 0,
      },
    };
  },

  computed: {
    totalViews(): number {
      return this.viewsListByCanonical.totalViews;
    },

    canonicalList(): ViewsTableItem[] {
      return formatViewsTableItems<{ canonical: string }, 'canonical'>(
        this.viewsListByCanonical.items,
        'canonical'
      );
    },

    domainsList(): ViewsTableItem[] {
      return formatViewsTableItems<{ domain: string | null }, 'domain'>(
        this.viewsListByDomain.items,
        'domain'
      );
    },
  },

  apollo: {
    viewsListByCanonical: {
      query: gql`
        query ViewsListByCanonical($startDate: DateTime!, $endDate: DateTime!) {
          viewsListByCanonical(startDate: $startDate, endDate: $endDate) {
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
        };
      },
    },

    viewsListByDomain: {
      query: gql`
        query ViewsListByDomain($startDate: DateTime!, $endDate: DateTime!) {
          viewsListByDomain(startDate: $startDate, endDate: $endDate) {
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
        };
      },
    },
  },

  metaInfo: {
    title: 'Overview',
  },
});
</script>

<template>
  <div>
    <div class="mb-16">
      <views-table
        search-form-label="canonical URLs"
        :content-header="canonicalHeader"
        :is-loading="$apollo.queries.viewsListByCanonical.loading"
        :items="canonicalList"
        :total-views="totalViews"
      >
        <template #heading="{ classes }">
          <h2 :class="classes">Summary by canonical URL</h2>
        </template>
        <template #content="{ content }">
          <router-link
            :to="{
              name: 'canonicalDetail',
              params: {
                canonical: content,
              },
              query: {
                startDate: $route.query.startDate || undefined,
                endDate: $route.query.endDate || undefined,
              },
            }"
            >{{ content }}</router-link
          >
        </template>
      </views-table>
    </div>

    <views-table
      search-form-label="republisher domains"
      :content-header="domainHeader"
      :is-loading="$apollo.queries.viewsListByDomain.loading"
      :items="domainsList"
      :total-views="totalViews"
    >
      <template #heading="{ classes }">
        <h2 :class="classes">Summary by domain</h2>
      </template>
      <template #content="{ content }">
        <template v-if="content">
          <router-link
            :to="{
              name: 'domainDetail',
              params: {
                domain: content,
              },
              query: {
                startDate: $route.query.startDate || undefined,
                endDate: $route.query.endDate || undefined,
              },
            }"
            >{{ content }}</router-link
          >
        </template>
      </template>
    </views-table>
  </div>
</template>
