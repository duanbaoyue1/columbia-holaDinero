<template>
  <div class="complete-bank content-area">
    <div class="cards">
      <div class="cards-list">
        <div
          v-for="card in cards"
          class="cards-item"
          :style="{
            background: card.id === chooseBankId ? '#F6EFFE' : '#fff',
            border:
              card.id === chooseBankId
                ? '2px solid #A05BF8'
                : '1px solid #A05BF8',
          }"
          :key="card.id"
          @click="checkedClick(card)"
        >
          <div class="card-name">
            <div class="row-flex">
              <m-icon
                style="margin-right: 10px"
                type="bank-icon"
                :width="24"
                :height="24"
              />
              <div class="name">{{ card.bank }}</div>
              <div class="name" style="margin-left: 5px">
                ({{ card.accountNumber.slice(-4) }})
              </div>
            </div>
            <m-icon
              class="choose"
              :class="{ active: chooseBankId == card.id }"
              :type="chooseBankId == card.id ? 'selected' : 'not-selected'"
              :width="24"
              :height="24"
            />
          </div>
          <div class="default-tips" v-if="chooseBankId == card.id">
            Tarjeta bancaria por defecto
          </div>
        </div>
      </div>
      <div class="add-card" @click="goAddCard">Agregar un nuevo método</div>
    </div>

    <div class="actions">
      <button class="btn-default" @click="chooseBank">Enviar</button>
    </div>
  </div>
</template>

<script>
import * as ALL_ATTRS from "@/utils/constants";
import CompleteStep from "@/components/completeStep.vue";

export default {
  components: {
    CompleteStep,
  },

  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      cards: [],
      from: this.$route.query.from,
      orderId: this.$route.query.orderId,
      chooseBankId: null,
      saving: false,
      editData: {
        friendName: "",
        friendPhone: "",
        familyName: "",
        familyPhone: "",
      },
    };
  },
  watch: {
    chooseBankId: {
      handler() {
        this.canSubmit = !!this.chooseBankId;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Tarjeta bancaria",
      backCallback: null,
    });
  },
  mounted() {
    this.getBanks();
    if (this.from != "mine") {
      this.eventTracker("bank_access");
    }
  },

  methods: {
    checkedClick(item) {
      this.chooseBankId = item.id;
    },
    goAddCard() {
      this.eventTracker("bank_add");
      this.innerJump("addBank", this.$route.query);
    },
    async getBanks() {
      let data = await this.$http.post("/api/remittance/remittanceAccountList");
      this.cards = data.data.list;
      this.chooseBankId = this.cards[0].id;
    },
    async chooseBank() {
      this.showLoading();
      try {
        // 从个人中心进来，则是修改默认卡
        await this.$http.post(`/api/remittance/modifyLoanCard`, {
          remittanceAccountId: this.chooseBankId,
        });
        this.hideLoading();
        this.eventTracker("bank_submit_success");
        this.$toast("Vinculación de la tarjeta bancaria con éxito");
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    async submit() {},
  },
};
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 20px;
  box-sizing: border-box;

  .cards {
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 16px 0 24px;
    border-radius: 8px;
    .none {
      margin: 44px auto 40px;
    }
    .add-card {
      width: 255px;
      height: 36px;
      font-size: 14px;
      font-weight: 500;
      color: #f95502;
      line-height: 22px;
      border-radius: 18px;
      border: 1px solid #f95502;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cards-list {
      padding-bottom: 40px;
    }

    &-item {
      background: #fff;
      border-radius: 8px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      margin-bottom: 20px;

      .name {
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #3b3735;
        line-height: 20px;
        margin-top: 2px;
      }

      .choose {
        &.active {
          background: #fff;
          border-radius: 100%;
        }
      }
      .default-tips {
        width: 170px;
        font-size: 12px;
        font-family: Roboto, Roboto;
        font-weight: 900;
        color: #333333;
        background: linear-gradient(180deg, #ffdc62 0%, #fdb733 100%);
        border-radius: 100px 0px 0px 100px;
        padding: 7px 8px;
        margin-top: 15px;
        position: relative;
        right: -127px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .bank {
        margin-right: 10px;
      }
      .card-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .bottom {
        position: absolute;
        width: 320px;
        height: 6px;
        border: 2px solid #000000;
        bottom: -6px;
        left: -10px;
        border-radius: 10px;
        z-index: -1;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f6f6f6;
  }
  .step {
    margin-top: 25px;
    margin-bottom: 30px;
    font-size: 10px;
    font-weight: 400;
    color: #87a0d1;
    line-height: 18px;
    display: flex;
    align-items: end;
    .icon {
      margin-right: 6px;
    }
    span {
      transform: scale(0.9);
    }
  }

  .head-top {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 26px;
    margin-bottom: 10px;
  }
}

.actions {
  position: fixed;
  padding-bottom: 20px;
  bottom: 0;
  left: 0;
  right: 0;

  .btn-default {
    width: 335px;
    background: #a05bf8;
    border-radius: 24px;
    height: 48px;
    border: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 16px;
    margin-left: 20px;
  }
}

.row-flex {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
</style>
