<template>
  <transition>
    <div class="message-container">
      <div class="container">
        <div class="icon">
          <img :src="require('@/assets/images/safety-warning.png')" />
        </div>
        <div class="content-frame">
          <div class="title">SAFETY WARNING</div>
          <div class="content-font">
            1.
            <span>Do not trust</span>
            the debt collector who sent you UPI on Whatsapp, they must be liars!
            <br />
            2.
            <span>Use the latest UPI account</span>
            on the loan app to make the repayment.
            <br />
            3.
            <span>Do not forget</span>
            our only customer service email：{{ email }}
          </div>
        </div>
        <div class="pop-ups-submit-btn" @click="confirmClick">
          I already Know
        </div>
        <div class="cancel" @click="cancelClick">Don't remind me again</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SafetyWarning',
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    confirmClick() {
      this.$emit('confirmClick')
    },
    cancelClick() {
      this.$emit('cancelClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.message-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
  .container {
    width: 335px;
    background: #ffffff;
    padding: 150px 24px 24px;
    border-radius: 8px;
    line-height: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    position: relative;

    .icon {
      position: absolute;
      left: 0;
      right: 0;
      top: -50px;
      img {
        width: 100%;
      }
    }
    .close {
      position: absolute;
      bottom: -54px;
      left: 50%;
      transform: translateX(-50%);
    }
    .content-frame {
      margin-bottom: 24px;
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      color: #333;
      line-height: 20px;

      .title {
        font-size: 20px;
        font-weight: bold;
        color: #000601;
        line-height: 24px;
        text-align: center;
      }

      .content-font {
        margin-top: 8px;
        word-break: break-word;

        span {
          color: #ff4b3f;
          font-weight: bold;
        }
      }
    }
    .cancel {
      height: 48px;
      font-size: 18px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 900;
      color: $themeColor;
      line-height: 20px;
      border-radius: 24px;
      border: 1px solid $themeColor;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
  }
}
</style>
