<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <div class="title">Defer for {{ detail.extendedTerm }} days</div>
      <div class="content">Only pay for ₹{{ detail.amount }} today and you can defer {{ detail.extendedTerm }} days.</div>
    </div>
    <div class="step">
      <div class="step-item status">
        <img :src="require('@/assets/img/handy/进度条点亮.png')" />
        <div class="text">Application Date</div>
        <div class="date">{{ detail.startTime }}</div>
      </div>
      <div class="step-item">
        <img :src="require('@/assets/img/handy/进度条未点亮.png')" />
        <div class="text">Due Date</div>
        <div class="date">{{ detail.updatedDueDate }}</div>
      </div>
    </div>

    <div class="order-info">
      <div class="period">
        <span class="fs-16 font-bold">Repayment this period</span>
        <div>
          <span class="color-orange">₹</span>
          <span class="value">{{ detail.amount }}</span>
          <!-- <m-icon class="icon" type="gray-down" :width="16" :height="12" /> -->
        </div>
      </div>
      <div class="flex-between">
        <span>Interest</span>
        <span>₹ {{ detail.interest }}</span>
      </div>
      <div class="flex-between">
        <span>Deferment fee</span>
        <span>₹ {{ detail.defermentFee }}</span>
      </div>
      <div class="flex-between">
        <span>Overdue fee</span>
        <span>₹ {{ detail.overDueFee }}</span>
      </div>
    </div>

    <div class="desc">Description: After paying deferment fee, the repayment due date will be defered by 7 days. After 7-day derferment, you need to repay the principal + the interest of the new period + the service fee.</div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Defer the repayment</button>
      </div>
      <div class="help-center" @click="goHelpCenter">Help Center?</div>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <m-icon class="close" type="handy/路径" :width="20" :height="20" @click="showPaymentTips = false" />
        <m-icon class="icon" type="handy/还款弹窗" />

        <div class="content">
          <div class="remember">Remember</div>
          When payment is completed,
          <div>
            remember to
            <span @click="goFillUtr" class="color-orange fill">fill in the UTR</span>
            in this app
          </div>
        </div>
        <div class="action">
          <div class="cancel" @click="goTutorial">Tutorial</div>
          <div class="confirm" @click="repay">Repay</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: '',
      orderUrl: '',
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      title: 'Order Details',
    });
  },
  async mounted() {
    this.getDetail();
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'defer' });
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async repay() {
      this.innerJump('utr', { nextUrl: this.orderUrl.extensionUrl, orderId: this.orderId, type: 'defer' });
    },
    async getDetail() {
      console.log('this.orderId', this.orderId);
      try {
        let data = await this.$http.post('/api/extension/detail', {
          id: this.orderId,
        });
        this.detail = data.data;
      } catch (error) {
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  width: 295px;
  box-sizing: border-box;
  border-radius: 8px;
  .policy {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 400;
    margin: 50px 0px 0;
    color: #000601;
    position: relative;
    .tips {
      position: absolute;
      top: -30px;
      left: -8px;
      width: 130px;
      height: 20px;
      background: #fbe396;
      border-radius: 24px 24px 24px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
      transform: scale(0.9);
    }
    .m-icon {
      margin-top: -2px;
    }
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }
  .icon {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    width: 295px !important;
    height: 154px !important;
  }
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
  .content {
    padding-top: 140px;
    margin-bottom: 40px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: #000601;
    text-align: left;
    margin-left: 24px;
    margin-right: 24px;
    word-break: break-word;
    .fill {
      text-decoration: underline;
    }
    .remember {
      font-size: 20px;
      font-weight: bold;
      color: #000601;
      line-height: 24px;
      margin-bottom: 10px;
      text-align: center;
    }
    a {
      color: #1143a4;
      text-decoration: underline;
    }
  }
  .action {
    margin: 0 24px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 24px;
    > div {
      width: 143px;
      height: 40px;
      background: #6515fe;
      // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      &.cancel {
        border: 1px solid #999999;
        color: #999;
        position: relative;
        width: 88px;
        background: transparent;
        box-shadow: none;
        margin-right: 16px;
        flex-grow: 1;
      }
    }
  }
}
.defer-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/handy/展期订单.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  .defer-head {
    margin: 40px 0 0 110px;
    padding-bottom: 15px;
    .title {
      font-size: 16px;
      color: #febc1d;
      margin-bottom: 0;
      font-weight: 900;
      line-height: 20px;
    }

    .content {
      font-size: 11px;
      color: #999;
      font-weight: 400;
      line-height: 16px;
    }
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;

    .btns {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .btn-default {
        background: #6515fe;
        // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
        border-radius: 25px;
        height: 46px;
        border: none;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
      }
      button {
        flex: 1;
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      color: #6515fe;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .order-info {
    background: #fff;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    margin: 24px;
    margin-bottom: 16px;
    margin-top: 0;

    .period {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      div {
        display: flex;
        align-items: flex-end;
        .value {
          margin-left: 4px;
          margin-right: 0px;
          font-size: 24px;
          font-weight: bold;
          color: #fe5404;
          line-height: 24px;
        }
        .icon {
          margin-top: -4px;
        }
      }

      .value {
        font-size: 20px;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
        margin-right: 5px;
      }
    }

    > div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #000;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #333;
    line-height: 18px;
    margin: 0 24px;
    word-break: break-word;
  }
  .step {
    width: 327px;
    height: 93px;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 30px 9px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-sizing: border-box;
    position: relative;

    &::after {
      position: absolute;
      content: ' ';
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 2px;
      background: #cccccc;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      img {
        width: 10px;
        height: 10px;
      }

      .text {
        font-size: 12px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        margin: 8px auto;
      }
      .date {
        font-size: 18px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
      }
      .step-wrapper {
        flex-grow: 1;
      }
    }
  }
}
</style>
