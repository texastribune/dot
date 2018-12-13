<template>
  <div>
    <template v-if="readyToRender">
      <table-heading
        :headline="decodeURIComponent(articleDetail.canonical)"
        :number="articleDetail.totalViews"
        :from-date="fromDate"
        :to-date="toDate"
        number-label="total republish views"
      />
      <sortable-table
        :data="articleDetail.allReprinters"
        :headers="headers"
        sort-by="views"
      >
        <template
          slot-scope="props"
          slot="rows"
        >
          <td class="subheading">{{ props.props.item.domain }}</td>
          <td class="subheading">{{ numberWithCommas(props.props.item.views) }}</td>
        </template>
      </sortable-table>
    </template>
    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import TableHeading from '../TableHeading.vue';
import SortableTable from '../SortableTable.vue';
import Loader from '../Loader.vue';
import articleDetailQuery from './queries';
import { numberMixin, apolloMixin } from '../../mixins';

export default {
  name: 'CanonicalRoute',

  components: {
    SortableTable,
    TableHeading,
    Loader,
  },

  mixins: [
    numberMixin,
    apolloMixin,
  ],

  props: {
    toDate: {
      type: String,
      required: true,
    },

    fromDate: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      articleDetail: {},

      headers: [
        { text: 'Reprinter Domain', value: 'domain', align: 'left' },
        { text: 'Views', value: 'total', align: 'left' },
      ],
    };
  },

  apollo: {
    articleDetail: {
      query: articleDetailQuery,

      variables() {
        return {
          startDate: this.fromDate,
          endDate: this.toDate,
          canonical: decodeURIComponent(this.$route.params.canonical),
        };
      },
    },
  },
};
</script>
