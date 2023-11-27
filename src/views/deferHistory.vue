<template>
  <div class="deferHistory content-area">
    <div v-for="(item, index) in lists" :key="index">
      <div class="head fs-18">Plazo de aplazamiento</div>

      <div class="items">
        <div class="flex-between">
          <span>Fecha de aplicación</span>
          <span>{{ item.approvalDate }}</span>
        </div>

        <div class="flex-between">
          <span>Importe del reembolso</span>
          <span style="color: #fc0f0f">${{ item.amount }}</span>
        </div>

        <div class="flex-between">
          <span>Plazo de aplazamiento</span>
          <span>{{ item.extendedTerm }} días</span>
        </div>

        <div class="flex-between">
          <span>Fecha de vencimiento actualizada</span>
          <span>{{ item.updatedDueDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productId: this.$route.query.productId,
      orderStatus: this.$route.query.orderStatus,
      lists: [{}, {}],
    };
  },

  mounted() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: "Detalles del pedido",
      backCallback: () => {
        this.goAppBack();
      },
    });

    this.getDeferHistory();
  },

  methods: {
    async getDeferHistory() {
      let res = await this.$http.post("/api/extension/history", {
        id: this.$route.query.orderId,
      });
      this.lists = res.data.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.deferHistory {
  padding-top: 14px;
  .head {
    font-size: 16px;
    font-family: Roboto, Roboto;
    font-weight: 900;
    color: #333333;
    line-height: 24px;
    margin: 20px 20px 10px;
  }
  .items {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 16px;

    &:last-child {
      border-bottom: none;
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
