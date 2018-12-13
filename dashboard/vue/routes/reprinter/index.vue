<template>
  <div>
    <template v-if="readyToRender">
      <table-heading
        :headline="reprinterDetail.domain"
        :number="reprinterDetail.totalReprints"
        :from-date="fromDate"
        :to-date="toDate"
        number-label="total reprints"
      />
      <sortable-table
        :data="reprinterDetail.allArticles"
        :headers="headers"
        sort-by="views"
      >
        <template
          slot-scope="props"
          slot="rows"
        >
          <td class="subheading">{{ props.props.item.canonical }}</td>
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
import reprinterDetailQuery from './queries';
import { numberMixin, apolloMixin } from '../../mixins';

export default {
  name: 'ArticleRoute',

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
      reprinterDetail: {},

      headers: [
        { text: 'Canonical URL', value: 'canonical', align: 'left' },
        { text: 'Views', value: 'total', align: 'left' },
      ],
    };
  },

  apollo: {
    reprinterDetail: {
      query: reprinterDetailQuery,

      variables() {
        return {
          startDate: this.fromDate,
          endDate: this.toDate,
          domain: this.$route.params.domain,
        };
      },
    },
  },
};
</script>
