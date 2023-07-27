<template>
  <div class="content-area">
    <div class="no-data" v-if="!loading && !lists.length">
      <img :src="require('@/assets/img/complain/No Order@2x.png')" />
      No record
    </div>
    <div class="complains" v-else-if="!loading">
      <div class="complains-item" v-for="item in lists" :key="item.id">
        <div class="head">
          <span>No.{{ item.id }}</span>
          <span>{{ item.createTime }}</span>
        </div>
        <div class="content">
          <div class="flex-between">
            <span>Feedback agency</span>
            <span>{{ item.feedbackMechanism }}</span>
          </div>
          <div class="flex-between">
            <span>Type of question</span>
            <span>{{ item.problemType }}</span>
          </div>
          <div class="questions">
            <div>Question Details</div>
            <div class="question">{{ item.problemContent }}</div>
          </div>
          <div class="imgs" v-if="item.imgs">
            <div class="img" v-for="(img, index) in item.imgs" :key="img" :style="{ backgroundImage: 'url(' + img + ')' }" @click="previewImg(item.imgs, index)"></div>
          </div>
        </div>
        <div class="status" :class="{ success: item.submitStatus == 1 }">{{ statusMsg(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      lists: [],
    };
  },
  
  computed: {
    statusMsg() {
      return item => {
        return item.submitStatus == 0 ? `Your complaint is being sent to ${item.feedbackMechanism}, please be patient` : `Your complaint has been received and processed by ${item.feedbackMechanism}`;
      };
    },
  },

  mounted() {
    this.getLists();
  },

  methods: {
    async getLists() {
      this.loading = true;
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/user/complaintRecord`);
        this.lists = (res.data.list || []).map(t => {
          t.imgs = [];
          if (t.firstImageBase64Src) {
            t.imgs.push(t.firstImageBase64Src);
          }
          if (t.secondImageBase64Src) {
            t.imgs.push(t.secondImageBase64Src);
          }
          if (t.thirdImageBase64Src) {
            t.imgs.push(t.thirdImageBase64Src);
          }
          return t;
        });
      } catch (error) {
      } finally {
        this.hideLoading();
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.no-data {
  padding-top: 100px;
  font-size: 16px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  text-align: center;
  img {
    display: block;
    width: 120px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}

.complains {
  &-item {
    padding: 30px 20px;

    border-bottom: 6px solid #f4f4f4;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0px;
    }

    .head {
      display: flex;
      margin-bottom: 10px;
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      justify-content: space-between;
    }
    .content {
      border-radius: 14px;
      border: 1px solid #cccccc;
      padding: 20px;
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 18px;

      .flex-between {
        align-items: flex-start;
        margin-bottom: 10px;
        span {
          &:first-child {
            white-space: nowrap;
          }
          &:nth-child(2) {
            margin-left: 20px;
          }
        }
      }
      .questions {
        .question {
          margin-top: 10px;
        }
      }

      .imgs {
        margin-top: 10px;
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
        }
      }
    }

    .status {
      background: #fff9ec;
      border-radius: 4px;
      font-size: 12px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #ffbc41;
      line-height: 18px;
      padding: 10px;
      margin-top: 20px;
      word-break: break-word;
      &.success {
        color: #04ca1c;
        background: #e5fae8;
      }
    }
  }
}
</style>
