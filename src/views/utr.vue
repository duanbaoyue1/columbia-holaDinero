<template>
  <div class="utr content-area">
    <div class="utr-input">
      <div class="head row-space-between-center">
        <span>UTR</span>
      </div>

      <div class="row-wrap">
        <input
          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          type="number"
          maxlength="12"
          class="utr-value"
          v-model="utr"
          placeholder="Please enter UTR"
        />
        <img class="right-icon" src="@/assets/images/right.png" />
      </div>
    </div>

    <div
      class="error-tips color-red fs-12"
      v-if="showError"
      :class="{ 'show-error': showError }"
    >
      Please enter correct UTR.
    </div>

    <div v-if="isEnable" class="utr-orders">
      <img
        class="orders-img"
        :src="
          utrChecked
            ? require('@/assets/images/selected.png')
            : require('@/assets/images/unselected.png')
        "
        @click="utrChecked = !utrChecked"
      />
      <div class="orders-content" @click="utrChecked = !utrChecked">
        If the UTR is used for extensions of orders, please click here.
      </div>
    </div>

    <div class="repay">
      <div class="head">Repay</div>
      <div>
        1.When payment is completed, remember to fill in the UTR here;
        <br />
        2.If you haven't complete the payment, you can click
        <span class="color-theme font-bold" @click="recreate">here</span>
        to repay;
        <br />
        3.If multiple payments are made, multiple UTRs can be submitted
        repeatedly.
      </div>
    </div>

    <div class="actions">
      <div class="btns">
        <button
          class="bottom-submit-btn"
          :disabled="!canSubmit"
          @click="submit"
        >
          Confirm UTR
        </button>
      </div>
      <div class="help-center color-theme" @click="goAppBack">
        I don't get UTR?
      </div>
    </div>

    <div class="control-back" v-if="showPopUps">
      <div class="utr-frame">
        <img class="close" src="@/assets/images/close.png" @click="goAppBack" />

        <div class="head">
          <img src="@/assets/images/utr-return.png" />
        </div>
        <div class="row-center">
          <div class="utr-title">UTR has not been received</div>
          <div class="utr-content">
            The order : {{ orderId }} hasn’t been repaid.
          </div>
        </div>
        <button class="btn-Repay" @click="showPopUps = false">Repay</button>
        <button class="btn-Enter" @click="showPopUps = false">Enter UTR</button>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="dusty-frame" v-if="isShowRolloverMask" @click="dustyClick">
      <div class="utr-frame">
        <img class="circle" src="@/assets/images/unselected.png" />
        <div class="dusty-font">
          If the UTR is used for extensions of orders, please click here.
        </div>
      </div>
      <img class="arrow" src="@/assets/images/arrow.png" />

      <div class="dusty-content">
        If you are a UTR with a extend repayment, it is important to tick this
        option, otherwise you will fail to replenish the order.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    window.getDataGFunName = (data) => {
      console.log(data, '***** getDataG')
      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      this.isUtrDusty = !data?.value
    }

    return {
      orderId: this.$route.query.orderId,
      type: this.$route.query.type || 'repay',
      utr: '',
      showError: false,
      canSubmit: false,
      orderUrl: '',
      showPopUps: false,
      utrChecked: false,
      isUtrDusty: null,
      isEnable: null
    }
  },
  watch: {
    utr() {
      this.canSubmit = this.utr.length == 12
      this.showError = this.utr.length != 12
    }
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'UTR',
      backCallback: null
    })

    this.toAppMethod('getDataG', {
      key: 'isUtrDusty',
      callbackName: 'getDataGFunName'
    })

    // 能否展期
    this.getExtendable()
  },
  computed: {
    // 展示展期蒙层
    isShowRolloverMask() {
      return this.isEnable && this.isUtrDusty
    }
  },
  async mounted() {
    this.orderUrl = await this.getOrderRelateUrl(this.orderId)
    window.utrCallBack = () => {
      this.showPopUps = true
      console.log(this.showPopUps, '***** showPopUps')
      // this.goAppBack();
    }
    this.setTabBar({
      backCallback: window.utrCallBack
    })
    this.toAppMethod('holdUp', {
      isInterception: true,
      fuName: 'utrCallBack'
    })
  },

  methods: {
    dustyClick() {
      this.isUtrDusty = false
      this.toAppMethod('setDataU', { key: 'isUtrDusty', value: '1' })
    },
    recreate() {
      if (this.type == 'repay') {
        this.openWk(this.orderUrl.repaymentUrl)
      } else {
        this.openWk(this.orderUrl.extensionUrl)
      }
    },
    async getExtendable() {
      try {
        const res = await this.$http.post('/api/order/extendable', {
          orderId: this.orderId
        })
        if (res.returnCode === 2000) {
          this.isEnable = res.data.enable
        }
      } catch (e) {
        console.log(e)
      }
    },
    async submit() {
      try {
        let data = await this.$http.post(`/api/repayment/repayUTR`, {
          utr: this.utr,
          orderNo: this.orderId,
          type: this.utrChecked ? 1 : 0 // 0：全额补单 1：展期补单
        })
        console.log(data)
        if (data.returnCode == 2000) {
          this.$toast('Submitted successfully, UTR to be confirmed')
          setTimeout(() => {
            this.goAppBack()
          }, 1000)
        }
      } catch (error) {
        this.$toast(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.dusty-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 222;

  .utr-frame {
    width: 343px;
    background: #ffffff;
    border-radius: 8px;
    margin: 166px auto 0;
    display: flex;
    padding: 16px 8px;
    word-break: break-word;
  }

  .circle {
    width: 12px;
    height: 12px;
    margin-top: 2px;
  }

  .dusty-font {
    font-size: 11px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #333333;
    line-height: 18px;
    margin-left: 8px;
  }

  .arrow {
    width: 54px;
    height: 50px;
    margin: 14px 0 0 15px;
  }

  .dusty-content {
    width: 312px;
    font-size: 15px;
    color: #ffffff;
    font-family: Roboto-Black, Roboto;
    border-radius: 8px;
    font-weight: 900;
    line-height: 18px;
    border: 4px solid #ffffff;
    margin: 10px auto 0;
    padding: 16px;
    word-break: break-word;
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

  .utr-frame {
    width: 335px;
    padding: 20px;
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
        margin-bottom: 20px;
      }
    }

    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -5px;
      right: 16px;
      z-index: 2;
    }
    .utr-title {
      font-size: 18px;
      font-weight: 500;
      color: #ff380c;
      line-height: 20px;
      margin-top: 110px;
    }

    .utr-content {
      font-size: 18px;
      font-weight: 400;
      font-family: Roboto-Regular, Roboto;
      color: #000601;
      line-height: 20px;
      margin-top: 20px;
      text-align: center;
    }
    .btn-Repay {
      width: 100%;
      height: 48px;
      background: $themeColor;
      border-radius: 24px;
      border: none;
      color: $themeFontColor;
      font-size: 18px;
      font-family: Roboto-Bold, Roboto;
      font-weight: 900;
      line-height: 24px;
      margin-top: 40px;
    }
    .btn-Enter {
      width: 100%;
      height: 48px;
      font-size: 18px;
      color: $themeColor;
      border: 1px solid $themeColor;
      background: #fff;
      border-radius: 24px;
      font-family: Roboto-Bold, Roboto;
      font-weight: 900;
      line-height: 24px;
      margin-top: 20px;
    }
  }
}
.row-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
}
.utr {
  padding-top: 14px;
  padding-left: 24px;
  padding-right: 24px;

  &-input {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
    .right-icon {
      width: 12px;
      height: 14px;
      position: absolute;
      right: 16px;
      bottom: 18px;
    }

    .head {
      font-size: 16px;
      font-weight: 900;
      color: #000000;
      line-height: 18px;
      margin-bottom: 16px;
    }
    .utr-value {
      width: 220px;
      height: 18px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      box-sizing: border-box;
      border: none;
    }
  }
  .actions {
    position: fixed;
    padding: 10px 24px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    .bottom-submit-btn {
      margin: 0;
    }
    .btns {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      button {
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
        &:disabled {
          background: #e9e9e9;
          border: 1px solid #e9e9e9;
          color: #999999;
        }
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .error-tips {
    margin-top: -12px;
    margin-bottom: 16px;
    visibility: hidden;
    &.show-error {
      visibility: visible;
    }
  }

  .utr-orders {
    display: flex;
    margin: 12px 0 40px 0;

    .orders-img {
      width: 12px;
      height: 12px;
      margin-top: 2px;
    }

    .orders-content {
      font-size: 12px;
      font-weight: 500;
      color: #333333;
      margin-left: 8px;
      box-sizing: border-box;
      word-break: break-word;
    }
  }
  .repay {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
    word-break: break-word;

    .head {
      font-size: 14px;
      font-weight: 900;
      color: #333333;
      line-height: 18px;
      margin-bottom: 10px;
    }
  }
}
</style>
