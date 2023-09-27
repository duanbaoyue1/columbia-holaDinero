<template>
  <div class="scroll-area content-area">
    <van-pull-refresh
      v-model="loading"
      loading-text="loading"
      loosing-text="Release to refresh"
      pulling-text="Pull down to refresh"
      @refresh="getAllOrders"
    >
      <div>
        <div class="has-order" v-if="orders.length">
          <order-item
            class="order-item"
            v-for="item in orders"
            :key="item.id"
            :order="item"
          ></order-item>
        </div>
        <div class="no-order" v-else-if="!loading">
          <img class="icon" src="@/assets/images/no-order.png" />
          <div class="no-order-title">No Order</div>
          <button @click="goHome">Apply Now</button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from '@/components/orderItem'

export default {
  components: {
    OrderItem
  },
  data() {
    return {
      loading: false,
      orders: []
    }
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      title: 'All orders'
    })
  },
  mounted() {
    this.getAllOrders()
  },
  methods: {
    async getAllOrders() {
      this.showLoading()
      this.loading = true
      try {
        let res = await this.$http.post(`/api/order/listAll`)
        this.orders = res.data.list || []
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

.scroll-area {
  background: #f9f9f9;
  height: calc(100vh - 96px);
  overflow: auto !important;
  padding: 0 24px;
  flex: 1;
}
.order-item {
  margin: 24px auto;
}

.no-order {
  margin: 0 auto;

  .icon {
    width: 140px;
    height: 135px;
    margin: 100px auto 40px;
  }

  .no-order-title {
    font-size: 16px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    text-align: center;
  }

  button {
    width: 327px;
    height: 50px;
    color: $themeFontColor;
    background: $themeColor;
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    line-height: 24px;
    border: none;
    margin-top: 60px;
  }
}
</style>
