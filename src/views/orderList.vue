<template>
  <div class="scroll-area content-area order-list">
    <van-pull-refresh
      class=" "
      v-model="loading"
      success-text=" "
      loading-text=" "
      loosing-text=" "
      pulling-text=" "
      @refresh="getAllOrders"
    >
      <div>
        <div class="has-order" v-if="orders.length">
          <order-item
            v-for="item in orders"
            class="order-item"
            :key="item.id"
            :order="item"
          />
        </div>
        <div class="no-order" v-else-if="!loading">
          <m-icon class="icon" type="no-order" :width="168" :height="97" />
          <div>Ningún pedido de préstamo</div>
          <button @click="cleanAllPageToHome">Aplicar ahora</button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from "@/components/orderItem";

export default {
  components: {
    OrderItem,
  },
  data() {
    return {
      fromType: this.$route.query.fromType,
      loading: false,
      orders: [],
    };
  },
  mounted() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Pedido de préstamo",
      backCallback: () => {
        if (this.fromType) {
          this.toAppMethod("finishThisPage");
        } else {
          this.goAppBack();
        }
        this.sendEventTrackData({});
      },
    });

    this.setEventTrackStartTime();
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
  padding: 0 20px;
}
.order-list {
  .order-item {
    margin: 16px auto;
  }
}

.no-order {
  border-radius: 16px;
  background: #fff;
  margin: 40px auto 0;
  padding: 60px 20px 20px;
  .icon {
    margin: 0 auto;
  }
  div {
    font-size: 12px;
    font-family: Roboto-Regular, Roboto;
    text-align: center;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
  }
  button {
    width: 295px;
    height: 48px;
    background: #a05bf8;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: #ffffff;
    line-height: 24px;
    border: none;
    margin: 40px auto 0;
  }
}
</style>
