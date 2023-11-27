<template>
  <van-nav-bar
    :class="{
      transparent: tabBar.transparent,
      'title-trans': $route.meta.navReturnFFF,
    }"
    :fixed="tabBar.fixed"
    :title="tabBar.title"
    @click-left="onBack"
  >
    <template #left>
      <m-icon
        v-if="$route.meta.navReturnFFF"
        class="left"
        type="return-fff"
        :width="16"
        :height="16"
      />
      <m-icon v-else class="left" type="return" :width="16" :height="16" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  methods: {
    onBack() {
      console.log("***** object");
      if (this.tabBar.backCallback) {
        this.tabBar.backCallback();
      } else {
        if (
          [
            "loanConfirm",
            "loanSuccessMulti",
            "orderList",
            "completeBank",
          ].includes(this.$route.name)
        ) {
          this.sendEventTrackData({});
        }
        if (["helpCenter", "settings"].includes(this.$route.name)) {
          this.sendEventTrackData({ page: "mine" });
        }
        this.goAppBack();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  margin-left: 5px;
}
</style>
