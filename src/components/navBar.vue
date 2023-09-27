<template>
  <van-nav-bar
    :class="{ transparent: tabBar.transparent }"
    :fixed="tabBar.fixed"
    :title="tabBar.title"
    @click-left="onBack"
  >
    <template #left>
      <img class="icon" src="@/assets/images/return.png" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  mounted() {},
  methods: {
    onBack() {
      console.log('onclick back', this.tabBar)
      if (this.tabBar.backCallback) {
        console.log('on tabBar.backCallback')
        this.tabBar.backCallback()
        return
      } else {
        console.log('on goAppBack')
        this.goAppBack()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 16px;
  height: 16px;
}
</style>
