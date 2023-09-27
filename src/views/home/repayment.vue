<template>
  <div class="order-list content-area">
    <div v-if="orders.length" class="has-order">
      <order-item
        class="order-item"
        v-for="item in orders"
        :key="item.id"
        :order="item"
      ></order-item>
    </div>
    <div v-else-if="!loading" class="no-order">
      <img class="icon" src="@/assets/images/no-order.png" />
      <button @click="goHome">Apply Now</button>
    </div>
  </div>
</template>

<script>
import orderItem from '@/components/orderItem'

export default {
  components: {
    orderItem
  },
  data() {
    return {
      loading: true,
      orders: []
    }
  },
  created() {
    this.setTabBar({
      show: false,
      transparent: false,
      fixed: true,
      title: ''
    })
  },
  activated() {
    this.getAllOrders()
  },
  methods: {
    async getAllOrders() {
      this.showLoading()
      try {
        let res = await this.$http.post(`/api/order/unRepaymentOrderList`)
        this.orders = res.data.list || []
        this.setRepaymentNum(this.orders.length)
      } catch (error) {
      } finally {
        this.hideLoading()
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.order-list {
  padding: 0 24px;
  padding-bottom: 100px;
  padding-top: 75px;

  .order-item {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.no-order {
  margin: 0 auto;
  .icon {
    width: 140px;
    height: 135px;
    margin: 100px auto 40px;
  }

  button {
    width: 327px;
    height: 50px;
    background: $themeColor;
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: $themeFontColor;
    line-height: 24px;
    border: none;
  }
}
</style>
