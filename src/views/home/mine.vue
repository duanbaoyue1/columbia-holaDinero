<template>
  <div id="mine" class="content-area">
    <div class="user">
      <img :src="require('@/assets/images/avatar.png')" />
      <span class="name">{{ userInfo.mobile | phoneHideFilter }}</span>
    </div>

    <div class="menu">
      <div @click="innerJump('orderList')">
        <div>
          <img class="icon" src="@/assets/images/all-orders.png" />
          All orders
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div
        v-if="userInfo.remittanceAccountAuth"
        @click="innerJump('receiptAccount')"
      >
        <div>
          <img class="icon" src="@/assets/images/receipt-account.png" />
          Receipt Account
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="innerJump('about')">
        <div>
          <img class="icon" src="@/assets/images/about-us.png" />
          About Us
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="goHelpCenter">
        <div>
          <img class="icon" src="@/assets/images/help-center.png" />
          Help Center
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="goComplain">
        <div>
          <div class="complaints">
            <img class="icon" src="@/assets/images/complaints.png" />
            <div v-if="showRedBot" class="polka-dot" />
          </div>
          Complaints
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="innerJump('settings')">
        <div>
          <img class="icon" src="@/assets/images/set-up.png" />
          Set Up
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="showDeleteConfirm" v-if="isTestAccount">
        <div>
          <img class="icon" src="@/assets/images/delete-account.png" />
          Delete Account
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>

      <div @click="logout">
        <div>
          <img class="icon" src="@/assets/images/log-out.png" />
          Log Out
        </div>
        <img class="right-arrow" src="@/assets/images/right-arrow.png" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isTestAccount: false, // 是否google测试账号
      showRedBot: false
    }
  },
  created() {
    this.setTabBar({
      show: false
    })
  },
  async mounted() {
    try {
      let res = await this.$http.post(`/api/user/mine`)
      this.isTestAccount = res?.data?.isTestAccount
      this.checkRedBot()
    } catch (error) {
      console.log(error)
    }
  },

  activated() {
    this.updateData()
    this.checkRedBot()
  },
  methods: {
    async checkRedBot() {
      try {
        let res = await this.$http.post(`/api/user/complaintRecordUnread`)
        if (res.returnCode == 2000) {
          this.showRedBot = res.data
        }
      } catch (error) {}
    },
    showDeleteConfirm() {
      this.showMessageBox({
        content:
          'After deleting the account, all information of the account will be erased, confirm to delete?',
        confirmBtnText: 'Let me think again',
        cancelBtnText: 'Confirm deletion',
        confirmCallback: () => {
          this.hideMessageBox()
        },
        cancelCallback: () => {
          this.toAppMethod('skipLogin')
        },
        iconPath: 'deleteAccount'
      })
    },
    async updateData() {
      this.showLoading()
      try {
        await this.getUserInfo()
      } catch (error) {
        console.log(error)
      } finally {
        this.hideLoading()
      }
    },
    goComplain() {
      this.innerJump('complainHome')
    },
    goHelpCenter() {
      this.innerJump('helpCenter')
    }
  }
}
</script>

<style lang="scss" scoped>
#mine {
  padding: 74px 24px 0;
  padding-bottom: 100px;

  .menu {
    width: 327px;
    background: #fff;
    border-radius: 16px;
    padding: 0 20px 30px;
    box-sizing: border-box;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 30px;

      > div {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;

        .icon {
          width: 20px;
          height: 20px;
          margin-right: 16px;
        }
      }
    }

    .right-arrow {
      width: 12px;
      height: 16px;
    }
  }

  .user {
    display: flex;
    font-size: 16px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-bottom: 24px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
  }

  .complaints {
    position: relative;

    .polka-dot {
      width: 8px;
      height: 8px;
      background: #ff4b3f;
      border-radius: 50%;
      position: absolute;
      top: 0;
      right: 17px;
    }
  }
}
</style>
