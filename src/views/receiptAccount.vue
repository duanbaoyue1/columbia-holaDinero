<template>
  <div class="complete-bank content-area">
    <div class="cards" v-if="cards.length">
      <div
        v-for="card in cards"
        class="cards-item"
        :key="card.id"
        @click="chooseBank(card)"
      >
        <div class="row-direction margin-left-30">
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
    </div>

    <div v-else>
      <img class="no-bank-icon" src="@/assets/images/no-order.png" />
    </div>

    <div class="add-card row-center" @click="goAddCard">
      <img src="@/assets/images/information/add.png" />
      Add New Accounts
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canSubmit: false, // 是否可以提交
      cards: [],
      chooseBankId: ''
    }
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Receipt Account'
    })
  },
  mounted() {
    this.getBanks()
  },
  watch: {
    chooseBankId: {
      handler() {
        this.canSubmit = !!this.chooseBankId
      },
      deep: true
    }
  },
  methods: {
    goAddCard() {
      this.eventTracker('bank_add')
      this.innerJump('addBank', { type: 'mine' }, true)
    },
    async getBanks() {
      try {
        let data = await this.$http.post(
          '/api/remittance/remittanceAccountList'
        )
        this.cards = data.data.list
        this.chooseBankId = this.cards[0]?.id
      } catch (error) {
        console.log(error)
      }
    },
    chooseBank(bank) {
      this.chooseBankId = bank.id
    },
    async submit() {
      this.showLoading()
      try {
        // 从个人中心进来，则是修改默认卡
        await this.$http.post(`/api/remittance/modifyLoanCard`, {
          remittanceAccountId: this.chooseBankId
        })
        this.hideLoading()
        this.goAppBack()
      } catch (error) {
        this.$toast(error.message)
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 20px 24px;
  padding-bottom: 110px;
  background: #f9f9f9;
  box-sizing: border-box;

  .no-bank-icon {
    display: block;
    width: 120px;
    margin: 80px auto 0;
  }

  .cards {
    background: #fff;
    border-radius: 8px;
    margin-top: 24px;

    &-item {
      height: 70px;
      box-sizing: border-box;
      border-radius: 14px 14px 0px 0px;
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      line-height: 18px;
      justify-content: space-between;
      background-size: 30px 30px;
      background-repeat: no-repeat;
      background-position: 20px 20px;
      padding: 0 20px;
      background-image: url('@/assets/images/information/bank.png');

      &:not(:last-child) {
        border-bottom: 1px solid #e4e4e4;
      }
    }
  }
  .add-card {
    width: 240px;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0 auto;
    background: #fd973f;
    border-radius: 20px;
    margin-top: 60px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 10px;
    }
  }
  .bank {
    margin-right: 10px;
  }

  .name {
    max-width: 160px;
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

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
  }
}
</style>
