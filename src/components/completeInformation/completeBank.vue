<template>
  <div class="complete-bank">
    <div
      v-for="card in cards"
      class="cards-item"
      :key="card.id"
      @click="chooseBank(card)"
    >
      <div class="row-direction margin-left-40">
        <div class="name">{{ card.bank }}</div>
        <div class="number margin-left-10" v-if="card.accountNumber">
          ({{ card.accountNumber.slice(-4) }})
        </div>
      </div>
      <img
        class="choose"
        :src="
          chooseBankId == card.id
            ? require('@/assets/images/selected.png')
            : require('@/assets/images/unselected.png')
        "
      />
    </div>
    <div class="add-card row-center" @click="goAddCard">
      <img src="@/assets/images/information/add.png" />
      Add New Accounts
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [],
      chooseBankId: ""
    };
  },
  mounted() {
    this.getBanks();
    this.eventTracker("bank_access");
  },
  methods: {
    goAddCard() {
      this.eventTracker("bank_add");
      this.$emit("goToAddBankClick");
    },
    async getBanks() {
      try {
        let data = await this.$http.post(
          "/api/remittance/remittanceAccountList"
        );
        this.cards = data.data.list;
        this.chooseBankId = this.cards[0]?.id;
        this.emit();
      } catch (error) {
        console.log(error);
      }
    },
    chooseBank(bank) {
      this.chooseBankId = bank.id;
      this.emit();
    },
    emit() {
      this.$emit("chooseBankIdEmit", this.chooseBankId);
    }
  }
};
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 30px 20px;

  .add-card {
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    line-height: 22px;
    padding: 0 28px;
    background: #fd973f;
    border-radius: 20px;

    img {
      width: 14px;
      height: 14px;
      margin: -2px 10px 0 0;
    }
  }

  .cards-item {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    justify-content: space-between;
    position: relative;
    background-size: 30px 30px;
    background-repeat: no-repeat;
    height: 30px;
    background-image: url("@/assets/images/information/bank.png");

    .bank {
      margin-right: 10px;
    }

    .name {
      max-width: 150px;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      line-height: 18px;
      font-family: Roboto-Regular, Roboto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .number {
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      line-height: 18px;
      font-family: Roboto-Regular, Roboto;
    }

    .choose {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
