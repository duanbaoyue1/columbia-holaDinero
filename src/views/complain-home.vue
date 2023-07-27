<template>
  <div class="complain-home content-area">
    <div class="head">Select a feedback agency</div>
    <div class="select">
      <button @click="changeType('EasyMoney')">EasyMoney</button>
      <button @click="changeType('RBI')">RBI</button>
      <button @click="changeType('National Consumer Helpline')">National Consumer Helpline</button>
    </div>
    <div class="warm-tips">
      <div class="head">Warm Tips</div>
      <div>The system will send the complaint case to the selected complaint agency, and the agency will process it within 7 days, please wait patiently.</div>
    </div>

    <div class="actions">
      <a @click="goComplainRecord" :class="{ 'show-red': showRedBot }">Complaint record</a>
    </div>

    <Transition>
      <complain-question v-show="showQuestion" :show.sync="showQuestion" @choose="chooseQuestion"></complain-question>
    </Transition>
  </div>
</template>

<script>
import ComplainQuestion from '@/components/complain-question.vue';

export default {
  components: {
    ComplainQuestion,
  },
  data() {
    return {
      showQuestion: false,
      type: '',
      question: '',
      showRedBot: false,
    };
  },
  mounted() {
    this.checkRedBot();
  },
  methods: {
    async checkRedBot() {
      try {
        let res = await this.$http.post(`/api/user/complaintRecordUnread`);
        if (res.returnCode == 2000) {
          this.showRedBot = res.data;
        }
      } catch (error) {}
    },
    changeType(type) {
      this.type = type;
      this.showQuestion = true;
    },
    goComplainRecord() {
      this.innerJump('complain-list');
    },
    chooseQuestion(question) {
      this.question = question;
      this.innerJump('complain-edit', { type: this.type, question: this.question });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.complain-home {
  padding: 20px;

  .head {
    margin-top: 30px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 26px;
  }

  .select {
    button {
      width: 320px;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #e4e4e4;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      margin-top: 20px;
    }
  }

  .warm-tips {
    margin-top: 50px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
    word-break: break-word;
    .head {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      margin-bottom: 10px;
    }
  }

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
    a {
      font-size: 14px;
      font-weight: 500;
      color: #1143a4;
      line-height: 18px;
      text-decoration: underline;
      position: relative;
      &.show-red {
        &::after {
          position: absolute;
          content: ' ';
          right: -8px;
          top: 4px;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          background: red;
        }
      }
    }
  }
}
</style>
