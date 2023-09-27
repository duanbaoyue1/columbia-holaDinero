<template>
  <div class="multi content-area">
    <div class="loan-tips">
      <img class="success-icon" src="@/assets/images/success.png" />
      <div class="congratulations-title" v-if="loans.length > 0">
        Congratulations
        <br />
        Your application is successful
      </div>
      <div class="margin-top-30">
        <div v-if="!loans.length" class="bottom-submit-btn" @click="check">
          View all orders
        </div>
        <div v-else class="bottom-submit-btn" @click="applyMulti">
          Increase ₹{{ totalAmount }} Amount
        </div>
      </div>
    </div>

    <div class="other-loans column-direction" v-if="loans.length > 0">
      <div class="tips">
        You are in our special VIP exclusive channel in view of your good
        qualification.
      </div>
      <div class="already-frame">
        <div class="checked-num color-theme">
          Already Select {{ checkedNums }} products
        </div>
        <div v-for="(loan, index) in loans" :key="loan.id">
          <div
            class="loan-item"
            :class="{ active: !loan.unChecked }"
            @click="checkLoan(index)"
          >
            <img class="icon" :src="loan.icon" />
            <div>
              <div class="name">{{ loan.productName }}</div>
              <div class="value">
                Loan Amount：<span class="symbol">₹</span>
                <span class="min-amount">{{ loan.minAmount | thousands }}</span>
              </div>
            </div>
          </div>

          <div v-if="loans.length != index + 1" class="line"></div>
        </div>
      </div>
    </div>

    <!-- 没有推荐结果时显示 -->
    <res-loans v-else class="res-loans" :systemTime="systemTime"></res-loans>

    <!-- 谷歌好评 -->
    <google-feedback
      v-show="showGoogleFeed"
      :show.sync="showGoogleFeed"
    ></google-feedback>

    <div class="control-back" v-if="showBackControl">
      <div class="content-frame">
        <img class="close" src="@/assets/images/close.png" @click="leave" />
        <div class="head">
          <img src="@/assets/images/bort-after.png" />
        </div>
        <div class="content">
          You are just one step away from a ₹{{ totalAmount }} credit limit, are
          you sure you want to give up your eligibility?
          <div class="count row-direction">
            Auto Abort after
            <span>{{ count }}S</span>
          </div>
        </div>
        <button class="btn-default" @click="showBackControl = false">
          Think again
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import resLoans from '@/components/resLoans'
import googleFeedback from '@/components/googleFeedback'
export default {
  components: {
    resLoans,
    googleFeedback
  },

  data() {
    window.loanBtnCallback = async () => {
      if (this.loans.length) {
        this.showBackModal()
      } else if (await this.getNeedGoogle()) {
        this.nextStep = 'goBack'
        this.showGoogleFeed = true
      } else {
        this.goAppBack()
      }
    }
    return {
      needRecommend: JSON.parse(this.$route.query.needRecommend || true), // 是否需要推荐 从活动过来的不用推荐
      systemTime: this.$route.query.systemTime || '', // 上次订单时间
      single: JSON.parse(this.$route.query.single || false), // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      nextStep: '',
      showBackControl: false,
      backInterval: null, // 回退倒计时
      showGoogleFeed: false
    }
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Loan Applications',
      backCallback: window.loanBtnCallback
    })
  },
  mounted() {
    this.toAppMethod('holdUp', {
      isInterception: true,
      fuName: 'loanBtnCallback'
    })

    if (this.needRecommend) {
      this.getRecommendLoans()
    }
  },
  watch: {
    showGoogleFeed: {
      handler() {
        if (!this.showGoogleFeed && this.nextStep) {
          if (this.nextStep == 'goBack') {
            this.goAppBack()
          } else if (this.nextStep == 'goAllOrders') {
            this.innerJump('orderList', {}, true)
          }
        }
      },
      deep: true
    }
  },
  methods: {
    leave() {
      this.toAppMethod('holdUp', { isInterception: false })
      this.goHome()
    },
    showBackModal() {
      this.count = 10
      window.clearInterval(this.backInterval)
      this.backInterval = null
      this.backInterval = setInterval(() => {
        if (this.count == 0) {
          window.clearInterval(this.backInterval)
          this.backInterval = null
        } else {
          this.count--
        }
      }, 1000)
      this.showBackControl = true
    },

    async getNeedGoogle() {
      try {
        let res = await this.$http.post(`/api/product/favourableComment`)
        if (res.returnCode == 2000) {
          return res.data
        }
      } catch (error) {}
    },

    async getRecommendLoans() {
      try {
        this.showLoading()
        let data
        if (this.single) {
          data = await this.$http.post(`/api/product/maskRecommendList`)
          this.loans = data.data.list || []
          this.loans = this.loans.map((t) => {
            t.maxAmount = t.minAmount
            return t
          })
        } else {
          data = await this.$http.post(`/api/product/mergeProduct/list`)
          this.loans = data.data.mergPushProductList || []
        }
        this.updateCheckedNum()
      } catch (error) {
        console.log(error)
      } finally {
        this.hideLoading()
      }
    },
    async check() {
      // 没有贷款产品且需要google弹窗
      if (!this.loans.length && (await this.getNeedGoogle())) {
        this.nextStep = 'goAllOrders'
        this.showGoogleFeed = true
      } else {
        this.innerJump('orderList', {}, true)
      }
    },

    checkLoan(index) {
      if (this.checkedNums == 1 && !this.loans[index].unChecked) return
      this.$set(this.loans, index, {
        ...this.loans[index],
        unChecked: !this.loans[index].unChecked
      })
      this.updateCheckedNum()
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter((t) => !t.unChecked).length
      this.totalAmount = this.sumArr(
        this.loans.filter((t) => !t.unChecked).map((t) => t.minAmount)
      )
    },
    sumArr(arr) {
      return arr.reduce(function (prev, cur) {
        return parseInt(prev) + parseInt(cur)
      }, 0)
    },

    async applyMulti() {
      let loanIds = this.loans.filter((t) => !t.unChecked).map((t) => t.id)
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
          // 2. 真正提交
          let res = await this.$http.post(`/api/order/mergePush/preApply`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds
          })
          if (res.returnCode == 2000) {
            await this.$http.post(`/api/order/mergePush/apply`, {
              orderIdList: res.data.orderIdList
            })
            this.$toast('Apply successfully')
            setTimeout((res) => {
              this.getRecommendLoans()
            }, 1000)
          }
        }
      } catch (error) {
        this.$toast(error.message)
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.multi {
  .loan-tips {
    padding-top: 40px;
  }
  .congratulations-title {
    margin-top: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    text-align: center;
  }

  .success-icon {
    width: 140px;
    height: 135px;
    margin: 0 auto;
  }

  .line {
    height: 1px;
    width: 100%;
    margin-top: 20px;
    background: #e9e9e9;
  }

  .other-loans {
    background: #ffffff;
    margin: 0 20px;

    .tips {
      font-size: 14px;
      font-weight: 400;
      color: #333;
      line-height: 18px;
      background-image: url('@/assets/images/vip.png');
      background-size: 335px 72px;
      background-repeat: no-repeat;
      background-attachment: local;
      padding: 18px;
      word-break: break-word;
    }

    .already-frame {
      padding: 20px;

      .checked-num {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
      }

      .loan-item {
        background: #ffffff;
        display: flex;
        align-items: center;
        margin-top: 20px;
        position: relative;

        .icon {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }

        .name {
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333;
          line-height: 18px;
        }

        .value {
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #999999;
          line-height: 16px;

          .symbol {
            font-size: 12px;
            font-family: Helvetica-Bold, Helvetica;
            font-weight: bold;
            color: #333333;
            line-height: 14px;
          }

          .min-amount {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            line-height: 20px;
          }
        }

        &::after {
          position: absolute;
          content: ' ';
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          background-image: url(../assets/images/unselected.png);
          background-repeat: no-repeat;
          background-size: contain;
        }

        &.active {
          &::after {
            background-image: url(../assets/images/selected.png);
          }
        }
      }
    }
  }

  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 222;

    .content-frame {
      width: 335px;
      padding: 18px;
      padding-top: 0;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
      .head {
        position: relative;
        height: 54px;
        img {
          width: 334px;
          position: absolute;
          top: -27px;
          left: 50%;
          transform: translateX(-50%);
          display: block;
        }
      }

      .close {
        width: 20px;
        height: 20px;
        position: absolute;
        top: -8px;
        right: 16px;
        z-index: 2;
      }

      .content {
        font-size: 18px;
        font-weight: 400;
        color: #333;
        line-height: 24px;
        margin-top: 120px;
        word-break: break-word;

        .count {
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: 500;
          color: #000;
          line-height: 30px;
          margin-top: 20px;

          span {
            width: 54px;
            height: 30px;
            color: $themeColor;
            font-size: 20px;
            font-family: Roboto-Bold, Roboto;
            font-weight: 500;
            border: 1px solid $themeColor;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
          }
        }
      }

      .btn-default {
        width: 100%;
        height: 48px;
        background: $themeColor;
        border-radius: 24px;
        border: none;
        color: #fff;
        font-size: 18px;
        font-family: Roboto-Bold, Roboto;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        margin-top: 30px;
      }
    }
  }
}
</style>
