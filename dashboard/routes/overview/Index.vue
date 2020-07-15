<script lang="ts">
// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment
/// <reference path="../../../node_modules/vue-apollo/types/vue.d.ts" />

import Vue from 'vue';
import { mapGetters } from 'vuex';
import { VProgressCircular } from 'vuetify/lib';
import gql from 'graphql-tag';

import { ViewsList } from '../../../shared-types';
import { USER_MODULE } from '../../store';

interface QueryVariables {
  startDate: string;
  endDate: string;
}

interface ComponentData {
  viewsListByCanonical: ViewsList;
  viewsListByDomain: ViewsList;
}

export default Vue.extend({
  name: 'OverviewRoute',

  components: {
    VProgressCircular,
  },

  props: {
    displayStartDate: {
      type: String,
      required: true,
    },

    displayEndDate: {
      type: String,
      required: true,
    },

    queryStartDate: {
      type: String,
      required: true,
    },

    queryEndDate: {
      type: String,
      required: true,
    },
  },

  data(): ComponentData {
    return {
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
  },

  apollo: {
    viewsListByCanonical: {
      query: gql`
        query ViewsListByCanonical($startDate: DateTime!, $endDate: DateTime!) {
          viewsListByCanonical(startDate: $startDate, endDate: $endDate) {
            totalViews
            items {
              canonical
              views
            }
          }
        }
      `,
      variables(): QueryVariables {
        return {
          startDate: this.queryStartDate,
          endDate: this.queryEndDate,
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
  <div>
    <h1>Overview</h1>
    <v-progress-circular
      v-if="$apollo.loading"
      :width="3"
      :size="50"
      color="#539bae"
      indeterminate
    />
    <p v-else-if="viewsListByCanonical.items.length">Data loaded!</p>
  </div>
</template>
