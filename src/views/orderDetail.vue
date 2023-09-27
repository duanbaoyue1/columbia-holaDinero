<template>
  <div class="order-detail content-area" :class="'order_' + detail.orderStatus">
    <div class="order-info">
      <div class="padding-20">
        <div class="row-space-between-center">
          <span>Product</span>
          <span>{{ detail.productName }}</span>
        </div>
        <!-- <div class="row-space-between-center">
          <span>Lending Company</span>
          <span>{{ detail.companyName }}</span>
        </div> -->
        <div class="row-space-between-center">
          <span>Application Date</span>
          <span>{{ detail.applyTime }}</span>
        </div>

        <div class="row-space-between-center" v-if="showDate">
          <span>Due Date</span>
          <span>{{
            detail.actualRepaymentTime || detail.expectedRepaymentTime
          }}</span>
        </div>
      </div>
      <div class="line" />
      <div class="padding-20">
        <div class="row-space-between-center bank-row">
          <span>Disbursal Bank</span>
          <span>{{ detail.bankCardName }}</span>
        </div>
        <div class="row-space-between-center">
          <span>Account No.</span>
          <span>{{ detail.bankCardNo }}</span>
        </div>
        <div class="row-space-between-center">
          <span>Loan ID</span>
          <span>{{ detail.orderNo }}</span>
        </div>
      </div>
      <div class="line" />
      <div class="padding-20">
        <div class="row-space-between-center">
          <span>Loan Amount</span>
          <span class="loan-amount">
            ₹
            <span>{{ detail.approvalAmount || 0 | thousands }}</span>
          </span>
        </div>
        <div class="row-space-between-center" v-if="detail.orderStatus >= 80">
          <span>Loan agreement</span>
          <div class="check color-theme" @click="checkAgreement">
            Check
            <img class="green-right" src="@/assets/images/green-right.png" />
          </div>
        </div>
        <div class="row-space-between-center" v-if="detail.orderStatus >= 80">
          <span>Received</span>
          <span class="received">
            ₹
            <span>{{ detail.actualAmount || 0 | thousands }}</span>
          </span>
        </div>
        <div class="row-space-between-center" v-if="detail.penaltyInterest > 0">
          <span>Overdue fee</span>
          <span class="font-bold color-333">
            ₹
            <span>{{ detail.penaltyInterest }}</span>
          </span>
        </div>
        <div class="row-space-between-center" v-if="detail.orderStatus >= 80">
          <span>Repayment</span>
          <span class="font-bold" style="line-height: 26px; color: #ff4b3f">
            ₹
            <span class="fs-24">{{ detail.estimatedRepaymentAmount }}</span>
          </span>
        </div>
        <div
          class="row-space-between-center"
          v-if="
            deferTimes > 0 ||
            (detail.orderStatus >= 80 && detail.showExtension === 1)
          "
          @click="goDeferHis"
        >
          <span>History of deferment</span>
          <div class="color-theme">
            {{ deferTimes }} times
            <img
              class="green-right"
              style="margin-top: 1px"
              src="@/assets/images/green-right.png"
            />
          </div>
        </div>
      </div>
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
          <div class="margin-top-10">
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

        <div class="policy" v-if="showAuto">
          <div class="tips">99% of users opened!</div>
          <div class="row-flex margin-top-10">
            <img
              class="opened"
              :src="
                choosed
                  ? require('@/assets/images/open.png')
                  : require('@/assets/images/unopened.png')
              "
              @click="choosed = !choosed"
            />
            <span
              >VIP privilege, you will get automatic reloan if repay
              successfully, and loan limit up with 100% possible.</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="actions"
      :class="{
        'actions-bg': [40, 80, 90, 100, 101].includes(detail.orderStatus)
      }"
    >
      <div
        v-if="[40, 80, 90, 100, 101].includes(detail.orderStatus)"
        class="btns"
      >
        <button
          class="btn-default"
          v-if="[40, 100, 101].includes(detail.orderStatus)"
          @click="goHome"
        >
          More Loan Products
        </button>
        <template v-else-if="[80, 90].includes(detail.orderStatus)">
          <button
            class="btn-line"
            v-if="detail.showExtension == 1"
            @click="applyDefer"
          >
            Apply deferment
          </button>
          <button class="btn-default" @click="showPaymentTips = true">
            Repay Now
          </button>
        </template>
      </div>
      <div class="help-center color-theme" @click="goHelpCenter">
        Help Center?
      </div>
    </div>

    <!-- 安全弹框 -->
    <safety-warning
      v-show="showSafetyWarning"
      :email="email"
      @confirmClick="confirmClick"
      @cancelClick="cancelClick"
    />
  </div>
</template>

<script>
import safetyWarning from '@/components/safetyWarning'

export default {
  components: {
    safetyWarning
  },
  data() {
    //  10: 创建; 20: 审核中; 21: 审核中; 30: 审核通过; 40: 审核拒绝; 70: 等待放款; 80: 在途; 90: 逾期; 100: 结清; 101: 逾期; 110: 作废

    return {
      orderId: this.$route.query.orderId,
      choosed: false, // 是否勾选复贷
      showAuto: false, // 是否显示复贷
      showPaymentTips: false,
      detail: {},
      deferTimes: 0,
      orderUrl: '',
      email: '',
      showSafetyWarning: false
    }
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Order Details',
      backCallback: () => {
        this.goAppBack()
      }
    })
  },
  mounted() {
    this.getDetail()
    this.getDeferTimes()
    this.queryOrderReloan()
  },
  computed: {
    showDate() {
      return [80, 90, 100, 101].includes(this.detail.orderStatus)
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'Reviewing'
        case 21:
          return 'Reviewing'
        case 30:
          return 'Disbursing'
        case 40:
          return 'Rejected'
        case 70:
          return 'Disbursing'
        case 80:
          return 'Pending Repayment'
        case 90:
          return 'Overdue'
        case 100:
          return 'Repayment Successful'
        case 101:
          return 'Repayment Successful'
        default:
          return 'Reviewing'
      }
    }
  },
  methods: {
    confirmClick() {
      this.showSafetyWarning = false
    },
    async cancelClick() {
      this.showSafetyWarning = false
      try {
        await this.$http.post('/api/safetyTips/closeSafetyTipsPopup')
      } catch (error) {
        console.log(error)
      }
    },
    async queryOrderReloan() {
      try {
        // 判断全局状态
        let data = await this.$http.post(
          `/api/order/isOpenOrderAutoRepeatNew`,
          { orderId: this.orderId }
        )
        this.showAuto = data.data.isOpen
        this.choosed = data.data.isGive
        console.log('update choosed1', data.data.isGive)

        // 查询当前订单是否开启自动复贷
        data = await this.$http.post(
          `/api/order/getOrderIsOpenOrderAutoRepeat`,
          { orderId: this.orderId }
        )
        if (data.data != null && typeof data.data != 'undefined') {
          this.choosed = data.data
          console.log('update choosed', this.choosed)
        }
      } catch (error) {}
    },

    async repay() {
      // 更新复贷
      try {
        await this.$http.post(`/api/order/updateOrderAutoRepeatStatus`, {
          orderId: this.orderId,
          isOpen: this.choosed ? 1 : 0
        })
      } catch (error) {}

      this.innerJump('utr', {
        nextUrl: this.orderUrl.repaymentUrl,
        orderId: this.orderId,
        type: 'repay'
      })
    },
    applyDefer() {
      this.innerJump('orderDeferment', { orderId: this.orderId })
    },
    checkAgreement() {
      this.openWk(
        `${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`
      )
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl
    },
    goDeferHis() {
      this.innerJump('deferHistory', { orderId: this.orderId })
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'repay' })
    },

    async getDeferTimes() {
      try {
        let data = await this.$http.post(`/api/extension/historyNum`, {
          id: this.orderId
        })
        this.deferTimes = data.data.num
      } catch (error) {
        console.log(error)
      }
    },

    async getDetail() {
      this.showLoading()
      try {
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId
        })
        this.detail = res.data
        console.log('order detail', this.detail)
        console.log('order status', this.detail.orderStatus)
        console.log('this.orderStatus', this.orderStatusText)
        this.getSafetyTipsPopup()
        if (
          this.orderStatusText == 'Rejected' ||
          this.orderStatusText == 'Repayment Successful' ||
          this.orderStatusText == 'Pending Repayment' ||
          this.orderStatusText == 'Overdue'
        ) {
          this.orderUrl = await this.getOrderRelateUrl(this.orderId)
        }
      } catch (error) {
      } finally {
        this.hideLoading()
      }
    },
    // 弹框
    async getSafetyTipsPopup() {
      try {
        const res = await this.$http.post(`/api/safetyTips/safetyTipsPopup`)
        const data = res.data
        if (data.isPopUp) {
          this.showSafetyWarning = true
          this.email = data.email
        }
      } catch (error) {
        console.log(error)
      }
    },
    goHelpCenter() {
      this.innerJump('helpCenter')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.payment-success-container {
  width: 335px;
  box-sizing: border-box;
  border-radius: 8px;

  .policy {
    margin: 0 20px 0;
    padding-bottom: 20px;
    .tips {
      width: 140px;
      height: 20px;
      background: #ff4b3f;
      border-radius: 24px 24px 24px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: 900;
      color: #fff;
      line-height: 12px;
    }

    .opened {
      width: 28px;
      height: 14px;
    }

    span {
      font-size: 10px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #000000;
      line-height: 16px;
      word-break: break-word;
      margin: -2px 0 0 10px;
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

.order-detail {
  flex: 1;
  background: #f9f9f9;
  background-image: url(../assets/images/reviewing.png);
  background-repeat: no-repeat;
  background-size: 375px 144px;
  box-sizing: border-box;
  background-attachment: local;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;

  &.order_30,
  &.order_70 {
    background-image: url(../assets/images/disbursing.png);
  }
  &.order_40 {
    background-image: url(../assets/images/rejected.png);
  }
  &.order_80 {
    background-image: url(../assets/images/pending-repayment.png);
  }
  &.order_90 {
    background-image: url(../assets/images/overdue.png);
  }
  &.order_100,
  &.order_101 {
    background-image: url(../assets/images/repayment-successful.png);
  }

  .actions-bg {
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    background-color: #fff;
  }

  .bank-row {
    align-items: flex-start !important;
    span {
      &:first-child {
        flex-shrink: 0;
        margin-right: 20px;
      }
    }
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;

    .btns {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .btn-default {
        background: $themeColor;
        border-radius: 25px;
        height: 46px;
        border: none;
        color: $themeFontColor;
        font-weight: bold;
        font-size: 18px;
      }
      .btn-line {
        border-radius: 25px;
        border: 1px solid $themeColor;
        font-size: 18px;
        color: $themeColor;
      }
      button {
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      font-family: Roboto-Medium, Roboto;
      text-align: center;
      text-decoration: underline;
    }
  }

  .check {
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: $themeColor;
    line-height: 18px;
  }
  .green-right {
    width: 6px;
    height: 12px;
    margin: -2px 0 0 10px;
  }
  .received {
    font-size: 14px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 18px;
  }
  .padding-20 {
    padding: 20px;

    > div:not(:first-child) {
      margin-top: 20px;
    }
  }

  .line {
    width: 100%;
    height: 2px;
    background: #e4e4e4;
  }
  .order-info {
    width: 327px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 16px;
    margin-top: 85px;

    .loan-amount {
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
    }

    > div {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
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
