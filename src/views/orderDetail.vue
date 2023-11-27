<template>
  <div class="order-detail content-area" :class="'order_' + detail.orderStatus">
    <div class="info-frame">
      <template v-if="showDate">
        <div class="order-info">
          <div class="flex-between" v-if="detail.orderStatus >= 80">
            <span>Monto de reembolso</span>
            <span
              class="font-bold align-end"
              style="line-height: 26px; color: #fc0f0f"
            >
              <span class="fs-18">$</span>
              <span class="fs-18">{{ detail.estimatedRepaymentAmount }}</span>
            </span>
          </div>
          <div class="flex-between">
            <span>Fecha de vencimiento</span>
            <span class="fw-500">{{
              detail.actualRepaymentTime || detail.expectedRepaymentTime
            }}</span>
          </div>
        </div>
        <div class="line"></div>
      </template>
      <div class="order-info">
        <div class="flex-between">
          <span>ID del préstamo</span>
          <span>{{ detail.orderNo }}</span>
        </div>
        <div class="flex-between">
          <span>Monto del préstamo</span>
          <span class="font-bold">
            <span class="money-label">$</span>
            <span>{{ detail.approvalAmount }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="showDate">
          <span>Importe real recibido</span>
          <span class="font-bold">
            <span class="money-label">$</span>
            <span>{{ detail.actualAmount }}</span>
          </span>
        </div>
      </div>
      <template v-if="showDate">
        <div class="line"></div>
        <div class="order-info">
          <div class="flex-between">
            <span>Tarifa de servicio</span>
            <span class="font-bold">
              <span class="money-label">$</span>
              <span>{{ detail.incidentalAmount }}</span>
            </span>
          </div>
          <div class="flex-between" v-if="detail.penaltyInterest > 0">
            <span>Tarifa vencida</span>
            <span class="font-bold">
              <span class="money-label">$</span>
              <span>{{ detail.penaltyInterest }}</span>
            </span>
          </div>
        </div>
      </template>
      <template
        v-if="deferTimes > 0 || (showDate && detail.showExtension == 1)"
      >
        <div class="line"></div>
        <div class="order-info">
          <div class="flex-between" @click="goDeferHis">
            <span>Historial de reembolso diferido</span>
            <div class="color-blue font-bold">
              <div class="veces">{{ deferTimes }} veces</div>
              <m-icon class="icon" type="right" :width="10" :height="18" />
            </div>
          </div>
        </div>
      </template>
      <div class="line"></div>
      <div class="order-info">
        <div class="flex-between">
          <span>Forma de pago</span>
          <span>{{ detail.bankCardName }}</span>
        </div>
        <div class="flex-between bank-no">
          <span>Número de cuenta receptora</span>
          <span>{{ detail.bankCardNo }}</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="order-info">
        <div class="flex-between">
          <span>Fecha de aplicación</span>
          <span class="fw-500">{{ detail.applyTime }}</span>
        </div>

        <div class="flex-between" v-if="showDate">
          <span>Fecha de recibo</span>
          <span class="fw-500">{{ detail.arrivalTime }}</span>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="btns" v-if="[80, 90, 110].includes(detail.orderStatus)">
        <button
          class="btn-default"
          v-if="detail.orderStatus == 110"
          @click="goCompleteBank"
        >
          Cambio de cuenta de cobro
        </button>
        <template
          v-else-if="detail.orderStatus == 80 || detail.orderStatus == 90"
        >
          <button
            class="btn-line"
            v-if="detail.showExtension == 1"
            @click="applyDefer"
          >
            Reembolso diferido
          </button>
          <button class="btn-default" @click="showPaymentTips = true">
            Ir a reembolsar
          </button>
        </template>
      </div>
      <div class="help-center" @click="innerJump('help-center')">
        Centro de ayuda
      </div>
    </div>

    <choose-bank
      :show.sync="showPaymentTips"
      @update:show="showPaymentTips = $event"
      @select-bank="selectBank"
    />
  </div>
</template>

<script>
import { apiHost } from "@/services/apiHost";
import chooseBank from "@/components/chooseBank.vue";

export default {
  components: {
    chooseBank,
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
      showPaymentTips: false,
      detail: {},
      deferTimes: 0,
      orderUrl: "",
    };
  },
  mounted() {
    this.setEventTrackStartTime();
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      black: false,
      title: "Detalles del pedido",
      backCallback: () => {
        this.sendEventTrackData({});
        this.goAppBack();
      },
    });
    this.getDetail();
    this.getDeferTimes();
  },
  computed: {
    showDate() {
      return [80, 90, 100, 101].includes(this.detail.orderStatus);
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return "Bajo revisión";
        case 21:
          return "Bajo revisión";
        case 30:
          return "Está pagando";
        case 40:
          return "Rechazad";
        case 70:
          return "Está pagando";
        case 80:
          return "Pendiente de reembolso";
        case 90:
          return "Atrasado";
        case 100:
          return "Completado";
        case 101:
          return "Completado";
        case 110:
          return "Transferencia fallida";
        default:
          return "Bajo revisión";
      }
    },
  },
  methods: {
    goCompleteBank() {
      this.sendEventTrackData({ leaveBy: 1 });
      this.innerJump("complete-bank", { orderId: this.orderId, from: "mine" });
    },
    async selectBank(bank) {
      this.showPaymentTips = false;
      // 离开
      this.sendEventTrackData({ leaveBy: 1 });

      // 支付
      this.setEventTrackStartTime();
      this.sendEventTrackData({ leaveBy: 1, page: "payment" });
      this.openWebview(
        `${apiHost}/api/repayment/prepay?id=${this.detail.orderBillId}&payType=${bank.payType}&bankCode=${bank.bankCode}`
      );
    },
    applyDefer() {
      this.sendEventTrackData({ leaveBy: 1 });
      this.innerJump("defer-detail", { orderId: this.orderId });
    },
    goDeferHis() {
      this.sendEventTrackData({ leaveBy: 1 });
      this.innerJump("defer-history", { orderId: this.orderId });
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

        this.updateTrackerData({
          key: "productId",
          value: this.detail.productId,
        });
        this.updateTrackerData({
          key: "status",
          value: this.ORDER_STATUS_LIST[this.detail.orderStatus],
        });

        if (
          [
            "Rejected",
            "Repayment Successful",
            "Pending Repayment",
            "Overdue",
          ].includes(this.orderStatusText)
        ) {
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
.order-detail {
  padding-bottom: 120px;
  background-image: url(../assets/images/bajo-revision.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 230px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  background-attachment: local;

  &.order_30,
  &.order_70 {
    background-image: url(../assets/images/esta-pagando.png);
    background-size: 375px 290px;
    background-position: top;
    background-repeat: no-repeat;
    background-color: #f6f6f6;
    box-sizing: border-box;
    background-attachment: local;
  }
  &.order_40 {
    background-image: url(../assets/images/rechazado.png);
  }

  &.order_80 {
    background-image: url(../assets/images/reembolso.png);
  }
  &.order_90 {
    background-image: url(../assets/images/atrasado.png);
  }
  &.order_100,
  &.order_101 {
    background-image: url(../assets/images/completado.png);
  }
  &.order_110 {
    background-image: url(../assets/images/transferencia-fallida.png);
  }

  &.order_30,
  &.order_70 {
    .info-frame {
      margin: 170px auto 0;
    }
  }

  .bank-no {
    flex-direction: column;
    align-items: baseline;
    span {
      margin-left: 0 !important;
      &:last-child {
        margin-top: 8px;
      }
    }
  }

  .money-label {
    font-size: 12px;
    color: #333333;
    line-height: 14px;
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
        background: #a05bf8;
        border-radius: 25px;
        height: 46px;
        border: 1px solid #a05bf8;
        color: #ffffff;
        font-weight: bold;
        font-size: 16px;
      }
      .btn-line {
        border-radius: 25px;
        border: 1px solid #999999;
        font-weight: bold;
        font-size: 16px;
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
      color: #a05bf8;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .info-frame {
    width: 335px;
    background: #ffffff;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    margin: 115px auto 0;
    padding-top: 24px;

    .line {
      width: 335px;
      height: 4px;
      background: #f9f9f9;
      margin-bottom: 20px;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      box-sizing: border-box;
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
      margin-bottom: 20px;
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
          margin-left: 10px;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
}

.veces {
  height: 20px;
  font-size: 12px;
  font-family: Roboto, Roboto;
  font-weight: 500;
  color: #fff;
  line-height: 16px;
  background: #ff4a43;
  border-radius: 12px;
  padding: 0 6px;
  margin-right: 10px;
}
</style>
