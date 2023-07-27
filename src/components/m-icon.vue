<template>
  <img class="m-icon" :style="{ width: computeWidth, height: computeHeight }" :src="require('@/assets/img/' + type + '.png')" @click="onClick()" />
</template>

<script>
export default {
  name: 'm-icon',
  props: {
    /**
     * 图标类型
     */
    type: String,
    /**
     * 图标颜色
     */
    color: String,

    height: Number,

    width: Number,

    /**
     * 图标大小
     */
    size: {
      type: [Number, String],
      default: 12,
    },
  },
  computed: {
    computeWidth() {
      var width = Number(this.width);
      width = isNaN(width) ? 12 : width;
      return `${(width / 720) * 20}rem`;
    },
    computeHeight() {
      var height = Number(this.height);
      height = isNaN(height) ? 12 : height;
      return `${(height / 720) * 20}rem`;
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.m-icon {
  display: block;
}
</style>
