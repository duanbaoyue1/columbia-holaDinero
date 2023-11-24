<template>
  <div class="complete-step">
    <div
      class="step"
      v-for="(step, index) in steps"
      :class="{ active: actionIndex >= index, last: index == steps.length - 1 }"
      :key="index"
    >
      <div class="stat-img-wrapper">
        <img
          class="stat-img"
          :src="
            actionIndex >= index
              ? getAssetsImages(step.activeImg)
              : getAssetsImages(step.noActiveImg)
          "
        />
      </div>
      <div class="text">{{ step.text }}</div>
      <div class="red-bot" :class="actionIndex >= index ? 'active' : ''"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["actionIndex"],
  data() {
    return {
      steps: [
        {
          text: "$500,000",
          activeImg: "gold1",
          noActiveImg: "gold1",
        },
        {
          text: "$1,000,000",
          activeImg: "gold2",
          noActiveImg: "gold4",
        },
        {
          text: "$1,500,000",
          activeImg: "gold3",
          noActiveImg: "gold5",
        },
        {
          text: "$2,000,000",
          activeImg: "gold4",
          noActiveImg: "gold6",
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
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    position: relative;
    &::before {
      position: absolute;
      width: 74px;
      height: 4px;
      background: #eae6f6;
      content: " ";
      top: 59px;
      left: -36px;
      z-index: 0;
    }

    &:first-child {
      &::before {
        content: "";
        display: none;
      }
    }

    &.active {
      &::before {
        background: #a05bf8 !important;
      }
      .red-bot {
        background: #a05bf8;
        box-shadow: 0 0 0 3px #eae6f6;
      }
    }

    &.last {
      .red-bot {
        background: #eae6f6 !important;
        box-shadow: none !important;
      }
      .text {
        color: #999999 !important;
      }
    }

    .stat-img-wrapper {
      width: 24px;
      height: 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .stat-img {
        width: 24px;
      }
    }

    .red-bot {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: #eae6f6;
      margin-top: 8px;
      z-index: 1;
      img {
        width: 10px;
        display: block;
      }
    }
    .text {
      color: #999999;
      font-weight: 500;
      margin-top: 8px;
    }
    &.active {
      .text {
        color: #a05bf8;
      }
      &::before {
        background: #a05bf8;
      }
    }
  }
}
</style>
