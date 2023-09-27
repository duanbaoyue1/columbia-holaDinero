<template>
  <div class="identity-frame">
    <div
      class="pan-img row-center column-direction"
      :style="{
        background: panFrontBase64Src ? 'transparent' : '#b7eee4'
      }"
      @click="cardClick"
    >
      <template v-if="panFrontBase64Src">
        <img class="back user-pic" :src="panFrontBase64Src" />
        <img
          class="btn"
          :src="require('@/assets/images/information/complete.png')"
        />
      </template>
      <template v-else>
        <img
          class="back"
          :src="require('@/assets/images/information/pan-front.png')"
        />
        <img
          class="btn"
          :src="require('@/assets/images/information/camera.png')"
        />
      </template>
    </div>
    <div class="pan-text">Pan <span>Photo</span></div>

    <div class="pan-tips">
      <div class="row-flex">
        <img class="icon" src="@/assets/images/information/qualification.png" />
        Please take a clear photo of yourself with your pan card, only for the
        purpose of auditing your qualification.
      </div>
      <div class="row-flex" style="margin-top: 8px">
        <img class="icon" src="@/assets/images/information/confidential.png" />
        Please rest assured that the platform will keep your information
        strictly confidential.
      </div>
    </div>

    <!-- 进度条 -->
    <div class="submit-success" v-if="submitSuccess">
      <div class="submit-success-content">
        <div class="percent">
          <div class="cur-percent" :style="{ width: curPercent + '%' }"></div>
          <div class="tips" :style="{ left: curPercent + '%' }">
            {{ curPercent }}%
          </div>
        </div>
        <div class="tips">
          Please be patient and wait for the
          <br />
          upload to unlock the credit
        </div>
      </div>
    </div>

    <transition>
      <div class="hint-card" v-show="showHintCard">
        <div class="hint-card-content">
          <div class="card-title">Example of a correct PAN card</div>
          <div class="row-center margin-top-24">
            <img
              class="card-top-icon"
              src="@/assets/images/information/7.png"
            />
          </div>
          <div class="row-space-between margin-top-24">
            <div class="column-direction-center">
              <img class="card-icon" src="@/assets/images/information/8.png" />
              <div class="card-subtitle">Missing border</div>
            </div>
            <div class="column-direction-center">
              <img class="card-icon" src="@/assets/images/information/9.png" />
              <div class="card-subtitle">Blurred photo</div>
            </div>
            <div class="column-direction-center">
              <img class="card-icon" src="@/assets/images/information/10.png" />
              <div class="card-subtitle">Strong flash</div>
            </div>
          </div>
          <div class="card-content margin-top-24">
            Clear PAN card information will increase loan success rates by at
            least 20%
          </div>
          <div class="hint-card-btn row-center" @click="nextStepClick">
            Next Step
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    window.onPhotoSelectCallback_3 = (data) => {
      console.log(data, '********* onPhotoSelectCallback_3')
      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      if (data.success) {
        this.eventTracker('id_pan_front_success')
        this.panFrontBase64Src = `data:image/png;base64,${data.base64}`
        this.uploadImg(3, 'panFrontBase64Src', this.panFrontBase64Src)
      } else {
        this.submitSuccess = false
      }
    }

    window.onPhotoSelectCallback_4 = (data) => {
      console.log(data, '********* onPhotoSelectCallback_4')

      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      if (data.success) {
        this.eventTracker('id_liveness_photo_submit')
        this.uploadImg(
          4,
          'livingBase64Src',
          `data:image/png;base64,${data.base64}`
        )
      } else {
        this.submitSuccess = false
      }
    }

    window.onPhotoBackMethodName_3 = (data) => {
      console.log(data, '********* onPhotoBackMethodName_3')

      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      if (data.success) {
        setTimeout(() => {
          this.startPercent()
        }, 1000)
      }
    }

    window.onPhotoBackMethodName_4 = (data) => {
      console.log(data, '********* onPhotoBackMethodName_4')

      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      if (data.success) {
        setTimeout(() => {
          this.startPercent()
        }, 1000)
      }
    }

    return {
      submitSuccess: false,
      panFrontBase64Src: '',
      editData: {},
      curPercent: 0,
      saving: false,
      curInterval: null,
      ocrChannel: 'AccV2',
      showHintCard: false,
      isUploadCard: false
    }
  },
  mounted() {
    this.eventTracker('id_access')
  },

  methods: {
    unfoldCa(type) {
      if (type == 3) {
        this.eventTracker('id_pan_front')
      }
      this.toAppMethod('unfoldCa', {
        type: type,
        callbackMethodName: `onPhotoSelectCallback_${type}`,
        photoBackMethodName: `onPhotoBackMethodName_${type}`
      })
    },
    cardClick() {
      // 已经点击过上传，则不需要弹框
      if (this.panFrontBase64Src) {
        this.unfoldCa(3)
      } else {
        this.showHintCard = true
      }
    },
    nextStepClick() {
      this.unfoldCa(3)
      this.showHintCard = false
    },
    submit() {
      this.eventTracker('id_submit')
      // 判断身份证是否上传成功
      if (this.isUploadCard) {
        this.unfoldCa(4)
      } else {
        this.cardClick()
      }
    },
    startPercent() {
      this.curPercent = 1
      this.submitSuccess = true
      console.log(this.submitSuccess, '********* 11111')
      this.stopPercent()
      this.curInterval = setInterval(() => {
        if (this.curPercent <= 99) {
          this.curPercent += 1
        } else {
          this.stopPercent()
        }
      }, 100)
    },

    stopPercent() {
      if (this.curInterval) {
        window.clearInterval(this.curInterval)
        this.curInterval = null
      }
    },

    async createNewOrder() {
      try {
        // 创建订单
        let res = await this.$http.post(`/api/product/appMaskModel`)
        console.log('订单创建结果:', res)
        this.eventTracker('id_submit_create_order_success')
        this.stopPercent()
        this.submitSuccess = false
        this.$emit('identityEmit', res.data.orderId)
      } catch (error) {
        this.submitSuccess = false
        this.$toast(error.message)
      }
    },

    async uploadImg(type, fileName, base64) {
      try {
        let saveData = {
          channel: this.ocrChannel,
          mark: type
        }
        saveData[fileName] = base64
        let res = await this.$http.post(`/api/ocr/saveBase64Result`, saveData)

        if (res.returnCode == 2000) {
          if (type == 3 && res.data.panFrontOcrStatus) {
            this.isUploadCard = true
            this.curPercent = 100
            this.stopPercent()
            this.submitSuccess = false
            this.eventTracker('id_submit_success')
            // 自动活体检测
            this.unfoldCa(4)
          } else if (type == 4 && res.data.faceComparisonStatus) {
            this.curPercent = 100
            this.eventTracker('id_liveness_success')
            this.createNewOrder()
          } else {
            this.logError(type)
          }
        } else {
          this.logError(type)
        }
      } catch (error) {
        this.logError(type, error.message)
      }
    },

    logError(type, message) {
      this.stopPercent()
      this.submitSuccess = false
      this.isUploadCard = false
      this.eventTracker('id_submit_error')
      this.$toast(message || 'please try again!')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.identity-frame {
  padding: 40px 20px 30px;
  .pan-text {
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 18px;
    margin: 20px auto 0px;
    text-align: center;
    font-family: Roboto-Regular, Roboto;
    span {
      color: #fd973f;
    }
  }

  .icon {
    width: 14px;
    height: 14px;
    margin: 1px 8px 0 0;
  }

  .pan-tips {
    margin-top: 30px;
    font-size: 10px;
    font-weight: 400;
    color: #999;
    line-height: 18px;
    word-break: break-word;
  }

  .pan-demo {
    display: flex;
    align-items: center;
    font-size: 10px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    > div {
      white-space: nowrap;
      text-align: center;
      flex: 1;
      img {
        width: 70px;
        height: 58px;
        margin: 0 auto;
        margin-bottom: 4px;
        display: block;
      }
    }
  }

  .pan-img {
    width: 205px;
    height: 140px;
    margin: 0 auto;
    border-radius: 6px;
    position: relative;

    .back {
      width: 190px;
      height: 120px;

      &.user-pic {
        height: 190px;
        width: 120px;
      }
    }
    .btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
    }
  }

  .hint-card {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2;

    &-content {
      width: 287px;
      background: #ffffff;
      border-radius: 8px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 400;
      color: #000601;
      line-height: 20px;
      padding: 24px 20px;
    }

    .card-title {
      font-size: 16px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #000000;
      line-height: 20px;
      text-align: center;
    }

    .card-subtitle {
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 14px;
      margin-top: 8px;
    }

    .card-content {
      font-size: 13px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
    }

    .hint-card-btn {
      width: 280px;
      height: 40px;
      background: $themeColor;
      border-radius: 24px;
      font-size: 16px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: $themeFontColor;
      line-height: 20px;
      margin-top: 32px;
    }

    .card-top-icon {
      width: 117px;
      height: 60px;
    }

    .card-icon {
      width: 82px;
      height: 54px;
    }
  }

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2;

    &-content {
      width: 320px;
      height: 144px;
      background: #ffffff;
      border-radius: 8px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 400;
      color: #000601;
      line-height: 20px;
      .percent {
        width: 280px;
        height: 10px;
        background: #e6ebf5;
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 54px;
        margin-bottom: 20px;
        position: relative;
        .cur-percent {
          height: 10px;
          background: $themeColor;
          border-radius: 5px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .tips {
          position: absolute;
          top: -30px;
          width: 36px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
          border-radius: 3px;
          background: #333333;
          transform: translateX(-50%);
          &::after {
            position: absolute;
            content: ' ';
            border-style: solid;
            border-width: 6px;
            border-color: #333333 transparent transparent transparent;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .tips {
        font-size: 16px;
        line-height: 20px;
        text-align: center;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
  }
}
</style>
