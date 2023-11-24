<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="unsuccessful" :width="100" :height="100" />
      <div class="error">Error de transferencia</div>
      <div class="title">
        Error en la solicitud del servicio de transferencia, inténtelo de nuevo
        más tarde
      </div>
      <div class="apply" @click="goHome">Volver a la página de inicio</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: "Solicitud de préstamo",
    });
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .loan-tips {
    padding-top: 40px;
    .icon {
      margin: 0 auto;
    }
    .error {
      font-size: 16px;
      font-family: Roboto, Roboto;
      font-weight: 500;
      color: #2a303c;
      line-height: 20px;
      margin-top: 8px;
      margin-bottom: 8px;
      text-align: center;
    }
    .title {
      text-align: center;
      margin: 8px 24px 32px;
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #a7a7a7;
      line-height: 16px;
      word-break: break-word;
    }
    .apply {
      width: 327px;
      height: 48px;
      background: #a05bf8;
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }
}
</style>
