<script lang="ts">
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vue-apollo/types/vue.d.ts" />
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { DataTableHeader } from 'vuetify';
import gql from 'graphql-tag';

import { USER_MODULE } from '../../store';
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

    queryParamStartDate: {
      type: String,
      required: true,
    },

    queryParamEndDate: {
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
    ...mapGetters(USER_MODULE, ['userIsReady']),

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
      skip(): boolean {
        return !this.userIsReady;
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
      skip(): boolean {
        return !this.userIsReady;
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
    <section>
      <views-table
        :content-header="canonicalHeader"
        :is-loading="$apollo.queries.viewsListByCanonical.loading"
        :items="canonicalList"
        :total-views="totalViews"
      >
        <template #heading>
          <h3>Summary by canonical URL</h3>
        </template>
        <template #content="{ content }">
          <router-link
            :to="{
              name: 'canonicalDetail',
              params: {
                canonical: content,
              },
              query: {
                startDate: queryParamStartDate,
                endDate: queryParamEndDate,
              },
            }"
            >{{ content }}</router-link
          >
        </template>
      </views-table>
    </section>

    <section>
      <views-table
        :content-header="domainHeader"
        :is-loading="$apollo.queries.viewsListByDomain.loading"
        :items="domainsList"
        :total-views="totalViews"
      >
        <template #heading>
          <h3>Summary by domain</h3>
        </template>
        <template #content="{ content }">
          <router-link
            :to="{
              name: 'domainDetail',
              params: {
                domain: content,
              },
              query: {
                startDate: queryParamStartDate,
                endDate: queryParamEndDate,
              },
            }"
            >{{ content }}</router-link
          >
        </template>
      </views-table>
    </section>
  </div>
</template>
