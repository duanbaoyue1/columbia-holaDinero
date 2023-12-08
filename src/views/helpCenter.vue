<template>
  <iframe class="frame" src="https://www.hola-dinero.com/helpCenter.html" />
</template>

<script>
export default {
  mounted() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "",
    });
  },
};
</script>

<style lang="scss" scoped>
.frame {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
