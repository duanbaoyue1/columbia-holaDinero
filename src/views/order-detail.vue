<template>
  <div class="order-detail content-area" :class="'order_' + detail.orderStatus">
    <div class="status-text">
      <div class="order-info">
        <div class="flex-between">
          <span>Product</span>
          <span>{{ detail.productName }}</span>
        </div>
        <div class="flex-between">
          <span>Lending Company</span>
          <span>{{ detail.companyName }}</span>
        </div>
        <div class="flex-between">
          <span>Application Date</span>
          <span>{{ detail.applyTime }}</span>
        </div>

        <div class="flex-between" v-if="showDate">
          <span>Due Date</span>
          <span>{{ detail.actualRepaymentTime || detail.expectedRepaymentTime }}</span>
        </div>
      </div>

      <div class="order-info">
        <div class="flex-between">
          <span>Disbursal Bank</span>
          <span>{{ detail.bankCardName }}</span>
        </div>
        <div class="flex-between">
          <span>Account No.</span>
          <span>{{ detail.bankCardNo }}</span>
        </div>
        <div class="flex-between">
          <span>Loan ID</span>
          <span>{{ detail.orderNo }}</span>
        </div>
      </div>

      <div class="order-info">
        <div class="flex-between">
          <span>Loan Amount</span>
          <span class="font-bold color-000">
            ₹
            <span>{{ detail.approvalAmount }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="detail.orderStatus >= 80">
          <span>Loan agreement</span>
          <div class="color-blue" @click="checkAgreement">
            check
            <m-icon class="icon" type="blue-right" :width="8" :height="12" />
          </div>
        </div>
        <div class="flex-between" v-if="detail.orderStatus >= 80">
          <span>Received</span>
          <span class="font-bold color-blue">
            ₹
            <span>{{ detail.actualAmount }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="detail.penaltyInterest > 0">
          <span>Overdue fee</span>
          <span class="font-bold color-blue">
            ₹
            <span>{{ detail.penaltyInterest }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="detail.orderStatus >= 80">
          <span>Repayment</span>
          <span class="font-bold color-orange align-end" style="line-height: 26px">
            ₹
            <span class="fs-24">{{ detail.estimatedRepaymentAmount }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="deferTimes > 0 || (detail.orderStatus >= 80 && detail.showExtension == 1)" @click="goDeferHis">
          <span>History of deferment</span>
          <div class="color-blue">
            {{ deferTimes }} times
            <m-icon class="icon" type="blue-right" :width="8" :height="12" />
          </div>
        </div>
      </div>
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

        <div class="policy" v-if="showAuto">
          <div class="tips">99% of users opened!</div>
          <m-icon class="icon-i" :type="choosed ? 'handy/开启' : 'handy/未开启'" :width="28" :height="14" @click="choosed = !choosed" />
          <span>VIP privilege, you will get automatic reloan if repay successfully, and loan limit up with 100% possible.</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="btns" v-if="detail.orderStatus == 100 || detail.orderStatus == 101 || detail.orderStatus == 40 || detail.orderStatus == 80 || detail.orderStatus == 90">
        <button class="btn-default" v-if="detail.orderStatus == 100 || detail.orderStatus == 101 || detail.orderStatus == 40" @click="goHome">More Loan Products</button>
        <template v-else-if="detail.orderStatus == 80 || detail.orderStatus == 90">
          <button class="btn-line" v-if="detail.showExtension == 1" @click="applyDefer">Apply deferment</button>
          <button class="btn-default" @click="showPaymentTips = true">Repay Now</button>
        </template>
      </div>
      <div class="help-center" @click="goHelpCenter">Help Center?</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    showDate() {
      return this.detail.orderStatus == 80 || this.detail.orderStatus == 90 || this.detail.orderStatus == 100 || this.detail.orderStatus == 101;
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'Reviewing';
        case 21:
          return 'Reviewing';
        case 30:
          return 'Disbursing';
        case 40:
          return 'Rejected';
        case 70:
          return 'Disbursing';
        case 80:
          return 'Pending Repayment';
        case 90:
          return 'Overdue';
        case 100:
          return 'Repayment Successful';
        case 101:
          return 'Repayment Successful';
        default:
          return 'Reviewing';
      }
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      title: 'Order Details',
      backCallback: () => {
        this.goAppBack();
      },
    });
  },
  data() {
    // /**
    //  * 创建
    //  */
    // public final static int CREATE = 10;

    // /**
    //  * 审核中
    //  */
    // public final static int EXAMINE_WAIT = 20;

    // /**
    //  * 审核中
    //  */
    // public final static int AUTO_REPEAT_EXAMINE_WAIT = 21;

    // /**
    //  * 审核通过
    //  */
    // public final static int EXAMINE_PASS = 30;

    // /**
    //  * 审核拒绝
    //  */
    // public final static int EXAMINE_FAIL = 40;

    // /**
    //  * 等待放款
    //  */
    // public final static int WAIT_PAY = 70;

    // /**
    //  * 在途
    //  */
    // public final static int WAY = 80;

    // /**
    //  * 逾期
    //  */
    // public final static int DUE = 90;

    // /**
    //  * 结清
    //  */
    // public final static int COMPLETE = 100;

    // /**
    //  * 结清-有逾期
    //  */
    // public final static int DUE_COMPLETE = 101;

    // /**
    //  * 废弃订单
    //  */
    // public final static int ABANDONED = 110;

    return {
      orderId: this.$route.query.orderId,
      choosed: false, // 是否勾选复贷
      showAuto: false, // 是否显示复贷
      showPaymentTips: false,
      detail: {},
      deferTimes: 0,
      orderUrl: '',
    };
  },

  mounted() {
    this.getDetail();
    this.getDeferTimes();
    this.queryOrderReloan();
  },

  methods: {
    async queryOrderReloan() {
      try {
        // 判断全局状态
        let data = await this.$http.post(`/api/order/isOpenOrderAutoRepeatNew`, { orderId: this.orderId });
        this.showAuto = data.data.isOpen;
        this.choosed = data.data.isGive;
        console.log('update choosed1', data.data.isGive);

        // 查询当前订单是否开启自动复贷
        data = await this.$http.post(`/api/order/getOrderIsOpenOrderAutoRepeat`, { orderId: this.orderId });
        if (data.data != null && typeof data.data != 'undefined') {
          this.choosed = data.data;
          console.log('update choosed', this.choosed);
        }
      } catch (error) {}
    },

    backC() {
      console.log('backC');
    },

    async repay() {
      // 更新复贷
      try {
        await this.$http.post(`/api/order/updateOrderAutoRepeatStatus`, { orderId: this.orderId, isOpen: this.choosed ? 1 : 0 });
      } catch (error) {}

      this.innerJump('utr', { nextUrl: this.orderUrl.repaymentUrl, orderId: this.orderId, type: 'repay' });
    },
    applyDefer() {
      this.innerJump('defer-detail', { orderId: this.orderId });
    },
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    goDeferHis() {
      this.innerJump('defer-history', { orderId: this.orderId });
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'repay' });
    },

    async getDeferTimes() {
      let data = await this.$http.post(`/api/extension/historyNum`, {
        id: this.orderId,
      });
      this.deferTimes = data.data.num;
    },

    async getDetail() {
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId,
        });
        this.detail = res.data;
        console.log('order detail', this.detail);
        console.log('order status', this.detail.orderStatus);
        console.log('this.orderStatus', this.orderStatusText);
        if (this.orderStatusText == 'Rejected' || this.orderStatusText == 'Repayment Successful' || this.orderStatusText == 'Pending Repayment' || this.orderStatusText == 'Overdue') {
          this.orderUrl = await this.getOrderRelateUrl(this.orderId);
        }
      } catch (error) {
      } finally {
        this.hideLoading();
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
    margin: 16px 24px 0;
    color: #000601;
    position: relative;
    .tips {
      position: absolute;
      top: -30px;
      left: -8px;
      width: 130px;
      height: 20px;
      background: #febc1d;
      border-radius: 24px 24px 24px 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
      transform: scale(0.9);
      &::after {
        position: absolute;
        content: ' ';
        width: 1px;
        height: 1px;
        border-width: 6px 6px;
        border-style: solid;
        border-color: #febc1d transparent transparent transparent;
        bottom: -12px;
        left: 11px;
      }
    }
    .m-icon {
      margin-top: -2px;
    }
    span {
      font-size: 12px;
      line-height: 16px;
      transform: scale(0.9);
      margin-top: -4px;
      margin-bottom: 16px;
      word-break: break-word;
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

.order-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/handy/订单Reviewing.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  background-attachment: local;
  &.order_30,
  &.order_70 {
    background-image: url(../assets/img/handy/订单Disbursing.png);
  }
  &.order_40 {
    background-image: url(../assets/img/handy/订单Rejected.png);
  }
  &.order_80 {
    background-image: url(../assets/img/handy/订单PendingRepayment.png);
  }
  &.order_90 {
    background-image: url(../assets/img/handy/订单Overdue.png);
  }
  &.order_100,
  &.order_101 {
    background-image: url(../assets/img/handy/订单RepaymentSuccessful.png);
  }

  .status-text {
    margin-top: 100px;
  }
  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f6f6f6;

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
      .btn-line {
        border-radius: 25px;
        border: 1px solid #999999;
        font-size: 18px;
        color: #999;
      }
      button {
        // width: 100%;
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
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
  .order-more {
    background: #fff;
    padding: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    > div {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      > * {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 2px;
        }
      }
    }
  }
  .order-info {
    padding: 20px;
    width: 327px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 16px;

    > div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      div {
        display: flex;
        align-items: center;
      }
      &:last-child {
        margin-bottom: 0;
      }
      > span {
        white-space: nowrap;
        &:last-child {
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
