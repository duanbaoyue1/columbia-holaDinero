<template>
  <div class="toast" v-if="show">
    <div class="toast-center">
      {{ msg }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  &-center {
    max-width: 250px;
    border-radius: 3px;
    padding: 10px;
    background: #333;
    word-break: break-word;
  }
}
</style>
