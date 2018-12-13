<template>
  <div>
    <template v-if="readyToRender">
      <table-heading
        headline="Top reprinted articles"
        :number="totalViews"
        number-label="total reprint views"
        :from-date="fromDate"
        :to-date="toDate"
      />
      <sortable-table
        :data="summary.topArticles"
        :headers="topTable.headers"
        sort-by="views"
        class="mb-5"
      >
        <template
          slot-scope="props"
          slot="rows"
        >
          <td class="subheading">
            <router-link
              :to="{ name: 'article', params: { canonical: encodeURIComponent(props.props.item.canonical) } }"
            >
              {{ props.props.item.canonical }}
            </router-link>
          </td>
          <td class="subheading">{{ numberWithCommas(props.props.item.views) }}</td>
        </template>
      </sortable-table>

      <table-heading
        headline="Top reprinting domains"
        :number="totalDomains"
        number-label="unique domains"
        :from-date="fromDate"
        :to-date="toDate"
      />
      <sortable-table
        :data="summary.topReprinters"
        :headers="bottomTable.headers"
        sort-by="reprints"
      >
        <template
          slot-scope="props"
          slot="rows"
        >
          <td class="subheading">
            <router-link
              :to="{ name: 'reprinter', params: { domain: props.props.item.domain } }"
            >
              {{ props.props.item.domain }}
            </router-link>
          </td>
          <td class="subheading">{{ numberWithCommas(props.props.item.reprints) }}</td>
        </template>
      </sortable-table>
    </template>

    <template v-else>
      <loader />
    </template>
  </div>
</template>

<script>
import SortableTable from '../SortableTable.vue';
import Loader from '../Loader.vue';
import TableHeading from '../TableHeading.vue';
import summaryQuery from './queries';
import { numberMixin, apolloMixin } from '../../mixins';

export default {
  name: 'SummaryRoute',

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
      summary: {},

      topTable: {
        headers: [
          { text: 'Canonical URL', value: 'canonical', align: 'left' },
          { text: 'Views', value: 'views', align: 'left' },
        ],
      },

      bottomTable: {
        headers: [
          { text: 'Reprinter Domain', value: 'domain', align: 'left' },
          { text: 'Reprints', value: 'reprints', align: 'left' },
        ],
      },
    };
  },

  computed: {
    totalViews() {
      let sum = 0;

      this.summary.topArticles.forEach(({ views }) => {
        sum += views;
      });

      return sum;
    },

    totalDomains() {
      return this.summary.topReprinters.length;
    },
  },

  apollo: {
    summary: {
      query: summaryQuery,

      variables() {
        return {
          startDate: this.fromDate,
          endDate: this.toDate,
        };
      },
    },
  },
};
</script>
