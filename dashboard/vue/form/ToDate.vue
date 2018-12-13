<template>
  <date-picker
    @selected="onSelect"
    :value="validToDate"
    :disabled="disabled"
    input-class="input-class"
  />
</template>

<script>
import DatePicker from 'vuejs-datepicker';
import addDays from 'date-fns/add_days';

export default {
  name: 'ToDate',

  components: {
    DatePicker,
  },

  props: {
    value: {
      type: Date,
      required: true,
    },

    fromDate: {
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
      return {
        to: this.fromDate,
        from: new Date(Date.now()),
      };
    },

    validToDate() {
      if (this.fromDate > this.value) {
        const toDate = addDays(this.fromDate, 1);
        this.$emit('input', toDate);
        return toDate;
      }
      return this.value;
    },
  },

  methods: {
    onSelect(date) {
      this.$emit('input', date);
    },
  },
};
</script>
