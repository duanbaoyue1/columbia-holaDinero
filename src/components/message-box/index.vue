<template>
  <transition>
    <div v-show="show" class="message-container" :class="prop.class">
      <div class="container">
        <div class="icon" v-if="prop.iconPath">
          <img :src="getAssetsImages(prop.iconPath)" />
        </div>
        <div class="padding">
          <div class="content" v-html="prop.content"></div>
          <div class="actions">
            <div
              class="confirm"
              v-if="prop.confirmBtnText"
              @click="prop.confirmCallback"
            >
              {{ prop.confirmBtnText }}
            </div>
            <div
              class="cancel row-center"
              v-if="prop.cancelBtnText"
              @click="cancelCallback"
            >
              {{ prop.cancelBtnText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Message",
  computed: {
    ...mapState({
      show: (state) => state.messageBox.show,
      prop: (state) => state.messageBox.messageInfo,
    }),
  },
  methods: {
    cancelCallback() {
      if (
        ["information", "contacts", "identity", "addBank"].includes(
          this.$route.name
        )
      ) {
        this.sendEventTrackData({});
      }
      this.prop.cancelCallback();
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter-active {
  transition: all 500ms;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.padding {
  padding: 0 20px 20px;
}

.message-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  .container {
    width: 315px;
    background: #ffffff;
    border-radius: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;

    .icon {
      width: 315px;
      position: relative;
      top: -26px;
      img {
        width: 315px;
        height: 164px;
      }
    }
    .close {
      position: absolute;
      bottom: -54px;
      left: 50%;
      transform: translateX(-50%);
    }
    .content {
      margin-bottom: 20px;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      word-break: break-word;
    }
    .actions {
      .confirm {
        background: #a05bf8;
        border-radius: 18px;
        width: 100%;
        height: 36px;
        font-size: 16px;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cancel {
        height: 36px;
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        border: 1px solid #e3e3e3;
        font-weight: 400;
        color: #999999;
        border-radius: 22px;
        margin-top: 16px;
      }
    }
  }
  &.back-control {
    .container {
      .actions {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;

        .confirm {
          width: 149px;
        }
        .cancel {
          width: 106px;
          margin-top: 0;
          margin-right: 8px;
          line-height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
