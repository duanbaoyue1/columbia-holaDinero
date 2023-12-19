<template>
  <div class="multi-recommend">
    <div class="order-items">
      <div
        class="order-item"
        :class="{ active: !order.unChecked }"
        v-for="(order, index) in list"
        :key="order.id"
        @click="checkLoan(index)"
      >
        <div class="status row-space-between-center">
          <div class="row-flex">
            <img class="product-img" :src="order.productImgUrl" />
            <div class="product-name">{{ order.productName }}</div>
            <div class="reloan" v-if="order.isReloan">Volver a prestar</div>
          </div>
          <div>
            <m-icon
              class="icon"
              :type="order.unChecked ? 'not-selected' : 'selected'"
              :width="24"
              :height="24"
            />
          </div>
        </div>
        <div class="row-space-between-center">
          <div class="info-frame">
            <span class="label">Monto del préstamo ($)</span>
            <span class="amount">{{ order.minAmount | formatMonet }}</span>
          </div>
          <div class="info-frame">
            <span class="label">Tasa de interés</span>
            <span class="amount">{{ order.interest }}% / Día</span>
          </div>
        </div>
      </div>
    </div>

    <div class="select-all" @click="selectAll">
      <button>Seleccionar todo</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
  methods: {
    checkLoan(index) {
      let checkedNums = this.list.filter((t) => !t.unChecked).length;
      if (checkedNums == 1 && !this.list[index].unChecked) return;
      this.$set(this.list, index, {
        ...this.list[index],
        unChecked: !this.list[index].unChecked,
      });
      this.updateHome();
    },

    selectAll() {
      for (let index = 0; index < this.list.length; index++) {
        this.$set(this.list, index, { ...this.list[index], unChecked: false });
      }
      this.updateHome();
    },

    updateHome() {
      this.$emit(
        "update",
        this.list.filter((t) => !t.unChecked)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-recommend {
  width: 375px;
  background: #f6f6f6;
  box-sizing: border-box;
  position: absolute;
  top: 52px;
  left: 0;
  font-family: Helvetica-Bold, Helvetica;
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
      background: #a05bf8;
      border-radius: 24px;
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    }
  }

  .info-frame {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20px;

    .label {
      font-size: 10px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 12px;
      margin-right: 8px;
    }

    .amount {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
      margin-top: 10px;
    }
  }

  .order-items {
    height: 100%;
    overflow-y: scroll;
    .order-item {
      position: relative;
      padding: 16px;
      margin: 16px 24px;
      background: #fff;
      border-radius: 16px;
      &.active {
        background: #f6effe;
        border: 1px solid #a05bf8;
      }

      .status {
        display: flex;

        .product-img {
          display: block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        .product-name {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 900;
          color: #000;
          line-height: 18px;
        }

        .reloan {
          height: 16px;
          border-radius: 8px;
          border: 1px solid #ffbd5c;
          font-size: 10px;
          font-weight: 500;
          color: #ffbd5c;
          line-height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 4px;
          padding-right: 4px;
          margin: 2px 0 0 10px;
        }
      }

      .info {
        display: flex;

        .name {
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 500;
          color: #000;
          line-height: 20px;

          > div {
            &:first-child {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}

.row-flex {
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}

.row-space-between-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
