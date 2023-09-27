<template>
  <div>
    <div class="header-frame">
      <img class="logo" src="@/assets/images/agreement/help-center.png" />
    </div>
    <div class="content-frame">
      <div class="help-frame">
        <div class="row-flex">
          <div class="top-title">Working Hours</div>
          <div class="top-content">Monday to Friday (9am - 7pm)</div>
        </div>
        <div class="row-flex margin-top-24">
          <div class="top-title">E-mail</div>
          <div class="top-content">CreditParkcs01@outlook.com</div>
        </div>
      </div>
      <div class="title-14 margin-top-30">How fast will I get my loan?</div>
      <div class="title-12 margin-top-10">
        Your loan is generally transferred instantly as soon as all your
        documents are verified. In order to process your loan quickly, we advise
        you to upload the necessary documents in the necessary formats and make
        sure they are clear and legible.
      </div>
      <div class="title-14 margin-top-30">
        Can I cancel my loan application?
      </div>
      <div class="title-12 margin-top-10">
        Once a loan application is submitted, it will be processed automatically
        and cannot be cancelled. If you have any questions, please contact
        customer service.
      </div>
      <div class="title-14 margin-top-30">Can I repay early?</div>
      <div class="title-12 margin-top-10">
        Absolutely, paying in advance will help boost your credit score and
        unlock a higher limit so you'll be able to borrow more money next time.
      </div>
      <div class="title-14 margin-top-30">
        My loan application was rejected, why?
      </div>
      <div class="title-12 margin-top-10">
        Hello, the approval/rejection of a loan application is entirely at the
        discretion of the product provider, which means that your credit score
        is not high enough to meet the review requirements for the time being.
        If necessary, we recommend that you reapply at an interval of about 7
        days.
      </div>
      <div class="title-14 margin-top-30">
        What are the consequences of an overdue order?
      </div>
      <div class="title-12 margin-top-10">
        Hello, orders overdue will be charged extra penalty, and will affect
        your personal credit score, we recommend that you settle the payment as
        soon as possible so as not to affect your subsequent use, the specific
        bill and record clear you to APP page display shall prevail.
      </div>
    </div>

    <div class="actions">
      <a class="color-theme" @click="goComplain"
        >I have a problem to complain</a
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: 'CreditParkcs01@outlook.com'
    }
  },
  mounted() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: true,
      title: ''
    })
    setTimeout(async () => {
      try {
        let user = await this.getUserInfo()
        if (parseInt(user.id) % 2 == 1) {
          this.feedEmail = 'CreditParkcs02@outlook.com'
        }
      } catch (error) {}
    }, 200)
  },

  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, {
        ...this.questions[index],
        showAnswer: !this.questions[index].showAnswer
      })
    },
    goComplain() {
      this.innerJump('complainHome')
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    text-decoration: underline;
  }
}

.header-frame {
  width: 253px;
  margin: 0 auto;
}
.logo {
  width: 100%;
  margin-top: 62px;
}
.content-frame {
  word-break: break-word;
  padding: 0 20px;
  margin: 20px 0 70px 0;
}
.title-12 {
  font-size: 12px;
  font-family: Roboto-Bold, Roboto;
  font-weight: 400;
  color: #333;
  line-height: 16px;
}
.title-14 {
  font-size: 14px;
  font-family: Roboto-Bold, Roboto;
  font-weight: 900;
  color: #333;
  line-height: 18px;
}
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-24 {
  margin-top: 24px;
}
.margin-top-30 {
  margin-top: 30px;
}
.top-title {
  font-size: 12px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
.top-content {
  font-size: 14px;
  font-family: Roboto-Black, Roboto;
  font-weight: 900;
  color: #000000;
  line-height: 20px;
}
.help-frame {
  position: relative;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
}
.row-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
