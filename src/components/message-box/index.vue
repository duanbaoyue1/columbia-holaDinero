<template>
  <transition>
    <div v-show="show" class="message-container">
      <div class="container">
        <div class="icon" v-if="prop.iconPath">
          <img :src="require('@/assets/img/' + prop.iconPath + '.png')" />
        </div>
        <div class="content" v-html="prop.content"></div>
        <div class="actions">
          <div class="confirm" v-if="prop.confirmBtnText" @click="prop.confirmCallback">
            {{ prop.confirmBtnText }}
          </div>
          <div class="cancel" v-if="prop.cancelBtnText" @click="prop.cancelCallback">
            {{ prop.cancelBtnText }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Message',
  computed: {
    ...mapState({
      show: state => state.messageBox.show,
      prop: state => state.messageBox.messageInfo,
    }),
  },
};
</script>

<style lang="scss" scoped>
// .v-enter-active,
// .v-leave-active {
//   transition: all 500ms;
// }

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
    width: 295px;
    background: #ffffff;
    padding: 120px 24px 24px;
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
        background: #6515fe;
        // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
        border-radius: 20px;
        width: 247px;
        height: 40px;
        font-size: 16px;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cancel {
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-top: 16px;
        text-align: center;
      }
    }
  }
}
</style>
