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
      skip(): boolean {
        return !this.userIsReady;
      },
    },
  },

  metaInfo(): MetaInfo {
    return {
      title: this.canonicalsList.length
        ? `Domain detail: ${this.routeDomain}`
        : 'Invalid domain',
    };
  },
});
</script>

<template>
  <section>
    <views-table
      :content-header="header"
      :is-loading="$apollo.queries.viewsListByCanonical.loading"
      :items="canonicalsList"
      :total-views="totalViews"
    >
      <template #heading>
        <h3>{{ routeDomain }}</h3>
      </template>
      <template #content="{ content }">
        {{ content }}
      </template>
    </views-table>
  </section>
</template>
