<template></template>

<script>
export default {
  mounted() {
    console.log(localStorage.getItem("jumpPageTypes"), "****** jumpPageTypes");
    this.showLoading();
    const { path } = this.$route.query;
    console.log(this.$route.query, "**** path");
    if (path) {
      this.innerJump(path, { ...this.$route.query }, true);
    }
  },
};
</script>
