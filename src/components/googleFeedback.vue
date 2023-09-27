<template>
  <transition>
    <div class="google-feedback">
      <div class="google-feedback-content">
        <div class="tips">
          <img :src="require('@/assets/images/favorable-comment.png')" />
        </div>
        <div class="close-btn" @click="hide" />
        <div class="title">What do you think about {{ appName }}?</div>

        <div class="stars">
          <div v-for="(item, index) in stars" :key="index">
            <img
              :src="
                curStar >= index + 1
                  ? require('@/assets/images/star-solid.png')
                  : require('@/assets/images/star-none.png')
              "
              @click="toggleStar(index + 1)"
            />
          </div>
        </div>
        <div v-if="curStar >= 4" class="five-star">
          Five-star reviews can improve the passing rate!
        </div>
        <textarea
          v-else
          maxlength="100"
          v-model="comments"
          @keyup="changeContent"
          placeholder="Please leave your feedback, we will read and feedback carefully!"
        ></textarea>
        <div class="margin-top-26">
          <div class="pop-ups-submit-btn" @click="submit">
            {{ curStar > 3 ? 'TO GP post comments' : 'Submit' }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'son',
  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      curStar: 5,
      comments: ''
    }
  },
  methods: {
    toggleStar(star) {
      this.curStar = star
    },
    hide() {
      this.$emit('update:show', false)
    },
    changeContent() {
      if (this.comments.trim() == '') {
        this.comments = ''
      }
    },
    async submit() {
      if (this.curStar <= 3 && !this.comments.length) {
        this.$toast('Please enter comments or suggestions')
        return
      }

      try {
        this.showLoading()
        let res = await this.$http.post(`/api/product/saveFavourableComment`, {
          grade: this.curStar,
          content: this.comments
        })
        if (res.returnCode == 2000) {
          this.$toast('submit success!')
          if (this.curStar >= 4) {
            this.toAppMethod('storeOpen')
          }
          setTimeout((res) => {
            this.$emit('update:show', false)
          }, 1000)
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
.google-feedback {
  position: fixed;
  z-index: 222;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 222;

  &-content {
    width: 335px;
    background: #ffffff;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    box-sizing: border-box;

    .title {
      margin-top: 90px;
      font-size: 15px;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
      text-align: center;
      margin-bottom: 24px;
    }

    .tips {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -100px;
      img {
        width: 335px;
      }
    }

    .close-btn {
      width: 30px;
      height: 30px;
      z-index: 9999;
      position: absolute;
      top: -85px;
      right: 15px;
    }
    .stars {
      display: flex;
      justify-content: center;
      margin-right: -20px;

      img {
        width: 34px;
        margin-right: 20px;
      }
    }
    .five-star {
      font-size: 12px;
      font-weight: 900;
      color: #999;
      line-height: 18px;
      word-break: break-word;
      margin-top: 20px;
    }

    textarea {
      width: 280px;
      height: 76px;
      border-radius: 4px;
      border: 1px solid #cccccc;
      padding: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      line-height: 18px;
      text-align: left;
      box-sizing: border-box;
      font-family: Roboto-Regular, Roboto;
      word-break: break-word;
      margin-top: 20px;
    }
    .close {
      position: absolute;
      bottom: -54px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
