<template>
  <div class="about content-area">
    <div class="app-info">
      <img src="../assets/img/handy/logo.png" />
      <div class="name">{{ appGlobal.appName }}</div>
      <div id="version">Version: {{ appGlobal.appVersionV }}</div>
      <div class="desc">Hello, we are the {{ appGlobal.appName }} development team and thank you for using our product. HandyCash is an online loan platform in India that provides diverse loan services to Indian mobile internet users. Customers can apply for loans anytime, anywhere through a smart online loan process. The computer review process saves the user from worrying about the loan application.</div>
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
      title: 'About us',
    });
  },
  mounted() {
    // this.innerJump('identity', { orderId: this.$route.query.orderId, systemTime: this.$route.query.systemTime, needRecommend: false }, true);
  },
};
</script>

<style lang="scss" scoped>
.app-info {
  text-align: center;
  margin: 16px 24px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  img {
    width: 60px;
    display: block;
    margin: 0 auto 16px;
  }
  .name {
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
  }
  #version {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
  }

  .desc {
    margin-top: 24px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
    text-align: left;
  }
}
</style>
