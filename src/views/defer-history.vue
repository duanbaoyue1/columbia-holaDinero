<template>
  <div class="defer-history content-area">
    <div class="items" v-for="(item, index) in lists" :key="index">
      <div class="head fs-18">Deferment {{ index + 1 }}</div>
      <div class="flex-between">
        <span>Deferment term</span>
        <span>{{ item.extendedTerm }} days</span>
      </div>

      <div class="flex-between">
        <span>Application date</span>
        <span>{{ item.approvalDate }}</span>
      </div>

      <div class="flex-between">
        <span>Updated due date</span>
        <span>{{ item.updatedDueDate }}</span>
      </div>

      <div class="flex-between">
        <span>Repayment amount</span>
        <span>₹ {{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Deferment',
    });
  },
  
  data() {
    return {
      lists: [],
    };
  },

  mounted() {
    this.getDeferHistory();
  },

  methods: {
    async getDeferHistory() {
      let res = await this.$http.post('/api/extension/history', {
        id: this.$route.query.orderId,
      });
      this.lists = res.data.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-history {
  padding-top: 14px;
  .items {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    margin-left: 24px;
    margin-right: 24px;
    margin-bottom: 16px;

    &:last-child {
      border-bottom: none;
    }
    .head {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
    }
    > div {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
