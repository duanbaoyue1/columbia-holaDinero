<template>
  <div class="complain-edit content-area">
    <div class="head">Feedback agency</div>
    <div class="text-content">
      {{ type }}
    </div>
    <div class="line" />
    <div class="head">Type of question</div>
    <div class="text-content">
      {{ question }}
    </div>
    <div class="line" />

    <div class="head">
      <div class="row-flex">
        Question Details
        <img class="must" src="@/assets/images/must.png" />
      </div>
      <span class="cur-length">{{ this.content.length }}/100</span>
    </div>
    <textarea
      class="textarea"
      v-model="content"
      :maxlength="100"
      @keyup="changeContent"
      placeholder="Please fill in the content of your complaint, no more than 100 words."
    ></textarea>

    <div class="head">Contact number</div>
    <div class="text-content">{{ userInfo.mobile | phoneHideFilter }}</div>
    <div class="line" />

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!content" @click="submit">
        Ok
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    window.onPhotoSelectCallback = (data) => {
      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      data.base64 = data.base64.map((t) => {
        return `data:image/png;base64,${t}`
      })
      if (data.success) {
        this.imgs.splice(0, 0, ...data.base64)
      }
    }

    return {
      type: this.$route.query.type || '',
      question: this.$route.query.question || '',
      imgs: [],
      content: ''
    }
  },
  mounted() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Complaints'
    })
    setTimeout(() => {
      this.getUserInfo()
    }, 200)
  },

  methods: {
    changeContent() {
      if (this.content.trim() == '') {
        this.content = ''
      }
    },
    removeImg(index) {
      this.imgs.splice(index, 1)
    },
    addImg() {
      this.toAppMethod('unfoldCa', {
        type: 5,
        multiple: 3 - this.imgs.length,
        callbackMethodName: `onPhotoSelectCallback`
      })
    },

    async submit() {
      try {
        this.showLoading()
        let saveData = {
          userId: this.userInfo.id,
          feedbackMechanism: this.type,
          problemType: this.question,
          problemContent: this.content
        }

        let res = await this.$http.post(
          `/api/user/saveComplaintRecord`,
          saveData
        )
        if (res.returnCode == 2000) {
          this.$toast(
            'Submitted successfully, we will handle it as soon as possible'
          )
          setTimeout((res) => {
            this.innerJump('complainList', {}, true)
          }, 1000)
        } else {
          this.$toast(res.message)
        }
      } catch (error) {
        this.$toast(error.message)
      } finally {
        this.hideLoading()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.complain-edit {
  padding: 10px 20px 20px;
  padding-bottom: 110px;

  .text-content {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
  }
  .line {
    border: 1px solid #e9e9e9;
    margin-top: 16px;
  }

  .textarea {
    font-size: 12px;
    width: 300px;
    height: 116px;
    line-height: 18px;
    border-radius: 8px;
    border: 1px solid #cccccc;
    background: #f6f6f6;
    padding: 16px;
    margin-bottom: -10px;
    resize: none;
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .row-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }

  .must {
    width: 8px;
    height: 8px;
    margin-left: 4px;
  }
  .head {
    margin-top: 20px;
    margin-bottom: 16px;
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 500;
    color: #333;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    .cur-length {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
  }
  .content {
    .line-item {
      width: 320px;
      height: 60px;
      border-radius: 14px;
      border: 1px solid #cccccc;
      padding: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      box-sizing: border-box;
      background: transparent;
    }

    &-area {
      width: 320px;
      border-radius: 14px;
      border: 1px solid #cccccc;
      box-sizing: border-box;
      padding: 20px;
      textarea {
        height: 85px;
        width: 100%;
        border: none;
        resize: none;
        outline: none;
        font-size: 12px;
      }

      .imgs {
        display: flex;
        > * {
          margin-right: 10px;
        }
        .img {
          width: 74px;
          height: 74px;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          background-size: cover;
          background-position: center;
          .close {
            position: absolute;
            right: 8px;
            top: 8px;
          }
        }
        .add {
          width: 74px;
          height: 74px;
          background: #f8f8f8;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
