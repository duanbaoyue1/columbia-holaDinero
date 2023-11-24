<template>
  <div class="res-loans-model column-direction">
    <div class="res-total">
      <div class="head">Enhorabuena</div>
      <div class="head-frame">
        <div>Ha solicitado {{ loans.length }} productos con éxito.</div>
        <div class="tips">Revise los resultados en 5 minutos</div>
      </div>
    </div>

    <div v-for="loan in loans" :key="loan.id" class="loan-item">
      <img class="icon" :src="loan.productIconImageUrl" />
      <div class="info">
        <div class="name">{{ loan.productName }}</div>
        <div class="value">
          Monto del préstamo($):
          <span>{{ loan.approvalAmount }}</span>
        </div>

        <div
          class="action"
          :class="'order_' + loan.orderStatus"
          @click="goDetail(loan.orderNo)"
        >
          {{ loan.orderStatusStr }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["systemTime", "loans"],

  methods: {
    goDetail(orderNo) {
      this.innerJump("orderDetail", { orderId: orderNo });
    },
  },
};
</script>

<style lang="scss" scoped>
.res-loans-model {
  margin-top: 32px;
  padding-bottom: 20px;

  .cc {
    width: 280px;
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
  }
  .res-total {
    width: 335px;
    border-radius: 8px;
    font-size: 14px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 18px;
    text-align: center;
    margin: 0 auto 10px;

    .head {
      font-size: 20px;
      font-family: Roboto, Roboto;
      font-weight: 900;
      color: #a05bf8;
      line-height: 24px;
      position: relative;
      &::before {
        content: " ";
        position: absolute;
        width: 24px;
        height: 2px;
        background: #a05bf8;
        top: 12px;
        left: 57px;
      }
      &::after {
        content: " ";
        position: absolute;
        width: 24px;
        height: 2px;
        background: #a05bf8;
        top: 12px;
        right: 57px;
      }
    }
    .head-frame {
      height: 60px;
      font-size: 16px;
      color: #333333;
      font-family: Roboto, Roboto;
      background: #f6effe;
      border-radius: 8px;
      padding: 10px 20px;
      box-sizing: border-box;
      margin-top: 10px;
    }

    .tips {
      font-size: 12px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      line-height: 12px;
      transform: scale(0.9);
      margin-top: 8px;
    }
  }

  .loan-item {
    width: 335px;
    background: #ffffff;
    border-radius: 8px;
    height: 72px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    margin: 10px auto 0;
    padding: 16px 8px;

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
      right: 8px;
      top: 22px;
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
      height: 22px;
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
