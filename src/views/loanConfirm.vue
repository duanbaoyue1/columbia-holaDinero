<template>
  <div class="loan-confirm content-area">
    <div class="loan-info">
      <div class="item">
        <div class="repayment">Repayment</div>
        <span class="fs-24 font-bold color-000"
          >₹{{ orderInfo.estimatedRepaymentAmount }}</span
        >
      </div>

      <div class="item">
        <span>Loan Amount</span>
        <span class="color-333">₹{{ orderInfo.approvalAmount }}</span>
      </div>
      <div class="item">
        <span>Application Date</span>
        <span class="color-333">{{ orderInfo.applyTime }}</span>
      </div>
      <div class="item">
        <span>Due Date</span>
        <span class="color-333">{{ orderInfo.expectedRepaymentTime }}</span>
      </div>
      <div class="item">
        <span>Disbursal Bank</span>
        <span class="color-333">{{ orderInfo.bankCardName }}</span>
      </div>
      <div class="item">
        <span>Account No.</span>
        <span class="color-333">{{ orderInfo.bankCardNo }}</span>
      </div>
    </div>

    <div class="loan-desc">
      The specific amount will be confirmed after reviewing. If your order is
      approved, we will charge the processing fee, including the service fee (no
      more than 7%), review fee (8%-15%), and GST(18%) This page is for
      reference only. The amount will be credited to your account directly after
      approval.
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">
        Submit
      </button>
      <div class="policy" @click="togglePolicy">
        <img class="icon" :src="choosed ? selected : unselected" />
        I have read and agreed to the &nbsp;
        <span class="color-theme font-bold" @click="checkAgreement"
          >loan Agreement</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import selected from '@/assets/images/selected.png'
import unselected from '@/assets/images/unselected.png'

export default {
  data() {
    return {
      selected,
      unselected,
      choosed: true,
      canSubmit: true,
      orderInfo: '',
      orderId: this.$route.query.orderId,
      saving: false
    }
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Loan Application'
    })
  },
  mounted() {
    this.eventTracker('confirm_access')
    this.getOrderInfo()
  },
  watch: {
    choosed: {
      handler() {
        this.canSubmit = !!this.choosed
      },
      deep: true
    }
  },
  methods: {
    checkAgreement() {
      this.openWk(
        `${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`
      )
    },
    togglePolicy() {
      this.choosed = !this.choosed
    },
    async getOrderInfo() {
      try {
        this.showLoading()
        let data = await this.$http.post('/api/order/applyConfirmation', {
          orderId: this.orderId
        })
        this.orderInfo = data.data
      } catch (error) {
      } finally {
        this.hideLoading()
      }
    },

    async submit() {
      this.eventTracker('confirm_submit')
      this.showLoading()
      let syncRes
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.judgeCanApply()
        } catch (error) {
          this.hideLoading()
          this.$toast(
            'Your message verification failed, please wait a minute and try again'
          )
          return
        }
        if (syncRes) {
          // 2. 真正的提交动作
          await this.$http.post(`/api/order/apply`, { orderId: this.orderId })
          // 成功或者失败的跳转
          this.innerJump(
            'loanSuccessMulti',
            {
              orderId: this.orderId,
              single: true,
              systemTime: new Date().getTime()
            },
            true
          )
        }
      } catch (error) {
        this.$toast(error.message)
        setTimeout(() => {
          this.innerJump('loanFail', { orderId: this.orderId }, true)
        }, 1000)
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loan-confirm {
  padding: 0 20px;

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
    color: #999;
    line-height: 18px;
    word-break: break-word;
  }
  .loan-info {
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    background-image: url('@/assets/images/loan-confirm.png');
    background-size: 144px 118px;
    background-repeat: no-repeat;
    background-attachment: local;
    background-position: 192px -2px;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:not(:first-child) {
        margin-top: 30px;
      }

      .repayment {
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 33px;
      }

      span {
        font-size: 14px;
        font-weight: 400;
        color: #000;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      font-size: 10px;
      font-weight: 400;
      color: #000000;
      line-height: 16px;
      display: flex;
      transform: scale(0.9);
      margin: 0 0 10px 6px;

      .icon {
        width: 14px;
        height: 14px;
        margin-right: 10px;
      }
    }
  }
}
</style>
