<template>
  <div class="settings content-area">
    <div
      v-if="!hasPassword"
      class="btn row-space-between"
      @click="$router.push({ name: 'createPassword' })"
    >
      Crear una contraseña
      <m-icon type="right" :width="8" :height="16" />
    </div>
    <div
      class="btn row-space-between"
      @click="$router.push({ name: 'retrievePassword' })"
    >
      Cambiar contraseña
      <m-icon type="right" :width="8" :height="16" />
    </div>
    <div class="btn row-space-between" @click="showLegal = true">
      Legal
      <m-icon type="right" :width="8" :height="16" />
    </div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <div class="row-space-between" style="padding: 0 20px">
          <div></div>
          <div class="legal">Legal</div>
          <m-icon
            class="close"
            type="close"
            :width="16"
            :height="16"
            @click="showLegal = false"
          />
        </div>
        <div class="title margin-top-30" @click="innerJump('terms')">
          Condiciones del servicio
        </div>
        <div class="line"></div>
        <div class="title margin-top-30" @click="innerJump('privacy')">
          Política de privacidad
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn-default" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasPassword: 0,
      showLegal: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: "Configuración",
    });
  },
  async mounted() {
    this.setEventTrackStartTime();
    try {
      let data = await this.$http.post(`/api/user/mine`);
      this.hasPassword = data.data.hasPassword;
    } catch (error) {}
  },
};
</script>

<style lang="scss" scoped>
.settings {
  .legal-modal {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 0;
      background: #fff;
      width: 295px;
      border-radius: 16px;
    }

    .legal {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #a05bf8;
      line-height: 24px;
    }

    .line {
      width: 100%;
      height: 2px;
      background: #e3eceb;
      margin-top: 20px;
    }

    .title {
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .btn {
    height: 80px;
    margin: 0 20px;
    font-size: 16px;
    font-family: Roboto, Roboto;
    font-weight: 500;
    color: #333333;
    line-height: 20px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e9e9e9;
  }
}

.actions {
  position: fixed;
  padding-bottom: 20px;
  bottom: 0;
  left: 0;
  right: 0;

  .btn-default {
    width: 335px;
    background: #ff4b3f;
    border-radius: 24px;
    height: 48px;
    border: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 16px;
    margin-left: 20px;
  }
}

.row-space-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.margin-top-30 {
  margin-top: 30px;
}
</style>
