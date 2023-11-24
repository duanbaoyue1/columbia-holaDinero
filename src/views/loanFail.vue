<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="unsuccessful" :width="100" :height="100" />
      <div class="title">
        Lo sentimos, el envío de la solicitud ha fallado, ¡esta solicitud está
        llena
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
      transparent: true,
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
    .title {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin: 8px 24px 40px;
      word-break: break-word;
    }
    .apply {
      width: 327px;
      height: 48px;
      border-radius: 24px;
      background: #a05bf8;
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
