<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <div class="row-direction">
        <m-icon type="7-dayjs" :width="20" :height="18" />
        <p class="extended-term">Retraso de {{ detail.extendedTerm }} días</p>
      </div>
      <p class="extended-sub">
        Sólo necesita pagar ${{ detail.amount }} pesos hoy y luego puedes
        aplazar el pago durante{{ detail.extendedTerm }} días
      </p>
    </div>
    <div class="frame">
      <div class="step">
        <div class="step-item status column-direction">
          <div class="round"></div>
          <div class="date">{{ detail.startTime }}12312</div>
          <div class="text">Fecha de aplicación</div>
        </div>
        <div class="step-item column-direction">
          <div class="round" style="margin-top: 3px"></div>
          <div class="date" style="margin-top: 11px">
            {{ detail.updatedDueDate }}12123
          </div>
          <div class="text">Fecha de vencimiento</div>
        </div>
      </div>
    </div>
    <div class="frame">
      <div class="period" @click="checkedClick">
        <span class="fs-14 font-bold">Costes para reembolso diferido</span>
        <div class="row-direction">
          <div class="amount">${{ detail.amount }}</div>
          <m-icon
            :class="isChecked ? '' : 'rotate-90'"
            type="right"
            :width="9"
            :height="14"
          />
        </div>
      </div>
      <div v-if="!isChecked" class="order-frame">
        <div class="flex-between">
          <span>Tarifa de servicio</span>
          <span>${{ detail.defermentFee }}</span>
        </div>
        <div class="flex-between" style="margin-top: 10px">
          <span>Tarifa vencida</span>
          <span>${{ detail.overDueFee }}</span>
        </div>
      </div>
    </div>

    <div class="desc">
      Nota: Después de pagar los costes para reembolso diferido, la fecha de
      pago del reembolso se prorrogará 7 días, tras lo cual tendrá que
      reembolsar el principal + la tasa de servicio
    </div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Reembolso diferido</button>
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
import chooseBank from "@/components/chooseBank";

export default {
  components: {
    chooseBank,
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: "",
      orderUrl: "",
      isChecked: true,
    };
  },
  async mounted() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Detalles del pedido",
      backCallback: () => {
        this.goAppBack();
      },
    });

    this.getDetail();
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    checkedClick() {
      this.isChecked = !this.isChecked;
    },
    async selectBank(bank) {
      this.showPaymentTips = false;
      this.setEventTrackStartTime();
      this.sendEventTrackData({ leaveBy: 1, page: "payment" });
      this.openWebview(
        `${apiHost}/api/extension/prepay?id=${this.detail.orderBillId}&payType=${bank.payType}&bankCode=${bank.bankCode}`
      );
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async getDetail() {
      console.log("this.orderId", this.orderId);
      try {
        let data = await this.$http.post("/api/extension/detail", {
          id: this.orderId,
        });
        this.detail = data.data;
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId,
        });
        this.updateTrackerData({ key: "productId", value: res.data.productId });
        this.updateTrackerData({
          key: "status",
          value: this.ORDER_STATUS_LIST[res.data.orderStatus],
        });
      } catch (error) {
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-detail {
  background-image: url(../assets/images/extension.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 230px;
  .defer-head {
    padding: 12px 20px;
    color: #000;
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    .extended-term {
      width: 220px;
      font-size: 16px;
      font-family: Roboto, Roboto;
      font-weight: 900;
      color: #333;
      line-height: 20px;
      margin-left: 8px;
    }
    .extended-sub {
      width: 230px;
      font-size: 12px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 16px;
      word-break: break-word;
      margin-top: 5px;
    }
  }
  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;

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
        height: 48px;
        border: none;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
      }
      button {
        flex: 1;
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

  .amount {
    font-size: 14px;
    font-weight: bold;
    color: #ff4b3f;
    line-height: 20px;
    margin-right: 10px;
  }
  .rotate-90 {
    transform: rotate(90deg);
  }

  .order-frame {
    background: #f6f6f6;
    border-radius: 8px;
    padding: 16px 20px;
    word-break: break-word;
    margin-top: 8px;
  }

  .period {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      .value {
        margin-right: 0px;
        font-size: 24px;
        font-weight: bold;

        line-height: 24px;
      }
      .icon {
        margin-top: -4px;
      }
    }

    .value {
      font-size: 20px;
      font-weight: 900;
      color: #434af9;
      line-height: 24px;
      margin-right: 5px;
    }
  }

  > div {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 18px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .desc {
    font-size: 14px;
    font-weight: 400;
    color: #999;
    line-height: 18px;
    margin: 20px 20px 0;
    word-break: break-word;
  }
  .frame {
    width: 335px;
    background: #ffffff;
    padding: 24px 20px;
    margin: 10px auto 20px;
    border-radius: 16px;
    box-sizing: border-box;
  }
  .step {
    display: flex;
    align-items: center;
    justify-content: center;

    &::after {
      position: absolute;
      content: " ";
      top: 227px;
      left: 50%;
      transform: translateX(-50%);
      width: 152px;
      height: 4px;
      background: #eae6f6;
      z-index: 0;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;

      .round {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background: #eae6f6;
        z-index: 99;
      }

      &.status {
        .round {
          background: #a05bf8;
          border: 3px solid #eae6f6;
        }
      }
      .text {
        font-size: 12px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
        margin-top: 4px;
      }
      .date {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
        font-family: Roboto, Roboto;
        margin-top: 8px;
      }
      .step-wrapper {
        flex-grow: 1;
      }
    }
  }
}

.column-direction {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.row-direction {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
}
</style>
