<template>
  <div class="multi-recommend">
    <div class="order-items">
      <div
        class="order-item"
        v-for="(order, index) in list"
        :key="order.id"
        @click="checkLoan(index)"
      >
        <div class="reloan" v-if="order.isReloan">Reloan</div>
        <div class="row-space-between">
          <div></div>
          <div class="column-direction-center">
            <img class="product-img" :src="order.productImgUrl" />
            <div class="product-name">{{ order.productName }}</div>
          </div>
          <img
            class="icon"
            :src="
              order.unChecked
                ? require('@/assets/images/unselected.png')
                : require('@/assets/images/selected.png')
            "
          />
        </div>

        <div class="margin-top-20 row-space-between">
          <div class="column-direction-center display-flex-1">
            <span class="title">Max amount（₹）</span>
            <span class="label">
              {{ order.minAmount }}
            </span>
          </div>
          <div class="column-direction-center display-flex-1">
            <span class="title">Interest</span>
            <span class="label">{{ order.interest }}% / Day</span>
          </div>
        </div>
      </div>
    </div>

    <div class="select-all" @click="selectAll">
      <button>Select all</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    checkLoan(index) {
      this.$set(this.list, index, {
        ...this.list[index],
        unChecked: !this.list[index].unChecked
      })
      this.updateHome()
    },

    selectAll() {
      for (let index = 0; index < this.list.length; index++) {
        this.$set(this.list, index, { ...this.list[index], unChecked: false })
      }
      this.updateHome()
    },

    updateHome() {
      this.$emit(
        'update',
        this.list.filter((t) => !t.unChecked)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.multi-recommend {
  width: 375px;
  background: #f9f9f9;
  box-sizing: border-box;
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-bottom: 88px;

  .select-all {
    width: 375px;
    height: 88px;
    background: #ffffff;
    box-shadow: 0px -2px 16px 0px rgba(0, 0, 0, 0.08);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      width: 327px;
      height: 48px;
      background: $themeColor;
      border-radius: 24px;
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: $themeFontColor;
      line-height: 24px;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    }
  }

  .order-items {
    height: 100%;
    overflow-y: scroll;

    .order-item {
      position: relative;
      padding: 20px;
      margin: 16px 20px;
      background: #fff;
      border-radius: 14px;

      &:not(:first-child) {
        margin-top: 25px;
      }

      .product-img {
        width: 30px;
        height: 30px;
      }

      .product-name {
        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
        line-height: 20px;
      }

      .title {
        font-size: 10px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }

      .label {
        font-size: 16px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 18px;
        margin-top: 8px;
      }

      .reloan {
        width: 90px;
        height: 28px;
        color: #fff;
        font-size: 12px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        line-height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url('@/assets/images/order-reloan.png');
        background-size: 90px 28px;
        background-repeat: no-repeat;
        background-attachment: local;
        position: absolute;
        top: -6px;
        left: 0;
      }
      .icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
