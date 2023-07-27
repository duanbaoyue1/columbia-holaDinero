<template>
  <div class="loan-confirm content-area">
    <div class="loan-info">
      <div class="item">
        <span>Repayment</span>
        <span class="fs-24 font-bold color-orange">₹{{ orderInfo.estimatedRepaymentAmount }}</span>
      </div>

      <div class="item">
        <span>Loan Amount</span>
        <span class="color-000">₹{{ orderInfo.approvalAmount }}</span>
      </div>
      <div class="item">
        <span>Application Date</span>
        <span>{{ orderInfo.applyTime }}</span>
      </div>
      <div class="item">
        <span>Due Date</span>
        <span>{{ orderInfo.expectedRepaymentTime }}</span>
      </div>
      <div class="item">
        <span>Disbursal Bank</span>
        <span>{{ orderInfo.bankCardName }}</span>
      </div>
      <div class="item">
        <span>Account No.</span>
        <span>{{ orderInfo.bankCardNo }}</span>
      </div>
    </div>

    <div class="loan-desc">The specific amount will be confirmed after reviewing. If your order is approved, we will charge the processing fee, including the service fee (no more than 7%), review fee (8%-15%), and GST(18%) This page is for reference only. The amount will be credited to your account directly after approval.</div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Submit</button>
      <div class="policy" @click="togglePolicy">
        <m-icon class="icon" :type="choosed ? 'handy/选中（小）' : 'handy/未选（小）'" :width="14" :height="14" />
        I have read and agreed to the &nbsp;
        <span @click="checkAgreement">loan Agreement</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    choosed: {
      handler() {
        this.canSubmit = !!this.choosed;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Loan Application',
    });
  },
  data() {
    return {
      choosed: true,
      canSubmit: true,
      orderInfo: '',
      orderId: this.$route.query.orderId,
      saving: false,
    };
  },
  mounted() {
    this.eventTracker('confirm_access');
    this.getOrderInfo();
  },
  methods: {
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    togglePolicy() {
      this.choosed = !this.choosed;
    },
    async getOrderInfo() {
      try {
        this.showLoading();
        let data = await this.$http.post('/api/order/applyConfirmation', { orderId: this.orderId });
        this.orderInfo = data.data;
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },

    async submit() {
      this.eventTracker('confirm_submit');
      this.showLoading();
      let syncRes;
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.judgeCanApply();
        } catch (error) {
          this.hideLoading();
          this.$toast('Your message verification failed, please wait a minute and try again');
          return;
        }
        if (syncRes.success) {
          // 2. 真正的提交动作
          await this.$http.post(`/api/order/apply`, { orderId: this.orderId });
          // 成功或者失败的跳转
          this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: new Date().getTime() }, true);
        }
      } catch (error) {
        this.$toast(error.message);
        setTimeout(() => {
          this.innerJump('loan-fail', { orderId: this.orderId }, true);
        }, 1000);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan-confirm {
  background: #f6f6f6;
  padding: 16px 24px;
  padding-bottom: 90px;
  .head {
    padding: 20px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    background: #fff;
    position: relative;
    .icon {
      margin-right: 20px;
    }
    .money {
      font-size: 24px;
      font-weight: bold;
      color: #1143a4;
      line-height: 28px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .loan-desc {
    margin-top: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    line-height: 18px;
    word-break: break-word;
  }
  .loan-info {
    padding-top: 32px;
    padding-left: 24px;
    padding-right: 24px;
    border-radius: 8px;
    background: #fff;
    .item {
      padding-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:first-child {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 18px;
          flex-shrink: 0;
          margin-right: 20px;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;

    .policy {
      padding: 0 20px;
      font-size: 10px;
      font-weight: 400;
      color: #000000;
      line-height: 16px;
      display: flex;
      align-items: center;
      transform: scale(0.9);
      margin-bottom: 10px;
      width: 110%;
      margin-left: -5%;
      .icon {
        margin-right: 10px;
      }
      span {
        color: #6515fe;
      }
    }
  }
}
</style>
