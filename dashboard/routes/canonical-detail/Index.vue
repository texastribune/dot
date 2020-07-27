<script lang="ts">
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vue-apollo/types/vue.d.ts" />
/* eslint-disable vue/valid-v-slot, @typescript-eslint/triple-slash-reference, spaced-comment */
/// <reference path="../../../node_modules/vue-meta/types/vue.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { DataTableHeader } from 'vuetify';
import { MetaInfo } from 'vue-meta';
import gql from 'graphql-tag';

import { USER_MODULE } from '../../store';
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
    ...mapGetters(USER_MODULE, ['userIsReady']),

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
      skip(): boolean {
        return !this.userIsReady;
      },
    },
  },

  metaInfo(): MetaInfo {
    return {
      title: this.domainsList.length
        ? `Canonical detail: ${this.routeCanonical}`
        : 'Invalid canonical',
    };
  },
});
</script>

<template>
  <section>
    <views-table
      :content-header="header"
      :is-loading="$apollo.queries.viewsListByDomain.loading"
      :items="domainsList"
      :total-views="totalViews"
    >
      <template #heading>
        <h3>{{ routeCanonical }}</h3>
      </template>
      <template #content="{ content }">
        {{ content }}
      </template>
    </views-table>
  </section>
</template>
