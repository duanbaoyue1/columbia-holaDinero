<template>
  <div class="settings content-area">
    <div class="setting-frame">
      <div v-if="!hasPassword" class="btn" @click="innerJump('createPassword')">
        Create password
      </div>
      <div
        v-else
        class="btn margin-top-30"
        @click="innerJump('retrievePassword')"
      >
        Change Login Password
      </div>
      <div class="btn margin-top-30" @click="showLegal = true">Legal</div>
    </div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <div @click="goTerms">Terms of Use</div>
        <div @click="goPrivacy">Privacy Policy</div>
        <img
          class="close"
          src="@/assets/images/round-close.png"
          @click="showLegal = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasPassword: 0,
      showLegal: false
    }
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Set up'
    })
  },
  async mounted() {
    try {
      let data = await this.$http.post(`/api/user/mine`)
      this.hasPassword = data?.data?.hasPassword
    } catch (error) {}
  },
  methods: {
    goPrivacy() {
      this.innerJump('privacy')
    },
    goTerms() {
      this.innerJump('terms')
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  flex: 1;
  background: #f9f9f9;
  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
  }

  .legal-modal {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    .content {
      width: 335px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 18px;
      font-weight: 400;
      color: #333;
      background: #fff;
      line-height: 24px;
      box-sizing: border-box;
      border-radius: 8px;
      padding: 20px;

      > div {
        text-align: center;
        &:first-child {
          border-bottom: 1px solid #cccccc;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
      }

      .close {
        width: 26px;
        height: 26px;
        position: absolute;
        top: -54px;
        right: 0;
      }
    }
  }
  .setting-frame {
    background: #ffffff;
    border-radius: 14px;
    margin: 20px 20px 0;
    padding: 20px;
  }
  .btn {
    position: relative;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 18px;
    display: flex;
    align-items: center;
    &::after {
      position: absolute;
      content: ' ';
      width: 12px;
      height: 16px;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      background-image: url(../assets/images/right.png);
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
