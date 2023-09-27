<template>
  <div class="margin-top-20" v-if="loans.length">
    <div class="res-total">
      <div class="title">
        You have successfully applied for
        <span class="color-theme text-decoration">{{ loans.length }}</span>
        products
        <div class="tips">The audit result is expected within 5 minutes</div>
      </div>
    </div>

    <div class="item-frame column-direction">
      <div class="loan-item" v-for="(loan, index) in loans" :key="loan.id">
        <div class="row-space-between-center" style="width: 100%">
          <div class="row-flex">
            <img class="icon" :src="loan.productIconImageUrl" />
            <div>
              <div class="name">{{ loan.productName }}</div>
              <div class="value">
                Loan Amount：
                <span
                  ><span class="symbol">₹</span
                  >{{ loan.approvalAmount | thousands }}</span
                >
              </div>
            </div>
          </div>

          <div
            class="action"
            :class="'order_' + loan.orderStatus"
            @click="goDetail(loan.orderNo)"
          >
            {{ loan.orderStatusStr }}
          </div>
        </div>
        <div v-if="loans.length != index + 1" class="line" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['systemTime'],
  data() {
    return {
      loans: []
    }
  },
  created() {
    this.getRes()
  },
  computed: {
    orderStatusText() {
      return (status) => {
        switch (status) {
          case 20:
            return 'Reviewing'
          case 21:
            return 'Reviewing'
          case 30:
            return 'Disbursing'
          case 40:
            return 'Rejected'
          case 70:
            return 'Disbursing'
          case 80:
            return 'Pending Repayment'
          case 90:
            return 'Overdue'
          case 100:
            return 'Repayment Successful'
          case 101:
            return 'Repayment Successful'
          default:
            return 'Reviewing'
        }
      }
    }
  },
  methods: {
    async getRes() {
      try {
        let res = await this.$http.post(`/api/order/applyResultOrderList`, {
          startApplyTime: this.systemTime
        })
        this.loans = res.data.list || []
      } catch (e) {}
    },

    goDetail(orderNo) {
      this.innerJump('orderDetail', { orderId: orderNo })
    }
  }
}
</script>

<style lang="scss" scoped>
.res-total {
  width: 327px;
  text-align: center;
  background-image: url('@/assets/images/congratulations.png');
  background-size: 327px 72px;
  background-repeat: no-repeat;
  background-attachment: local;
  margin: 0 auto;
  padding: 14px 0;

  .title {
    font-size: 14px;
    line-height: 24px;
    font-weight: 900;
    color: #333333;
  }
  .tips {
    font-size: 12px;
    font-weight: 400;
    color: #333;
    line-height: 16px;
    margin-top: 4px;
  }
}

.line {
  height: 1px;
  background: #e9e9e9;
  margin-top: 20px;
}

.item-frame {
  width: 327px;
  background: #ffffff;
  box-sizing: border-box;
  padding: 0 20px 20px;
  margin: 20px auto 0;

  .loan-item {
    margin-top: 20px;

    .name {
      font-size: 14px;
      font-weight: 900;
      color: #333333;
      line-height: 18px;
    }
    .value {
      font-size: 10px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;

      .symbol {
        font-size: 12px;
        font-family: Helvetica-Bold, Helvetica;
        font-weight: bold;
        color: #333333;
        line-height: 14px;
        margin-right: 2px;
      }

      span {
        font-size: 16px;
        font-weight: bold;
        font-family: DINAlternate-Bold, DINAlternate;
        color: #333333;
        line-height: 20px;
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 10px;
    }

    .action {
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
      color: #ffffff;
      font-family: Roboto-Medium, Roboto;
      background: #f125a8;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;

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
