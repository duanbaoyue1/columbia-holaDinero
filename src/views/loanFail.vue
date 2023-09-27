<template>
  <div class="content-area margin-top-80">
    <img class="icon" src="@/assets/images/full.png" />
    <div class="title">Sorry The application is fail!</div>
    <div class="bottom-submit-btn" @click="goHome">Back to Home</div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Loan Applications'
    })
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 140px;
  height: 135px;
  margin: 0 auto;
}
.title {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  text-align: center;
  margin: 30px 0 60px 0;
}
</style>
