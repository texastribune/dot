<template>
  <date-picker
    @selected="onSelect"
    :value="value"
    :disabled="disabled"
    input-class="input-class"
  />
</template>

<script>
import DatePicker from 'vuejs-datepicker';

export default {
  name: 'FromDate',

  components: {
    DatePicker,
  },

  props: {
    value: {
      type: Date,
      required: true,
    },

    inputClass: {
      type: String,
      required: true,
    },
  },

  computed: {
    disabled() {
      return { from: new Date(Date.now()) };
    },
  },

  methods: {
    onSelect(date) {
      this.$emit('input', date);
    },
  },
};
</script>
