<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <div class="content">
        Only pay for ₹{{ detail.amount }} today
        <br />
        and you can defer {{ detail.extendedTerm }} days.
      </div>
      <div class="title">Defer for {{ detail.extendedTerm }} days</div>
    </div>
    <div class="step row-space-between row-center">
      <div class="column-direction">
        <div class="text">Application Date</div>
        <div class="date margin-top-10">{{ detail.startTime }}</div>
      </div>
      <img class="deferment-arrow" src="@/assets/images/deferment-arrow.png" />
      <div class="column-direction">
        <div class="text">Repayment date</div>
        <div class="date margin-top-10">{{ detail.updatedDueDate }}</div>
      </div>
    </div>

    <div class="order-info margin-top-20">
      <div class="row-space-between-center">
        <span class="period">Repayment this period</span>
        <div>
          <span class="symbol orange">₹</span>
          <span class="value orange">{{ detail.amount }}</span>
        </div>
      </div>
      <div class="row-space-between margin-top-30">
        <span class="title">Interest</span>
        <span class="number"><span>₹</span> {{ detail.interest }}</span>
      </div>
      <div class="row-space-between margin-top-30">
        <span class="title">Deferment fee</span>
        <span class="number"><span>₹</span> {{ detail.defermentFee }}</span>
      </div>
      <div class="row-space-between margin-top-30">
        <span class="title">Overdue fee</span>
        <span class="number"><span>₹</span> {{ detail.overDueFee }}</span>
      </div>
    </div>

    <div class="desc">
      Description: After paying deferment fee, the repayment due date will be
      defered by 7 days. After 7-day derferment, you need to repay the principal
      + the interest of the new period + the service fee.
    </div>

    <div class="actions">
      <button class="bottom-submit-btn" @click="defer">
        Defer the repayment
      </button>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <img
          class="close"
          src="@/assets/images/close.png"
          @click="showPaymentTips = false"
        />
        <img class="guide-utr" src="@/assets/images/guide-utr.png" />

        <div class="content">
          <div class="remember">Remember</div>
          When payment is completed,
          <div>
            remember to
            <span @click="goFillUtr" class="color-theme text-decoration"
              >fill in the UTR</span
            >
            in this app
          </div>
        </div>
        <div class="action">
          <div class="cancel row-center" @click="goTutorial">Tutorial</div>
          <div class="confirm row-center" @click="repay">Repay</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: {},
      orderUrl: ''
    }
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      title: 'Order Details'
    })
  },
  async mounted() {
    this.getDetail()
    this.orderUrl = await this.getOrderRelateUrl(this.orderId)
  },
  methods: {
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'defer' })
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl
    },
    defer() {
      this.showPaymentTips = true
    },
    async repay() {
      this.innerJump('utr', {
        nextUrl: this.orderUrl.extensionUrl,
        orderId: this.orderId,
        type: 'defer'
      })
    },
    async getDetail() {
      console.log('this.orderId', this.orderId)
      try {
        let data = await this.$http.post('/api/extension/detail', {
          id: this.orderId
        })
        this.detail = data.data
      } catch (error) {
      } finally {
        this.loaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.orange {
  color: #fe5404;
}
.payment-success-container {
  width: 335px;
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
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }
  .close {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .guide-utr {
    width: 100%;
  }
  .content {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: #000601;
    text-align: center;
    margin: 30px 20px 0;
    word-break: break-word;
    .remember {
      font-size: 20px;
      font-weight: bold;
      color: #000601;
      line-height: 24px;
      margin-bottom: 10px;
    }
  }
  .action {
    margin: 30px 20px 0;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    .confirm {
      width: 160px;
      height: 48px;
      background: $themeColor;
      border-radius: 24px;
      font-size: 18px;
      font-weight: 900;
      color: $themeFontColor;
      line-height: 24px;
    }
    .cancel {
      width: 100px;
      font-size: 18px;
      border: 1px solid $themeColor;
      color: $themeColor;
      position: relative;
      box-shadow: none;
      margin-right: 16px;
      border-radius: 24px;
    }
  }
}
.defer-detail {
  padding-bottom: 120px;
  background-image: url(@/assets/images/deferment.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  .defer-head {
    margin: 5px 0 0 24px;
    padding-bottom: 15px;
    position: relative;

    .content {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #ffffff;
      line-height: 25px;
    }

    .title {
      font-size: 20px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 26px;
      margin-top: 36px;
    }
  }

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
  }

  .order-info {
    background: #fff;
    border-radius: 14px;
    margin: 20px;
    padding: 20px;

    .period {
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #000000;
      line-height: 20px;
    }

    .symbol {
      font-size: 14px;
      font-family: Helvetica;
      line-height: 14px;
    }

    .value {
      font-size: 24px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      line-height: 30px;
    }

    .title {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #000000;
      line-height: 18px;
    }

    .number {
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
    }
  }

  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    line-height: 18px;
    margin: 0 20px;
    word-break: break-word;
  }
  .step {
    width: 335px;
    background: #ffffff;
    border-radius: 14px;
    margin: 20px auto 0;
    padding: 20px;
    box-sizing: border-box;

    .text {
      font-size: 14px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      line-height: 18px;
    }
    .deferment-arrow {
      width: 18px;
      height: 12px;
    }
    .date {
      font-size: 14px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 18px;
    }
    .step-wrapper {
      flex-grow: 1;
    }
  }
}
</style>
