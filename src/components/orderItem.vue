<template>
  <div class="order-item">
    <div class="status" :class="'status-' + order.orderStatus">
      {{ statusText }}
    </div>
    <div class="info column-direction">
      <div class="column-direction-center">
        <img :src="order.productIconImageUrl" />
        <div class="product-name">{{ order.productName }}</div>
      </div>
      <span
        class="repaid"
        v-if="[80, 90].includes(order.orderStatus)"
        @click="goFillUtr"
        >Repaid?</span
      >
    </div>
    <div class="row-space-between margin-top-20">
      <div class="column-direction-center">
        <span class="title">{{ dataValue.amountText }}</span>
        <span class="number">
          <span class="label2">₹</span>{{ dataValue.amountValue }}</span
        >
      </div>
      <div class="column-direction-center">
        <span class="title">{{ dataValue.dateText }}</span>
        <span class="number">{{ dataValue.dateValue }}</span>
      </div>
      <div class="flex-end column-direction">
        <button
          class="action-btn"
          :class="'action-btn-' + order.orderStatus"
          @click="goDetail"
        >
          {{ order.orderStatusStr }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dataValue() {
      if ([80, 90].includes(this.order.orderStatus)) {
        return {
          dateValue: this.order.repaymentTime,
          amountValue: this.order.repaymentAmount,
          amountText: "Repayable Amount",
          dateText: "Due Date",
        };
      } else {
        return {
          dateValue: this.order.applyTime,
          amountValue: this.order.approvalAmount,
          amountText: "Loan Amount",
          dateText: "Apply Date",
        };
      }
    },
    statusText() {
      switch (this.order.orderStatus) {
        case 10:
          return "Pending to apply";
        case 20:
          return "Reviewing";
        case 21:
          return "Reviewing";
        case 30:
          return "Disbursing";
        case 40:
          return "Rejected";
        case 70:
          return "Disbursing";
        case 80:
          return "Repaying";
        case 90:
          return "Overdue";
        case 100:
          return "Done";
        case 101:
          return "Done";
        default:
          return "Reviewing";
      }
    },
  },
  methods: {
    goFillUtr() {
      this.innerJump("utr", { orderId: this.order.orderNo, type: "repay" });
    },
    goDetail() {
      if ([10, 100, 101, 100].includes(this.order.orderStatus)) {
        this.goHome();
      } else {
        this.innerJump("orderDetail", { orderId: this.order.orderNo });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-item {
  width: 327px;
  background: #ffffff;
  border-radius: 16px;
  margin: 0 auto;
  padding: 16px 16px 14px;
  box-sizing: border-box;
  position: relative;

  .action-btn {
    min-width: 78px;
    height: 32px;
    font-size: 12px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
    background: #ffbc41;
    border-radius: 16px;
    border: none;

    &-10 {
      background: #ffbc41;
    }
    &-20,
    &-21 {
      background: #f125a8;
    }
    &-40 {
      background: #ff1412;
    }
    &-30,
    &-70 {
      background: #3e56fe;
    }
    &-80,
    &-90 {
      background: #f15a25;
    }
    &-100,
    &-101 {
      background: #04ca1c;
    }
  }
  .status {
    width: 90px;
    height: 28px;
    font-size: 10px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #fff;
    background-image: url("@/assets/images/order-reloan.png");
    background-size: 90px 28px;
    background-repeat: no-repeat;
    box-sizing: border-box;
    background-attachment: local;
    position: absolute;
    top: -6px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    &-10 {
      width: 120px;
      background-size: 120px 28px;
      background-image: url("@/assets/images/order-pending-to-apply.png");
    }
    &-20,
    &-21 {
      background-image: url("@/assets/images/order-reviewing.png");
    }
    &-30,
    &-70 {
      background-image: url("@/assets/images/order-disbursing.png");
    }
    &-40 {
      background-image: url("@/assets/images/order-rejected.png");
    }
    &-80 {
      background-image: url("@/assets/images/order-repaying.png");
    }
    &-90 {
      background-image: url("@/assets/images/order-overdue.png");
    }
    &-100,
    &-101 {
      width: 58px;
      background-size: 58px 28px;
      background-image: url("@/assets/images/order-done.png");
    }
  }

  .title {
    font-size: 10px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
  }

  .number {
    font-size: 16px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 18px;
    margin-top: 8px;
  }

  .label2 {
    font-size: 12px;
    font-family: Helvetica-Bold, Helvetica;
    font-weight: bold;
    color: #333333;
    line-height: 12px;
  }

  .info {
    display: flex;
    padding-bottom: 16px;

    img {
      width: 50px;
      height: 50px;
      display: block;
    }
    .product-name {
      font-size: 14px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 18px;
      margin-top: 2px;
    }

    .repaid {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 10px;
      font-weight: 500;
      color: #ff4b3f;
      line-height: 12px;
      text-decoration: underline;
    }
  }
}
</style>
