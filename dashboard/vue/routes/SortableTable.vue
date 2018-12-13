<template>
  <div>
    <v-text-field
      append-icon="search"
      label="Search"
      single-line
      hide-details
      v-model="search"
    />
    <v-data-table
      :headers="headers"
      :items="data"
      :pagination.sync="pagination"
      :search="search"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <slot
            name="rows"
            :props="props"
          />
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: 'SortableTable',

  props: {
    data: {
      type: Array,
      required: true,
    },

    headers: {
      type: Array,
      required: true,
    },

    sortBy: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      search: '',
      pagination: {
        sortBy: this.sortBy,
        descending: true,
        rowsPerPage: 10,
      },
    };
  },
};
</script>
