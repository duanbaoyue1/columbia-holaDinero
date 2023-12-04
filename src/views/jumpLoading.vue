<template></template>

<script>
export default {
  mounted() {
    this.showLoading();
    const { path } = this.$route.query;
    if (path) {
      this.innerJump(path, { ...this.$route.query, fromType: "android" }, true);
    }
  },
};
</script>
