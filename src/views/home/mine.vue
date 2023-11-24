<template>
  <div class="mine content-area display-flex-1">
    <div class="frame">
      <div class="user">
        <img :src="require('@/assets/images/head-sculpture.png')" />
        <span class="name">{{
          userInfo.mobile || "123123123" | phoneHideFilter
        }}</span>
      </div>

      <div
        class="menu row-space-between-center"
        @click="innerJump('orderList')"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="all-order" :width="30" :height="30" />
          Pedido de préstamo
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div
        class="menu row-space-between-center"
        @click="innerJump('helpCenter')"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="help-center" :width="30" :height="30" />
          Centro de ayuda
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div
        class="menu row-space-between-center"
        v-if="!userInfo.remittanceAccountAuth"
        @click="innerJump('completeBank', { from: 'mine' })"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="bank-card" :width="30" :height="30" />
          Tarjeta bancaria
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div class="menu row-space-between-center" @click="innerJump('settings')">
        <div class="title row-direction">
          <m-icon class="icon" type="set-up" :width="30" :height="30" />
          Configuración
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div
        class="menu row-space-between-center"
        @click="showDeleteConfirm"
        v-if="!isTestAccount"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="delete" :width="30" :height="30" />
          Eliminar cuenta
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <van-overlay :show="showLogOut" @click="showLogOut = false">
        <div class="logout" @click.stop>
          <img :src="require('@/assets/img/creditomax/个人中心推出弹窗.png')" />
          <div class="content">
            <div>¿Está seguro de cerrar sesión?</div>
            <button @click="logout">Cancelar</button>
          </div>
        </div>
      </van-overlay>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLogOut: false,
      isTestAccount: false, // 是否google测试账号
    };
  },
  async mounted() {
    this.setTabBar({
      show: false,
    });
    try {
      let data = await this.$http.post(`/api/user/mine`);
      this.isTestAccount = data.data.isTestAccount;
    } catch (error) {
      console.log(error);
    }
  },
  activated() {
    this.updateData();
  },
  methods: {
    showDeleteConfirm() {
      this.showMessageBox({
        content:
          "Después de eliminar la cuenta, se borrará toda la información de la cuenta, ¿confirmar para eliminar?",
        confirmBtnText: "Déjame pensar de nuevo",
        cancelBtnText: "Confirmar eliminación",
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.toAppMethod("toGoSign");
        },
        iconPath: "delete-account",
      });
    },
    async updateData() {
      this.showLoading();
      try {
        await this.getUserInfo();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    goTestb() {
      this.innerJump("testb");
    },
    goDetail() {
      this.innerJump("orderDetail");
    },
  },
};
</script>

<style lang="scss" scoped>
.mine {
  height: 100vh;
  background: #f6effe;
}
.frame {
  background-image: url(@/assets/images/mine.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 230px;
}

.menu {
  width: 335px;
  background: #ffffff;
  border-radius: 16px;
  box-sizing: border-box;
  margin: 8px auto 0;
  padding: 16px 20px;

  .title {
    font-size: 16px;
    font-family: Roboto, Roboto;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
  }

  .icon {
    margin-right: 8px;
  }
}

.user {
  font-size: 16px;
  font-family: Roboto-Bold, Roboto;
  font-weight: bold;
  color: #333333;
  line-height: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 130px;

  img {
    width: 60px;
    height: 60px;
  }

  .name {
    font-size: 20px;
    font-family: Roboto, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-top: 10px;
  }
}
</style>
