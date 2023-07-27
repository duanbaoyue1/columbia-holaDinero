<template>
  <div class="complain-edit content-area">
    <div class="head">Feedback agency</div>
    <div class="content">
      <input v-model="type" disabled />
    </div>
    <div class="head">Type of question</div>
    <div class="content">
      <input v-model="question" disabled />
    </div>
    <div class="head">
      <div>
        Question Details
        <span class="must">*</span>
      </div>
      <span class="cur-length">{{ this.content.length }}/100</span>
    </div>
    <div class="content">
      <div class="content-area">
        <textarea class="edit" maxlength="100" @keyup="changeContent" v-model="content" placeholder="Please fill in the content of your complaint, no more than 100 words."></textarea>
        <div class="imgs">
          <div class="img" v-for="(img, index) in imgs" :key="img" :style="{ backgroundImage: 'url(' + img + ')' }" @click="previewImg(imgs, index)">
            <m-icon class="close" type="close" :width="15" :height="15" @click="removeImg(index)" />
          </div>
          <div class="add" v-if="imgs.length < 3" @click="addImg">
            <m-icon class="add" type="add2" :width="20" :height="20" />
          </div>
        </div>
      </div>
    </div>
    <div class="head">Contact number</div>
    <div class="content">
      <div class="line-item">
        {{ userInfo.mobile | phoneHideFilter }}
      </div>
    </div>

    <div class="submit">
      <button :disabled="!content" @click="submit">Ok</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    window.onPhotoSelectCallback = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      data.base64 = data.base64.map(t => {
        return `data:image/png;base64,${t}`;
      });
      if (data.success) {
        this.imgs.splice(0, 0, ...data.base64);
      }
    };

    return {
      type: this.$route.query.type || '',
      question: this.$route.query.question || '',
      imgs: [],
      content: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    changeContent() {
      if (this.content.trim() == '') {
        this.content = '';
      }
    },
    removeImg(index) {
      this.imgs.splice(index, 1);
    },
    addImg() {
      this.toAppMethod('getCapture', { type: 5, multiple: 3 - this.imgs.length, callbackMethodName: `onPhotoSelectCallback` });
    },

    async submit() {
      try {
        this.showLoading();
        let saveData = {
          userId: this.userInfo.id,
          feedbackMechanism: this.type,
          problemType: this.question,
          problemContent: this.content,
        };
        if (this.imgs[0]) {
          saveData.firstImageBase64Src = this.imgs[0];
        }
        if (this.imgs[1]) {
          saveData.secondImageBase64Src = this.imgs[1];
        }
        if (this.imgs[2]) {
          saveData.thirdImageBase64Src = this.imgs[2];
        }

        let res = await this.$http.post(`/api/user/saveComplaintRecord`, saveData);
        if (res.returnCode == 2000) {
          this.$toast('Submitted successfully, we will handle it as soon as possible');
          setTimeout(res => {
            this.innerJump('complain-list', {}, true);
          }, 1000);
        } else {
          this.$toast(res.message);
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.complain-edit {
  padding: 10px 20px 20px;
  padding-bottom: 110px;

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    button {
      margin: 20px 20px 20px;
      height: 48px;
      width: 320px;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 900;
      background: #1143a4;
      color: #fff;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      box-sizing: border-box;
      padding: 0;
      &:disabled {
        background: #e9e9e9;
        color: #999999;
      }
    }
  }
  .must {
    margin-left: 2px;
    color: #ff4b3f;
  }
  .head {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
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
    input,
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
