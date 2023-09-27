<template>
  <transition>
    <div v-show="show" class="message-container">
      <div class="container">
        <div class="icon" v-if="prop.iconPath">
          <img :src="getImg(prop.iconPath)" />
        </div>
        <div class="content" v-html="prop.content"></div>
        <div class="actions">
          <div
            class="confirm row-center"
            v-if="prop.confirmBtnText"
            @click="prop.confirmCallback"
          >
            {{ prop.confirmBtnText }}
          </div>
          <div
            class="cancel row-center"
            v-if="prop.cancelBtnText"
            @click="prop.cancelCallback"
          >
            {{ prop.cancelBtnText }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import deleteAccount from '@/assets/images/delete-account-banner.png'
import confirmExit from '@/assets/images/confirm-exit.png'
import fail from '@/assets/images/information/fail.png'
import repeat from '@/assets/images/information/repeat.png'
import correct from '@/assets/images/information/correct.png'

export default {
  name: 'MessageBox',
  data() {
    return {
      deleteAccount,
      confirmExit,
      fail,
      repeat,
      correct
    }
  },
  computed: {
    ...mapState({
      show: (state) => state.messageBox.show,
      prop: (state) => state.messageBox.messageInfo
    })
  },
  methods: {
    getImg(type) {
      switch (type) {
        case 'deleteAccount':
          return this.deleteAccount

        case 'confirmExit':
          return this.confirmExit

        case 'fail':
          return this.fail

        case 'repeat':
          return this.repeat

        case 'correct':
          return this.correct

        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.v-enter-active {
  transition: all 500ms;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

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
    .content {
      margin-bottom: 32px;
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      word-break: break-word;
    }
    .actions {
      .confirm {
        color: $themeFontColor;
        background: $themeColor;
        border-radius: 24px;
        height: 48px;
        font-size: 16px;
        font-weight: 900;
        line-height: 24px;
      }
      .cancel {
        height: 48px;
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        border-radius: 24px;
        color: $themeColor;
        border: 1px solid $themeColor;
        font-weight: 400;
        line-height: 20px;
        margin-top: 20px;
      }
    }
  }
}
</style>
