<template>
  <div class="margin-top-30 row-space-between">
    <div class="item-frame easy-color">
      Easy Application
      <img src="@/assets/images/easy-application.png" />
    </div>
    <div class="item-frame low-color">
      Low Interest Rate
      <img src="@/assets/images/low-interest-rate.png" />
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.item-frame {
  width: 165px;
  height: 80px;
  background: #e0e4fa;
  border-radius: 14px;
  font-size: 14px;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #333333;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;

  img {
    width: 46px;
    height: 46px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
}

.easy-color {
  background: #e0e4fa;
}

.low-color {
  background: #c8f4ed;
}
</style>