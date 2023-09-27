<template>
  <div class="complete-step">
    <div
      class="step"
      v-for="(step, index) in steps"
      :class="{ active: actionIndex >= index }"
      :key="index"
    >
      <div class="red-bot">
        <img
          :src="
            actionIndex >= index
              ? require('@/assets/images/information/circle-activation.png')
              : require('@/assets/images/information/circle-not-activation.png')
          "
        />
      </div>
      <div class="stat-img column-direction flex-end">
        <img :src="actionIndex >= index ? step.activeImg : step.notActiveImg" />
      </div>
      <div class="text">₹{{ step.text }}</div>
    </div>
  </div>
</template>

<script>
import gold1 from '@/assets/images/information/gold1.png'
import gold2 from '@/assets/images/information/gold2.png'
import gold3 from '@/assets/images/information/gold3.png'
import gold4 from '@/assets/images/information/gold4.png'
import gold5 from '@/assets/images/information/gold5.png'
import gold6 from '@/assets/images/information/gold6.png'

export default {
  props: {
    actionIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      steps: [
        {
          text: '1,000',
          activeImg: gold1,
          notActiveImg: gold1
        },
        {
          text: '2,000',
          activeImg: gold2,
          notActiveImg: gold4
        },
        {
          text: '4,000',
          activeImg: gold3,
          notActiveImg: gold5
        },
        {
          text: '8,000',
          activeImg: gold6,
          notActiveImg: gold6
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.complete-step {
  display: flex;
  justify-content: space-between;
  width: 100%;

  > div {
    width: 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    white-space: nowrap;
    font-size: 10px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    line-height: 16px;
    position: relative;

    &::before {
      position: absolute;
      width: 52px;
      height: 2px;
      background: #cccccc;
      border-radius: 4px;
      content: ' ';
      top: 4px;
      left: -46px;
    }

    &:first-child {
      &::before {
        content: '';
        display: none;
      }
    }

    .stat-img {
      width: 26px;
      height: 34px;
      margin-bottom: 4px;

      img {
        width: 26px;
        display: block;
      }
    }
    .red-bot {
      margin-bottom: 10px;

      img {
        width: 10px;
        height: 10px;
        display: block;
      }
    }
    .text {
      font-size: 12px;
      font-weight: 400;
      color: #999;
      line-height: 16px;
    }
    &.active {
      .text {
        color: #333;
        font-weight: bold;
      }
      &::before {
        background: $themeColor;
      }
    }
  }
}
</style>
