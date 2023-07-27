<template>
  <div class="scroll-area content-area order-list">
    <van-pull-refresh class=" " v-model="loading" success-text=" " loading-text="loading" loosing-text="loading" pulling-text="loading" @refresh="getAllOrders">
      <div>
        <div class="has-order" v-if="orders.length">
          <order-item class="order-item" v-for="item in orders" :key="item.id" :order="item"></order-item>
        </div>
        <div class="no-order" v-else-if="!loading">
          <m-icon class="icon" type="handy/订单空状态" :width="140" :height="107" />
          <button @click="goHome">Apply Now</button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from '@/components/order-item.vue';

export default {
  components: {
    OrderItem,
  },
  data() {
    return {
      loading: false,
      orders: [],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'All orders',
    });
  },
  mounted() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      this.showLoading();
      this.loading = true;
      try {
        let res = await this.$http.post(`/api/order/listAll`);
        this.orders = res.data.list || [];
      } catch (error) {
      } finally {
        this.hideLoading();
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-area {
  height: calc(100vh - 80px);
  overflow: auto !important;
  padding: 0 24px;
}
.order-list {
  .order-item {
    margin: 16px auto;
  }
}

.no-order {
  margin: 0 auto;
  .icon {
    margin: 100px auto 40px;
  }
  button {
    width: 327px;
    height: 50px;
    background: #6515fe;
    // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: #ffffff;
    line-height: 24px;
    border: none;
  }
}
</style>
