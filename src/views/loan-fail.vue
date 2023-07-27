<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="handy/失败" :width="130" :height="130" />
      <div class="title">Sorry The application is fail!</div>
      <div class="apply" @click="goHome">Back to Home</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Loan Applications',
    });
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .loan-tips {
    padding-top: 40px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin-bottom: 60px;
    }
    .apply {
      width: 327px;
      height: 48px;
      background: #6515fe;
      // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }
}
</style>
