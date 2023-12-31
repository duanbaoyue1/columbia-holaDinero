<template>
  <div class="add-bank content-area" :class="{ 'from-order': from == 'order' }">
    <template v-if="from == 'order'">
      <div class="step">
        <complete-step :actionIndex="3"></complete-step>
      </div>
    </template>
    <div class="edit-area">
      <div class="line-item select-bank" @click="openSelectModel">
        <div class="label">Forma de pago</div>
        <input
          v-model="selectBank.text"
          disabled
          placeholder="Por favor, elija"
        />
        <m-icon class="right" type="right" :width="8" :height="16" />
      </div>
      <div class="line-item">
        <div class="label">Número de cuenta receptora</div>
        <!-- :disabled="markLoanCard != ''" -->
        <input
          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          type="number"
          maxlength="20"
          v-model="editData.accountNumber"
          placeholder="Por favor escribe"
        />
      </div>
      <div class="line-item">
        <div class="label">Nombre del beneficiario</div>
        <!-- :disabled="markLoanCard != ''" -->
        <input
          v-model="editData.userName"
          placeholder="Please enter your name"
        />
      </div>
    </div>
    <div class="tips">
      <header>Consejos:</header>
      <div>
        1. Recomendamos los siguientes cuatro bancos: Nequi, Bancolombia,
        Daviplata, que admiten préstamos en fin de semana y festivos y tienen un
        tiempo de llegada rápido.
        <br />
        2. Por lo general, los fondos tardan de 1 a 2 días hábiles en llegar,
        pero puede tardar hasta el tercer día hábil debido a la lentitud de
        procesamiento de los bancos, así que por favor sea paciente. Por favor,
        espere pacientemente. El tiempo de liberación está sujeto al tiempo real
        de llegada.
      </div>
    </div>
    <div class="submit">
      <button
        class="bottom-submit-btn"
        :disabled="!canSubmit"
        @click="showConfirmBank"
      >
        Enviar
      </button>
    </div>

    <van-action-sheet
      class="bank-picker-sheet"
      v-model="openSelect"
      title="Elegir banco"
      close-on-click-action
    >
      <van-picker
        ref="bankPicker"
        class="bank-picker"
        :columns="BANKS"
        :item-height="75"
      >
        <template #option="PickerOption">
          <div class="pick-value">
            <div>
              {{ PickerOption.text }}
              <span class="recommend" v-if="PickerOption.recommend"
                >Recomendar</span
              >
            </div>
            <div>{{ PickerOption.desc || "1-2 días hábiles para llegar" }}</div>
          </div>
        </template>
      </van-picker>
      <div class="submit">
        <button class="bottom-submit-btn" @click="confirmSelect">Enviar</button>
      </div>
    </van-action-sheet>

    <van-popup v-model="showConfirmModal">
      <div class="confirm-data">
        <header>Confirmar la información de la cuenta receptora</header>
        <div class="content">
          <div class="label">Forma de pago</div>
          <div class="value">{{ selectBank.text }}</div>
          <div class="label">Número de cuenta receptora</div>
          <div class="value">{{ editData.accountNumber }}</div>
          <div class="label">Nombre del beneficiario</div>
          <div class="value">{{ editData.userName }}</div>
        </div>
        <div class="actions">
          <button class="cancel" @click="showConfirmModal = false">
            Cancelar
          </button>
          <button @click="submit">Ok</button>
        </div>
        <div class="confirm-tips">
          {{
            markLoanCard
              ? "Si la transaccion de su pedido falla, le recomendamos que cambie a una nueva cuenta bancaria"
              : "Asegúrese de que la información es correcta, No se puede cambiar después de la confirmación."
          }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ifscSelect from "@/components/ifscSelect";
import CompleteStep from "@/components/completeStep";
import { BANKS } from "@/utils/constants";

export default {
  components: {
    ifscSelect,
    CompleteStep,
  },

  data() {
    window.addBankCallBack = () => {
      this.showMessageBox({
        content: "¡Espere, todavía queda un paso para obtener el dinero!",
        confirmBtnText: "OK",
        cancelBtnText: "Renunciar",
        class: "back-control",
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.hideMessageBox();
          if (this.fromType) {
            this.toAppMethod("finishThisPage");
          } else {
            this.goAppBack();
          }
        },
        iconPath: "Information-return",
      });
    };

    return {
      BANKS,
      openSelect: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      selectBank: {
        text: "",
        value: "",
      },
      editData: {
        userName: "",
      },
      markLoanCard: null,
      from: this.$route.query.from,
      orderId: this.$route.query.orderId,
      showConfirmModal: false,
      saving: false,
      historyBank: {
        text: "",
        accountNumber: "",
      },
      fromType: this.$route.query.fromType,
    };
  },
  watch: {
    userInfo: {
      handler() {
        this.editData.userName = `${this.userInfo.identityName} ${this.userInfo.identityLastName}`;
      },
      deep: true,
    },
    editData: {
      handler() {
        this.canSubmit =
          (this.editData.accountNumber && this.editData.userName) ||
          this.markLoanCard;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Añadir método de pago",
    });
  },
  async mounted() {
    this.setEventTrackStartTime();

    this.eventTracker("bank_add_access");
    if (this.from == "order") {
      this.setTabBar({
        backCallback: window.addBankCallBack,
      });

      try {
        this.showLoading();
        let data = await this.$http.post(
          "/api/remittance/remittanceAccountList"
        );
        let defaultCards = (data.data.list || []).filter(
          (t) => t.markLoanCard == 1
        );
        // 首页过来的订单，这个时候选择默认卡绑定
        if (defaultCards && defaultCards.length == 1) {
          this.markLoanCard = defaultCards[0];
          this.selectBank.text = this.markLoanCard.bank;
          // this.selectBank.value = this.markLoanCard.accountNumber;
          this.editData.accountNumber = this.markLoanCard.accountNumber;

          this.historyBank.text = this.markLoanCard.bank;
          this.historyBank.accountNumber = this.markLoanCard.accountNumber;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    }
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    confirmSelect() {
      this.eventTracker("bank_add_submit");
      this.selectBank = this.$refs.bankPicker.getValues()[0];
      this.openSelect = false;
    },
    showConfirmBank() {
      // 从订单进来，如果已经有卡，直接完成绑定，进入确认页
      // if (this.from == "order" && this.markLoanCard) {
      //   this.bindCardAndJump(this.markLoanCard.id);
      //   return;
      // }
      this.showConfirmModal = true;
    },
    openSelectModel() {
      // if (this.from == "order" && this.markLoanCard) {
      //   return;
      // }
      this.openSelect = true;
    },
    async bindCardAndJump(cardId) {
      this.showLoading();
      // 绑卡
      try {
        await this.$http.post(`/api/order/bindRemittanceAccount`, {
          remittanceAccountId: cardId,
          orderId: this.orderId,
        });
        // 判断是否需要确认订单
        let appMode = await this.getAppMode();
        this.sendEventTrackData({ leaveBy: 1 });
        if (appMode.confirmType == 1) {
          // 需要进确认申请页
          this.innerJump("loanConfirm", { orderId: this.orderId }, true);
        } else {
          // 不需要进确认申请页
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
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    async submit() {
      if (
        this.from == "order" &&
        this.markLoanCard &&
        this.historyBank.text === this.selectBank.text &&
        this.historyBank.accountNumber === this.editData.accountNumber
      ) {
        this.bindCardAndJump(this.markLoanCard.id);
        return;
      }

      if (this.saving) return;
      this.saving = true;
      this.showLoading();
      try {
        this.eventTracker("bank_confirm_submit");
        let saveData = {
          accountNumber: this.editData.accountNumber,
          bank: this.selectBank.text,
          // bankCode: this.selectBank.value,
          name: this.editData.userName,
        };

        // 较验银行卡长度
        let lengthLimit = this.selectBank.lengthLimit;
        if (typeof lengthLimit != "undefined") {
          if (lengthLimit instanceof Array) {
            if (
              saveData.accountNumber.length < lengthLimit[0] ||
              saveData.accountNumber.length > lengthLimit[1]
            ) {
              throw new Error(
                "Número de cuenta del recibo con formato incorrecto"
              );
            }
          } else {
            if (saveData.accountNumber.length != lengthLimit) {
              throw new Error(
                "Número de cuenta del recibo con formato incorrecto"
              );
            }
          }
        }

        let data = await this.$http.post(
          `/api/remittance/addRemittanceAccount`,
          saveData
        );
        if (data.returnCode == 2000) {
          if (this.from == "order") {
            this.bindCardAndJump(data.data.id);
          } else {
            this.sendEventTrackData({ leaveBy: 1, page: "completeBank" });
            this.goAppBack();
          }
        }
        this.eventTracker("bank_add_submit_success");
      } catch (error) {
        console.log(error);
        this.eventTracker("bank_add_submit_error");
        this.$toast(error.message);
      } finally {
        this.saving = false;
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-bank {
  padding: 10px 20px;
  padding-bottom: 110px;

  &.from-order {
    .edit-area {
      margin: 24px 0;
      border-radius: 8px;
      padding-bottom: 16px;
    }
  }

  .bank-picker-sheet {
    height: 560px;
  }
  .bank-picker {
    position: absolute;
    bottom: 88px;
    left: 0;
    right: 0;
    top: 0;
  }

  .confirm-data {
    width: 300px;
    background: #ffffff;
    border-radius: 8px;
    header {
      font-size: 16px;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-items: center;
      border-bottom: 4px solid #f6f6f6;
      padding: 0 50px;
      text-align: center;
    }
    .content {
      padding: 24px;
      .label {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 8px;
      }
      .value {
        width: 247px;
        height: 26px;
        box-sizing: border-box;
        background: #f6f6f6;
        border-radius: 13px;
        padding: 4px 16px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 16px;
      }
    }
    .actions {
      margin: 0 16px;
      display: flex;
      justify-content: space-between;
      button {
        width: 159px;
        height: 48px;
        background: #a05bf8;
        border-radius: 25px;
        border: none;
        font-size: 18px;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        &.cancel {
          width: 96px;
          border: 1px solid #999999;
          color: #999;
          background: transparent;
          box-shadow: none;
        }
      }
    }
    .confirm-tips {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #ff4b3f;
      line-height: 18px;
      margin: 20px 16px;
      word-break: break-word;
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 22;
  }

  .pick-value {
    > div {
      font-size: 10px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #a05bf8;
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
          background: linear-gradient(180deg, #ffdc62 0%, #fdb733 100%);
          border-radius: 8px 8px 8px 0px;
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 900;
          color: #333333;
          line-height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: -40%;
          bottom: 0;
          transform: scale(0.9);
          opacity: 0.6;
        }
      }
    }
  }

  .tips {
    background: #f6effe;
    border-radius: 8px;
    margin-top: 24px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    line-height: 18px;
    word-break: break-word;
    padding: 20px;
    header {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 18px;
      margin-bottom: 8px;
    }
  }

  .pop-content {
    .items {
      margin-top: 42px;
      .item {
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-bottom: 36px;
        text-align: center;
        position: relative;
        span {
          position: relative;
        }

        &.active {
          font-weight: bold;
          color: #333333;
          span {
            &::after {
              position: absolute;
              content: " ";
              width: 100%;
              height: 4px;
              background: #a05bf8;
              border-radius: 20px;
              bottom: -2px;
              left: 0;
            }
          }
        }
      }
    }
  }

  .edit-area {
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .line-item {
      font-size: 14px;
      padding-top: 23px;
      &.select-bank {
        position: relative;
        .right {
          position: absolute;
          right: 0px;
          bottom: 18px;
        }
      }
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        .color-red {
          color: #ff4b3f !important;
          font-size: 14px;
        }
      }
      input {
        width: 100%;
        height: 50px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        background: transparent;
      }
    }
  }
}
</style>
