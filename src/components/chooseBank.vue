<template>
  <div>
    <div class="modal" v-if="show">
      <div class="modal-content payment-success-container">
        <div class="content">
          <header>
            Seleccione la forma de pago
            <m-icon
              class="close"
              type="close"
              :width="16"
              :height="16"
              @click="cancelSheet"
            />
          </header>
          <ul>
            <li @click="chooseBankA('Nequi', '')">Nequi</li>
            <li @click="chooseBankB">PSE(Pagos Seguros en Línea)</li>
          </ul>
          <div class="tips">
            <div>Consejos:</div>
            <div>
              Una vez realizado el pago, el banco suele procesarlo en el plazo
              de una hora y el pedido se actualiza automáticamente.
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet
      class="bank-picker-sheet"
      v-model="openSelect"
      title="Forma de pago"
      close-on-click-action
      @cancel="cancelSheet"
    >
      <van-picker
        ref="bankPicker"
        class="bank-picker"
        :columns="banks"
        :item-height="67"
        :default-index="defaultIndex"
      >
        <template #option="PickerOption">
          <div class="pick-value">
            <div>
              <div>{{ PickerOption.text }}</div>
              <span class="recommend" v-if="PickerOption.recommend"
                >Recomendar</span
              >
            </div>
          </div>
        </template>
      </van-picker>
      <div class="submit">
        <button class="bottom-submit-btn" @click="confirmSelect">Enviar</button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import * as ALL_ATTRS from "@/utils/constants";
const LAST_CHOOSE_BANK_KEY = "last-choosed-bank-key";
export default {
  props: ["show"],
  data() {
    return {
      banks: ALL_ATTRS.default.BANKS2,
      openSelect: false,
      defaultIndex: 0,
    };
  },

  methods: {
    confirmSelect() {
      let selectBank = this.$refs.bankPicker.getValues()[0];
      localStorage.setItem(LAST_CHOOSE_BANK_KEY, selectBank.value);
      this.openSelect = false;
      this.chooseBankA("Pse", selectBank.value);
    },
    chooseBankA(type, value) {
      this.$emit("select-bank", {
        payType: type,
        bankCode: value,
      });
    },
    cancelSheet() {
      this.$emit("update:show", false);
    },
    chooseBankB() {
      this.$emit("update:show", false);
      let lastChooseBank = localStorage.getItem(LAST_CHOOSE_BANK_KEY);
      let defaultIndex = 0;
      for (let i = 0; i < this.banks.length; i++) {
        if (this.banks[i].value == lastChooseBank) {
          defaultIndex = i;
        }
      }
      this.defaultIndex = defaultIndex;
      this.openSelect = true;
      if (lastChooseBank) {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pick-value {
  > div {
    font-size: 10px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #a1a5fc;
    line-height: 16px;
    text-align: center;
    transform: scale(0.9);
    transition: all 0.3s;
    &:first-child {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #9a9a9a;
      line-height: 20px;
      position: relative;

      .recommend {
        width: 74px;
        height: 28px;
        background: #ffdc62;
        border-radius: 8px 8px 8px 0px;
        font-size: 10px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -90px;
        bottom: 0;
        transform: scale(0.9);
        opacity: 0.6;
      }
    }
  }
}

.payment-success-container {
  width: 315px;
  box-sizing: border-box;
  border-radius: 8px;
  .policy {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 400;
    margin: 50px 0px 0;
    color: #000601;
    position: relative;
    .tips {
      position: absolute;
      top: -30px;
      left: -8px;
      width: 130px;
      height: 20px;
      background: #fbe396;
      border-radius: 24px 24px 24px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
      transform: scale(0.9);
    }
    .m-icon {
      margin-top: -2px;
    }
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }

  .close {
    position: absolute;
    top: 22px;
    right: 20px;
  }
  .content {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: #000601;
    text-align: left;
    header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #a05bf8;
      line-height: 24px;
      margin: 20px 0 30px;
    }
    ul {
      li {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 24px;

        &:nth-child(1) {
          border-bottom: 2px solid #e3eceb;
        }
      }
    }
    .tips {
      background: #f6effe;
      border-radius: 8px;
      padding: 10px;
      margin: 0 10px 20px;
      word-break: break-word;
      > div {
        &:first-child {
          font-size: 12px;
          font-family: Roboto, Roboto;
          font-weight: 900;
          color: #a05bf8;
          line-height: 16px;
        }
      }
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333;
      line-height: 18px;
    }
    a {
      color: #1143a4;
      text-decoration: underline;
    }
  }
}
</style>
