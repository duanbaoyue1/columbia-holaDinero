<template>
  <div class="mine content-area display-flex-1">
    <div class="frame">
      <div class="user">
        <img :src="require('@/assets/images/head-sculpture.png')" />
        <span class="name">{{ userInfo.mobile | phoneHideFilter }}</span>
      </div>

      <div
        class="menu row-space-between-center"
        @click="innerJump('orderList')"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="all-order" :width="24" :height="24" />
          Pedido de préstamo
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div
        class="menu row-space-between-center"
        @click="innerJump('helpCenter')"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="help-center" :width="24" :height="24" />
          Centro de ayuda
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div
        v-if="userInfo.remittanceAccountAuth"
        class="menu row-space-between-center"
        @click="innerJump('completeBank', { from: 'mine' })"
      >
        <div class="title row-direction">
          <m-icon class="icon" type="bank-card" :width="24" :height="24" />
          Tarjeta bancaria
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div class="menu row-space-between-center" @click="innerJump('settings')">
        <div class="title row-direction">
          <m-icon class="icon" type="set-up" :width="24" :height="24" />
          Configuración
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>

      <div class="menu row-space-between-center" @click="showDeleteConfirm">
        <div class="title row-direction">
          <m-icon class="icon" type="delete" :width="24" :height="24" />
          Eliminar cuenta
        </div>
        <m-icon type="right" :width="10" :height="18" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  activated() {
    this.setEventTrackStartTime();
    this.updateData();
  },
  async mounted() {
    this.setTabBar({
      show: false,
    });
  },
  methods: {
    showDeleteConfirm() {
      this.showMessageBox({
        content:
          "Después de eliminar la cuenta, se eliminará toda la información de la cuenta. ¿Está seguro de eliminar?",
        confirmBtnText: "Déjame pensar de nuevo",
        cancelBtnText: "Confirmar eliminación",
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.logoutClick();
        },
        iconPath: "delete-account",
      });
    },
    async logoutClick() {
      this.showLoading();
      try {
        await this.$http.post(`/api/user/logout`, {
          userId: this.userInfo.userInfoId,
        });
        this.$toast("Eliminado con éxito");
        setTimeout(() => {
          this.toAppMethod("toGoSign");
        }, 1000);
      } catch (e) {
        this.$toast(e.message);
      } finally {
        this.hideLoading();
      }
    },
    async updateData() {
      this.showLoading();
      try {
        await this.getUserInfo();
      } catch (error) {
      } finally {
        this.hideLoading();
      }
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
  background-size: 375px 176px;
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
  padding-top: 100px;

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
