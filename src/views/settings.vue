<template>
  <div class="settings content-area">
    <div v-if="hasPassword" class="btn" @click="$router.push({ name: 'create-password' })">Create password</div>
    <div v-else class="btn" @click="$router.push({ name: 'retrieve-password' })">Change Login Password</div>
    <div class="btn" @click="showLegal = true">Legal</div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <div @click="goTerms">Terms of Use</div>
        <div @click="goPrivacy">Privacy Policy</div>
        <m-icon class="close" type="message/close" :width="24" :height="24" @click="showLegal = false" />
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" @click="showBackLogOut = true">Log Out</button>
    </div>

    <div class="control-back" v-if="showBackLogOut">
      <div class="content">
        <m-icon class="close" type="handy/路径" :width="20" :height="20" @click="showBackLogOut = false" />
        <div class="head">
          <img :src="require('@/assets/img/handy/确定退出嘛.png')" />
        </div>
        <div class="log-out-content">Are you sure you want to log out?</div>
        <div class="action">
          <button class="btn-default" @click="logout">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Set up',
    });
  },
  data() {
    return {
      hasPassword: 0,
      showLegal: false,
      showBackLogOut: false,
    };
  },
  methods: {},
  async mounted() {
    try {
      let data = await this.$http.post(`/api/user/mine`);
      this.hasPassword = data.data.hasPassword;
    } catch (error) {}
  },
};
</script>

<style lang="scss" scoped>
.settings {
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
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 0;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      background: #fff;
      line-height: 24px;
      width: 295px;
      box-sizing: border-box;
      border-radius: 8px;

      > div {
        text-align: center;
        &:first-child {
          border-bottom: 1px solid #cccccc;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
      }

      .close {
        position: absolute;
        bottom: -54px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .btn {
    border-radius: 14px;
    position: relative;
    margin: 24px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    display: flex;
    align-items: center;
    &::after {
      position: absolute;
      content: ' ';
      width: 8px;
      height: 12px;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      background-image: url(../assets/img/right.png);
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 222;

    .content {
      width: 295px;
      padding: 24px;
      padding-top: 0;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 8px;
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
      .head {
        position: relative;
        height: 54px;
        img {
          position: absolute;
          top: -27px;
          left: 50%;
          transform: translateX(-50%);
          width: 295px;
          display: block;
          margin-bottom: 20px;
        }
      }

      .close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
      }
      .log-out-content {
        font-size: 15px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333;
        line-height: 20px;
        margin-top: 90px;
      }

      .action {
        margin-top: 20px;
        .btn-default {
          width: 247px;
          height: 40px;
          background: #6515fe;
          // box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
          border-radius: 20px;
          border: none;
          color: #fff;
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
