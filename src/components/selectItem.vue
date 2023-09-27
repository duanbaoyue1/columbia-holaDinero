<template>
  <div class="select-item" :class="{ 'has-value': !!value }">
    <div class="value-wrapper" @click="toggleChoose">
      <span>
        {{ value || placeHolder }}
      </span>
      <img class="icon" src="@/assets/images/right.png" />
    </div>

    <van-action-sheet v-model="openSelect" :title="title" close-on-click-action>
      <div class="items row-wrap row-space-between">
        <div
          class="item row-center"
          :class="{ active: item.value == value }"
          :style="{ width: width + 'px' }"
          v-for="(item, index) in items"
          :key="index"
          @click="chooseValue(item)"
        >
          <span>{{ item.label }}</span>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '140'
    },
    items: {
      type: Array,
      default: () => []
    },
    itemAttrs: {
      type: [String, Number],
      default: ''
    },
    placeHolder: {
      type: String,
      default: 'Please select'
    }
  },

  data() {
    return {
      openSelect: false,
      value: ''
    }
  },

  methods: {
    chooseValue(item) {
      console.log(item)
      this.value = item.value
      this.toggleChoose()
      this.$emit('choose', { attr: this.itemAttrs, value: item.value })
    },
    toggleChoose() {
      this.openSelect = !this.openSelect
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.select-item {
  border-radius: 14px;
  &.has-value {
    .value-wrapper {
      color: #333333;
    }
  }

  .items {
    margin: 40px 40px 0;

    .item {
      height: 40px;
      color: #999;
      font-size: 16px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      line-height: 20px;
      margin-bottom: 36px;
      border-radius: 20px;
      border: 1px solid #e4e4e4;

      &.active {
        font-weight: 500;
        color: $themeColor;
        border: 2px solid $themeColor;
      }
    }
  }

  .value-wrapper {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      width: 12x;
      height: 12px;
      margin-left: 8px;
    }
  }
}
</style>
