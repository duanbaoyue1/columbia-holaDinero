<template>
  <div class="complete-step">
    <div class="step" v-for="(step, index) in steps" :class="{ active: actionIndex >= index }" :key="index">
      <div class="red-bot">
        <img :src="actionIndex >= index ? require('@/assets/img/handy/进度条点亮.png') : require('@/assets/img/handy/进度条未点亮.png')" />
      </div>
      <img class="stat-img" :src="actionIndex > index ? step.doneImg : actionIndex === index ? step.activeImg : step.noActiveImg" />
      <div class="text">{{ step.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['actionIndex'],
  data() {
    return {
      steps: [
        {
          text: 'Identity Info',
          doneImg: require('@/assets/img/handy/Identity Info完成.png'),
          activeImg: require('@/assets/img/handy/Identity Info.png'),
          noActiveImg: require('@/assets/img/handy/Identity Info.png'),
        },
        {
          text: 'Personal Info',
          doneImg: require('@/assets/img/handy/Identity Info完成.png'),
          activeImg: require('@/assets/img/handy/Personal Info.png'),
          noActiveImg: require('@/assets/img/handy/Personal Info灰.png'),
        },
        {
          text: 'Contacts Info',
          doneImg: require('@/assets/img/handy/Identity Info完成.png'),
          activeImg: require('@/assets/img/handy/Contacts Info.png'),
          noActiveImg: require('@/assets/img/handy/Contacts Info灰.png'),
        },
        {
          text: 'Payment method',
          doneImg: require('@/assets/img/handy/Identity Info完成.png'),
          activeImg: require('@/assets/img/handy/Payment method.png'),
          noActiveImg: require('@/assets/img/handy/Payment method灰.png'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.complete-step {
  display: flex;
  justify-content: center;
  width: 100%;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
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
      top: 3px;
      left: -26px;
    }

    &:first-child {
      &::before {
        content: '';
        display: none;
      }
    }

    .stat-img {
      width: 30px;
      display: block;
      margin-bottom: 4px;
    }
    .red-bot {
      margin-bottom: 10px;
      img {
        width: 10px;
        display: block;
      }
    }
    .text {
      color: #999999;
      transform: scale(0.9);
    }
    &.active {
      .text {
        color: #333;
      }
      &::before {
        background: #6515fe;
      }
    }
  }
}
</style>
