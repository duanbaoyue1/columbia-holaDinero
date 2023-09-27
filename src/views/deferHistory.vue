<template>
  <div class="defer-history content-area">
    <div class="items" v-for="(item, index) in lists" :key="index">
      <div class="head">Deferment {{ index + 1 }}</div>
      <div class="row-space-between-center">
        <span class="title">Deferment term</span>
        <span class="number">{{ item.extendedTerm }} days</span>
      </div>

      <div class="row-space-between-center">
        <span class="title">Application date</span>
        <span class="number">{{ item.approvalDate }}</span>
      </div>

      <div class="row-space-between-center">
        <span class="title">Updated due date</span>
        <span class="number">{{ item.updatedDueDate }}</span>
      </div>

      <div class="row-space-between-center">
        <span class="title">Repayment amount</span>
        <span class="number">₹ {{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: []
    }
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Deferment'
    })
  },
  mounted() {
    this.getDeferHistory()
  },
  methods: {
    async getDeferHistory() {
      try {
        let res = await this.$http.post('/api/extension/history', {
          id: this.$route.query.orderId
        })
        this.lists = res.data.list
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.defer-history {
  padding-top: 14px;

  .items {
    padding: 20px;
    background: #ffffff;
    border-radius: 14px;
    margin: 0 20px 16px;

    .title {
      font-size: 14px;
      font-weight: 400;
      color: #999;
      line-height: 18px;
    }
    .number {
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
    }

    .head {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
    }
    > div {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
