<template>
  <div class="res-loans-model" v-if="loans.length">
    <!-- <img class="cc" :src="require('@/assets/img/loan/congratinations.png')" /> -->
    <div class="res-total">
      <div class="row-flex">
        <div class="line" />
        <div class="congratulations">Congratulations</div>
        <div class="line" />
      </div>
      <div class="title">
        You have successfully applied for
        {{ this.loans.length }}
        products
        <div class="tips">The audit result is expected within 5 minutes</div>
      </div>
    </div>

    <div v-for="loan in loans" :key="loan.id" class="loan-item">
      <img class="icon" :src="loan.productIconImageUrl" />
      <div class="info">
        <div class="name">{{ loan.productName }}</div>
        <div class="value">
          Loan Amount (₹):
          <span>{{ loan.approvalAmount }}</span>
        </div>

        <div class="action" :class="'order_' + loan.orderStatus" @click="goDetail(loan.orderNo)">{{ loan.orderStatusStr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['systemTime'],

  computed: {
    orderStatusText() {
      return status => {
        switch (status) {
          case 20:
            return 'Reviewing';
          case 21:
            return 'Reviewing';
          case 30:
            return 'Disbursing';
          case 40:
            return 'Rejected';
          case 70:
            return 'Disbursing';
          case 80:
            return 'Pending Repayment';
          case 90:
            return 'Overdue';
          case 100:
            return 'Repayment Successful';
          case 101:
            return 'Repayment Successful';
          default:
            return 'Reviewing';
        }
      };
    },
  },

  data() {
    return {
      loans: [],
    };
  },

  created() {
    this.getRes();
  },

  methods: {
    async getRes() {
      try {
        let res = await this.$http.post(`/api/order/applyResultOrderList`, {
          startApplyTime: this.systemTime,
        });
        this.loans = res.data.list || [];
      } catch (e) {}
    },

    goDetail(orderNo) {
      this.innerJump('order-detail', { orderId: orderNo });
    },
  },
};
</script>

<style lang="scss" scoped>
.row-flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 8px;
}
.res-loans-model {
  margin-top: 32px;
  .cc {
    width: 280px;
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
  }
  .res-total {
    width: 320px;
    background: #f7f3ff;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 16px 0px;
    margin: 0 auto;
    text-align: center;
    position: relative;

    .line {
      width: 24px;
      height: 3px;
      background: #fc2214;
      margin: 10px;
    }

    .congratulations {
      font-size: 20px;
      color: #fc2214;
      font-weight: 900;
      line-height: 24px;
    }

    .title {
      font-size: 14px;
      line-height: 14px;
      font-weight: bold;
      color: #333333;
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      color: #333;
      line-height: 12px;
      margin-top: 9px;
    }
  }

  .loan-item {
    width: 320px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 14px;
    border: 2px solid #cccccc;
    padding: 16px;
    height: 72px;
    box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    .info {
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        margin-bottom: 8px;
      }
      .value {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        span {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
        }
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 10px;
    }

    .action {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 900;
      color: #ffffff;
      min-width: 80px;
      box-sizing: border-box;
      padding: 0 10px;
      height: 30px;
      background: #f125a8;
      border-radius: 14px;

      &.order_10 {
        background: #ffbc41;
      }
      &.order_20,
      &.order_21,
      &.order_30 {
        background: #f125a8;
      }
      &.order_40 {
        background: #ff1412;
      }
      &.order_70 {
        background: #3e56fe;
      }
      &.order_80,
      &.order_90 {
        background: #f15a25;
      }
      &.order_100,
      &.order_101 {
        background: #04ca1c;
      }
    }
  }
}
</style>
