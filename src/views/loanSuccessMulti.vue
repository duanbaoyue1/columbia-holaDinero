<template>
  <div class="loan multi content-area">
    <div class="loan-tips">
      <m-icon
        class="icon"
        type="successfully-applied"
        :width="100"
        :height="100"
      />
      <div class="title" v-if="loans.length">
        Enhorabuena
        <br />
        <span>ha enviado correctamente su solicitud</span>
      </div>
      <template v-if="!loans.length">
        <div v-if="!resLoans.length" class="title">
          Solicitud enviada con éxito
        </div>
        <div class="apply" @click="check">
          {{
            resLoans.length ? "Ver todos los pedidos" : "Consultar la solicitud"
          }}
        </div>
      </template>
      <div v-else class="apply" @click="applyMulti">
        Aumento $ {{ totalAmount }} Importe
      </div>
    </div>

    <div class="other-loans" v-if="loans.length">
      <div class="tips">
        Usted está en nuestro canal exclusivo VIP en vista de su buena
        calificación.
      </div>
      <div class="checked-num">Ya Seleccionar {{ checkedNums }} productos</div>
      <div
        v-for="(loan, index) in loans"
        :key="loan.id"
        class="loan-item"
        :class="{ active: !loan.unChecked }"
        @click="checkLoan(index)"
      >
        <div class="row-flex">
          <img class="icon" :src="loan.icon" />
          <div class="name">{{ loan.productName }}</div>
        </div>
        <div class="row-space-between" style="margin-top: 20px">
          <div class="value">Importe de préstamo ($)</div>
          <div class="min-amount">{{ loan.minAmount }}</div>
        </div>
      </div>
    </div>

    <!-- 没有推荐结果时显示 -->
    <res-loans v-else :loans="resLoans" />
    <!-- 谷歌好评 -->
    <google-feedback v-show="showGoogleFeed" :show.sync="showGoogleFeed" />

    <div class="control-back" v-if="showBackControl">
      <div class="content">
        <m-icon
          class="close"
          type="close"
          :width="16"
          :height="16"
          @click="leave"
        />
        <div class="head">
          <img :src="require('@/assets/images/countdown-pop-up.png')" />
        </div>
        <div class="content">
          Estás a un paso de un límite de crédito de $ {{ totalAmount }}, ¿estás
          seguro de que quieres renunciar a tu derecho?
          <div class="count">
            Terminación automática después de
            <div class="time">{{ count }}S</div>
          </div>
        </div>
        <div class="action">
          <button class="btn-default" @click="showBackControl = false">
            Piénsalo otra vez
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResLoans from "@/components/resLoans";
import GoogleFeedback from "@/components/googleFeedback";

export default {
  components: {
    ResLoans,
    GoogleFeedback,
  },
  data() {
    window.loanBtnCallback = async () => {
      if (this.loans.length > 0) {
        this.showBackModal();
      } else if (await this.getNeedGoogle()) {
        this.nextStep = "goBack";
        this.showGoogleFeed = true;
      } else {
        this.goAppBack();
      }
    };
    return {
      needRecommend: JSON.parse(this.$route.query.needRecommend || true), // 是否需要推荐 从活动过来的不用推荐
      systemTime: this.$route.query.systemTime || "", // 上次订单时间
      single: JSON.parse(this.$route.query.single || false), // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      nextStep: "",
      showBackControl: false,
      backInterval: null, // 回退倒计时
      showGoogleFeed: false,
      resLoans: [],
    };
  },
  mounted() {
    this.setEventTrackStartTime();

    document.body.style.backgroundColor = "#f6f6f6";

    this.setTabBar({
      show: true,
      fixed: true,
      transparent: true,
      title: "Solicitud de préstamo",
      backCallback: window.loanBtnCallback,
    });
    this.toAppMethod("backReturn", {
      isInterception: true,
      fuName: "loanBtnCallback",
    });
    if (this.needRecommend) {
      this.getRecommendLoans();
    }
  },
  watch: {
    showGoogleFeed: {
      handler() {
        if (!this.showGoogleFeed && this.nextStep) {
          if (this.nextStep == "goBack") {
            this.goAppBack();
          } else if (this.nextStep == "goAllOrders") {
            this.innerJump("orderList", {}, true);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    async getRes() {
      try {
        let res = await this.$http.post(`/api/order/applyResultOrderList`, {
          startApplyTime: this.systemTime,
        });
        this.resLoans = res.data.list || [];
      } catch (e) {}
    },
    leave() {
      this.toAppMethod("backReturn", { isInterception: false });
      this.sendEventTrackData({});
      this.goHome();
    },
    showBackModal() {
      this.count = 10;
      window.clearInterval(this.backInterval);
      this.backInterval = null;
      this.backInterval = setInterval(() => {
        if (this.count == 0) {
          window.clearInterval(this.backInterval);
          this.backInterval = null;
        } else {
          this.count--;
        }
      }, 1000);
      this.showBackControl = true;
    },

    async getNeedGoogle() {
      try {
        let res = await this.$http.post(`/api/product/favourableComment`);
        if (res.returnCode == 2000) {
          return res.data;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async getRecommendLoans() {
      try {
        this.showLoading();
        let data;
        if (this.single) {
          data = await this.$http.post(`/api/product/maskRecommendList`);
          this.loans = data.data.list || [];
          this.loans = this.loans.map((t) => {
            t.maxAmount = t.minAmount;
            return t;
          });
        } else {
          data = await this.$http.post(`/api/product/mergeProduct/list`);
          this.loans = data.data.mergPushProductList || [];
        }
        this.updateCheckedNum();

        // 查询申请订单
        if (!this.loans.length) {
          this.getRes();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async check() {
      // 没有贷款产品且需要google弹窗
      if (!this.loans.length && (await this.getNeedGoogle())) {
        this.nextStep = "goAllOrders";
        this.showGoogleFeed = true;
      } else {
        this.innerJump("orderList", {}, true);
      }
    },

    checkLoan(index) {
      if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
      this.$set(this.loans, index, {
        ...this.loans[index],
        unChecked: !this.loans[index].unChecked,
      });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter((t) => !t.unChecked).length;
      this.totalAmount = this.sumArr(
        this.loans.filter((t) => !t.unChecked).map((t) => t.minAmount)
      );
    },

    sumArr(arr) {
      return arr.reduce(function (prev, cur) {
        return parseInt(prev) + parseInt(cur);
      }, 0);
    },

    async applyMulti() {
      let loanIds = this.loans.filter((t) => !t.unChecked).map((t) => t.id);
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
          // 2. 真正提交
          let res = await this.$http.post(`/api/order/mergePush/preApply`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds,
          });
          if (res.returnCode == 2000) {
            await this.$http.post(`/api/order/mergePush/apply`, {
              orderIdList: res.data.orderIdList,
            });
            this.$toast("Solicitud enviada con éxito");
            setTimeout((res) => {
              this.sendEventTrackData({ leaveBy: 1 });
              this.getRecommendLoans();
            }, 1000);
          }
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 222;

    > .content {
      width: 315px;
      padding: 24px;
      padding-top: 0;
      box-sizing: border-box;
      background: #fff;
      border-radius: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
      .head {
        position: relative;
        height: 54px;
        img {
          width: 315px;
          position: absolute;
          top: -27px;
          left: 50%;
          transform: translateX(-50%);
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
      .content {
        font-size: 12px;
        // font-family: Roboto, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        word-break: break-word;
        margin-top: 100px;

        .count {
          height: 60px;
          font-size: 14px;
          font-family: Roboto, Roboto;
          font-weight: bold;
          color: #333;
          line-height: 24px;
          text-align: center;
          margin-top: 10px;
          background-image: url(../assets/images/countdown.png);
          background-attachment: local;
          background-position: top;
          background-repeat: no-repeat;
          flex-direction: column;
          background-size: 275px 60px;
          padding-top: 5px;
          .time {
            font-size: 18px;
            font-weight: bold;
            color: #a05bf8;
            line-height: 24px;
          }
        }
      }

      .action {
        .btn-default {
          width: 270px;
          height: 36px;
          background: #a05bf8;
          border-radius: 18px;
          border: none;
          color: #fff;
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
          margin-top: 25px;
        }
      }
    }
  }

  .bottom-action {
    width: 360px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-between;
      .btn-line {
        width: 120px;
      }
      .btn-default {
        width: 190px;
      }
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
      margin-top: 10px;
      text-align: center;
    }
  }
  .other-loans {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 16px 0 -20px;
    padding-bottom: 10px;

    .tips {
      width: 327px;
      background: #ff4a43;
      font-family: Roboto, Roboto;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding: 20px;
      word-break: break-word;
      margin: 0 20px;
    }

    .checked-num {
      width: 100%;
      margin: 32px 0 20px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loan-item {
      width: 335px;
      background: #fff;
      border: 1px solid #fff;
      border-radius: 16px;
      padding: 20px;
      box-sizing: border-box;
      position: relative;
      margin: 0 auto 16px;

      .name {
        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
        line-height: 20px;
      }
      .value {
        font-size: 10px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }
      .min-amount {
        font-size: 20px;
        font-weight: bold;
        color: #fc0f0f;
        line-height: 24px;
      }
      .icon {
        width: 24px;
        height: 24px;
        display: block;
        margin-right: 10px;
      }
      &::after {
        position: absolute;
        content: " ";
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
        background-image: url(../assets/images/not-selected.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      &.active {
        background: #f6effe;
        border: 1px solid #a05bf8;
        &::after {
          background-image: url(../assets/images/selected.png);
        }
      }
    }
  }

  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin-top: 8px;
      font-family: Roboto, Roboto;

      span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #a7a7a7;
        line-height: 30px;
      }
    }
    .apply {
      width: 335px;
      height: 48px;
      background: #a05bf8;
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      margin-top: 30px;
    }
  }

  &.multi {
    .loan-tips {
      padding-top: 32px;
    }
  }
}

.row-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
}

.row-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
