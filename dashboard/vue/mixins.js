export const numberMixin = {
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};

export const apolloMixin = {
  data() {
    return { error: false, loading: false };
  },

  computed: {
    readyToRender() {
      return !this.loading && !this.error;
    },
  },
};
