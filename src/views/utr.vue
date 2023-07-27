<template>
  <div class="utr content-area">
    <div class="utr-input">
      <div class="head flex-between">
        <span>UTR</span>
        <span class="color-red" @click="goUTRHelp()">Forget password?</span>
      </div>

      <div class="row-wrap">
        <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="12" class="utr-value" v-model="utr" placeholder="Please enter UTR" />
        <m-icon type="handy/蓝右" class="right-icon" :width="12" :height="14" />
      </div>
    </div>

    <div class="error-tips color-red fs-12" v-if="showError" :class="{ 'show-error': showError }">Please enter correct UTR.</div>

    <div class="repay">
      <div class="head">Repay</div>
      <div>
        1.When payment is completed,remember to fill in the UTR here;
        <br />
        2.If you haven't complete the payment, you can click
        <span class="here" @click="recreate">here</span>
        to repay;
        <br />
        3.If multiple payments are made, multiple UTRs can be submitted repeatedly”
      </div>
    </div>

    <div class="actions">
      <div class="btns">
        <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Confirm UTR</button>
      </div>
      <div class="help-center" @click="goAppBack">I don't get UTR?</div>
    </div>

    <div class="control-back" v-if="showPopUps">
      <div class="utr-frame">
        <m-icon class="close" type="handy/路径" :width="20" :height="20" @click="goAppBack" />
        <div class="head">
          <img :src="require('@/assets/img/handy/UTR点返回.png')" />
        </div>
        <div class="row-center">
          <div class="utr-title">UTR has not been received</div>
          <div class="utr-content">The order : 220624325998661663 hasn’t been repaid.</div>
        </div>
        <div class="action">
          <button class="btn-Enter" @click="showPopUps = false">Enter UTR</button>
          <button class="btn-Repay" @click="repayClick">Repay</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    utr() {
      this.canSubmit = this.utr.length == 12;
      this.showError = this.utr.length != 12;
    },
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'UTR',
      backCallback: null,
    });
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      type: this.$route.query.type || 'repay',
      utr: '',
      showError: false,
      canSubmit: false,
      orderUrl: '',
      showPopUps: false,
    };
  },
  async mounted() {
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
    window.utrCallBack = () => {
      this.showPopUps = true;
      console.log(this.showPopUps, '***** showPopUps');
      // this.goAppBack();
    };
    this.setTabBar({
      backCallback: window.utrCallBack,
    });
    this.toAppMethod('isInterceptionReturn', { isInterception: true, fuName: 'utrCallBack' });
  },
  methods: {
    repayClick() {
      console.log('repayClick');
    },
    recreate() {
      if (this.type == 'repay') {
        this.openWebview(this.orderUrl.repaymentUrl);
      } else {
        this.openWebview(this.orderUrl.extensionUrl);
      }
    },
    async submit() {
      try {
        let data = await this.$http.post(`/api/repayment/repayUTR`, {
          utr: this.utr,
          orderId: this.orderId,
        });
        console.log(data);
        if (data.returnCode == 2000) {
          this.$toast('Submitted successfully, UTR to be confirmed');
          setTimeout(() => {
            this.goAppBack();
          }, 1000);
        }
      } catch (error) {
        this.$toast(error.message);
      }
    },
    goUTRHelp() {
      this.innerJump('utr-help', { orderId: this.orderId });
    },
  },
};
</script>

<style lang="scss" scoped>
.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    width: 295px;
    padding: 24px;
    padding-top: 0;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: relative;
    .head {
      position: relative;
      height: 54px;
      img {
        position: absolute;
        top: -27px;
        left: 50%;
        transform: translateX(-50%);
        width: 295px;
        display: block;
        margin-bottom: 20px;
      }
    }

    .close {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 2;
    }
    .utr-title {
      font-size: 18px;
      font-weight: 500;
      color: #6515fe;
      line-height: 20px;
      margin-top: 90px;
    }

    .utr-content {
      font-size: 16px;
      font-weight: 400;
      font-family: Roboto-Regular, Roboto;
      color: #000601;
      line-height: 20px;
      margin-top: 14px;
      text-align: center;
    }

    .action {
      margin-top: 22px;
      display: flex;
      justify-content: space-between;

      .btn-Enter {
        width: 96px;
        height: 40px;
        font-size: 16px;
        color: #999;
        background: #fff;
        border: 1px solid #999999;
        border-radius: 20px;
        font-family: Roboto-Bold, Roboto;
        font-weight: 400;
        line-height: 20px;
      }
      .btn-Repay {
        width: 135px;
        height: 40px;
        background: #6515fe;
        border-radius: 20px;
        border: none;
        color: #fff;
        font-size: 16px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 20px;
      }
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
    margin-bottom: 24px;
    position: relative;
    .right-icon {
      position: absolute;
      right: 16px;
      bottom: 18px;
    }

    .head {
      font-size: 16px;
      font-weight: 500;
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
      color: #6515fe;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .error-tips {
    margin-top: -12px;
    margin-bottom: 20px;
    visibility: hidden;
    &.show-error {
      visibility: visible;
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
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      margin-bottom: 10px;
    }
    .here {
      color: #6515fe;
      text-decoration: underline;
    }
  }
}
</style>
