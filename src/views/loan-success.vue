<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="loan/success" :width="130" :height="130" />
      <div class="title">Application submitted successfully</div>
      <div class="apply" @click="check">Check Application</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      from: this.$route.query.from || '',
    };
  },
  mounted() {
    if (this.from == 'event') {
      this.innerJump('loan-success-multi', { orderId: this.$route.query.orderId, systemTime: this.$route.query.systemTime, needRecommend: false }, true);
    }
  },
  methods: {
    check() {
      this.innerJump('order-detail', { orderId: this.$route.query.orderId });
    },
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
      width: 320px;
      height: 48px;
      background: #6515fe;
      border-radius: 20px;
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
