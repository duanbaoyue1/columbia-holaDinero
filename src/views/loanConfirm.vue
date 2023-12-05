<template>
  <div class="loan-confirm content-area">
    <div class="loan-money column-direction-center">
      <div class="title">Monto del préstamo</div>
      <div class="amount">
        <span>$</span>
        {{ orderInfo.estimatedRepaymentAmount || 0 }}
      </div>

      <div class="line" />

      <div class="item margin-top-24">
        <span>Monto total de recibo</span>
        <span>$ {{ orderInfo.actualAmount }}</span>
      </div>

      <div class="item margin-top-16">
        <span>Monto total de reembolso</span>
        <span class="color-000">$ {{ orderInfo.approvalAmount }}</span>
      </div>

      <div class="line"></div>

      <div class="item margin-top-24">
        <span>Fecha de aplicación</span>
        <span>{{ orderInfo.applyTime }}</span>
      </div>
      <div class="item margin-top-16">
        <span>Fecha de reembolso</span>
        <span>{{ orderInfo.expectedRepaymentTime }}</span>
      </div>

      <div class="line"></div>

      <div class="item margin-top-24">
        <span>Forma de pago</span>
        <span>{{ orderInfo.bankCardName }}</span>
      </div>
      <div class="item bank margin-top-16">
        <span>Número de cuenta receptora</span>
        <span>{{ orderInfo.bankCardNo }}</span>
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">
        Confirme el préstamo
      </button>
    </div>
  </div>
</template>

<script>
import { apiHost } from "@/services/apiConfig";

export default {
  data() {
    return {
      choosed: true,
      canSubmit: true,
      orderInfo: {},
      orderId: this.$route.query.orderId,
      saving: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      title: "Confirmación del préstamo",
    });
  },
  mounted() {
    this.setEventTrackStartTime();
    this.eventTracker("confirm_access");
    this.getOrderInfo();
  },
  watch: {
    choosed: {
      handler() {
        this.canSubmit = !!this.choosed;
      },
      deep: true,
    },
  },
  methods: {
    checkAgreement() {
      this.openWebview(`${apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    togglePolicy() {
      this.choosed = !this.choosed;
    },
    async getOrderInfo() {
      try {
        this.showLoading();
        let data = await this.$http.post("/api/order/applyConfirmation", {
          orderId: this.orderId,
        });
        this.orderInfo = data.data;

        this.setExpectedRepaymentTime();
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },

    setExpectedRepaymentTime() {
      const currentDate = new Date(
        this.orderInfo.applyTime.replace(/\//g, "-")
      );
      currentDate.setMonth(currentDate.getMonth() + 3);
      this.orderInfo.expectedRepaymentTime = `${currentDate.getUTCFullYear()}/${this.resetDate(
        currentDate.getMonth() + 1
      )}/${this.resetDate(currentDate.getDate())}`;
    },

    resetDate(num) {
      return num > 9 ? num : `0${num}`;
    },

    async submit() {
      this.eventTracker("confirm_submit");
      this.showLoading();
      let syncRes;
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.judgeCanApply();
        } catch (error) {
          this.hideLoading();
          this.$toast("Carga fallida, inténtelo más tarde");
          return;
        }
        if (syncRes.success) {
          // 2. 真正的提交动作
          await this.$http.post(`/api/order/apply`, { orderId: this.orderId });
          this.sendEventTrackData({ leaveBy: 1 });

          // 成功或者失败的跳转
          this.innerJump(
            "loanSuccessMulti",
            {
              orderId: this.orderId,
              single: true,
              systemTime: this.getLocalSystemTimeStamp(),
            },
            true
          );
        }
      } catch (error) {
        this.$toast(error.message || "Carga fallida, inténtelo más tarde");
        setTimeout(() => {
          this.innerJump("loanFail", { orderId: this.orderId }, true);
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
  background-image: url(../assets/images/loan-confirmation.png);
  background-attachment: local;
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 204px;
  background-repeat: no-repeat;

  .loan-money {
    background: #fff;
    border-radius: 16px;
    margin-top: 70px;
    padding: 24px 20px;
  }

  .title {
    font-size: 12px;
    font-family: Roboto, Roboto;
    font-weight: 900;
    color: #333333;
    line-height: 20px;
  }

  .amount {
    font-size: 24px;
    font-weight: bold;
    color: #333333;
    line-height: 38px;

    span {
      font-size: 14px;
      font-weight: 900;
      color: #333;
      line-height: 20px;
    }
  }

  .item {
    width: 100%;
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

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
  }
}

.column-direction-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line {
  width: 335px;
  height: 2px;
  background: #e9e9e9;
  margin-top: 24px;
}

.margin-top-24 {
  margin-top: 24px;
}

.margin-top-16 {
  margin-top: 16px;
}
</style>
