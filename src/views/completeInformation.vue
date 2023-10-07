<template>
  <div class="information-frame content-area">
    <div class="step">
      <complete-step :actionIndex="actionIndex"></complete-step>
    </div>

    <div class="list-frame" v-for="(item, index) in list" :key="index">
      <div
        class="padding-20 row-space-between-center"
        :class="{
          active: item.actionIndex <= actionIndex,
        }"
      >
        <div class="row-direction">
          <div class="title">{{ item.title }}</div>
          <img class="lock-icon" src="@/assets/images/information/lock.png" />
        </div>
        <img
          class="down-icon"
          v-if="item.actionIndex < actionIndex"
          src="@/assets/images/gou.png"
        />
        <img
          v-else
          class="right-icon"
          :class="{ 'right-icon-transform': item.actionIndex === actionIndex }"
          src="@/assets/images/right-arrow.png"
        />
      </div>
      <div v-if="item.actionIndex === actionIndex" class="line" />
      <!-- 基本信息 -->
      <information
        v-if="item.actionIndex === 0 && actionIndex === 0"
        @BasicInformationEmit="BasicInformationEmit"
      />
      <!-- 联系人 -->
      <contacts
        v-if="item.actionIndex === 1 && actionIndex === 1"
        @contactsInfoEmit="contactsInfoEmit"
      />
      <!-- 身份证 -->
      <identity
        v-if="item.actionIndex === 2 && actionIndex === 2"
        ref="refIdentity"
        @identityEmit="identityEmit"
      />
      <!-- 银行卡 -->
      <completeBank
        v-if="item.actionIndex === 3 && actionIndex === 3"
        @chooseBankIdEmit="chooseBankIdEmit"
        @goToAddBankClick="goToAddBankClick"
      />
    </div>
    <!-- 都不禁用，点击判断 -->
    <div class="submit">
      <button class="bottom-submit-btn" @click="submit">
        {{ actionIndex === 2 ? "Next Step" : "Submit" }}
      </button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        Congratulations!
        <br />
        Your {{ submitCopywriting }} information has been verified
      </span>
    </div>
  </div>
</template>

<script>
import selectItem from "@/components/selectItem";
import completeStep from "@/components/completeStep.vue";
import information from "@/components/completeInformation/information";
import contacts from "@/components/completeInformation/contacts";
import identity from "@/components/completeInformation/identity";
import completeBank from "@/components/completeInformation/completeBank";
import * as ALL_ATTRS from "@/utils/constants";
import { mapState } from "vuex";

export default {
  components: {
    selectItem,
    completeStep,
    information,
    contacts,
    identity,
    completeBank,
  },
  data() {
    return {
      ALL_ATTRS,
      basicInformation: {}, // 基本信息
      contactsInfo: [], // 联系人信息
      chooseBankId: null, // 银行卡ID
      orderId: null,
      actionIndex: 0,
      submitSuccess: false,
      submitCopywriting: "personal",
      list: [
        {
          title: "Personal Info",
          actionIndex: 0,
        },
        {
          title: "Contacts Info",
          actionIndex: 1,
        },
        {
          title: "Identity Info",
          actionIndex: 2,
        },
        {
          title: "Payment method",
          actionIndex: 3,
        },
      ],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Complete information",
      backCallback: null,
    });
  },
  async mounted() {
    this.orderId = this.$route.query.orderId || null;
    this.actionIndex = +this.$route.query.actionIndex;
    this.eventTracker("basic_access");
    this.initInfoBackControl();
    await this.getAppMode();
  },
  computed: {
    ...mapState(["isAppChecked", "appMode"]),
  },
  methods: {
    canSubmit() {
      switch (this.actionIndex) {
        case 0:
          return (
            Object.values(this.basicInformation).filter((f) => !!f).length == 10
          );
        case 1:
          return this.contactsInfo.every(
            (e) => e.relation && e.mobile && e.name
          );
        case 2:
          return true;
        case 3:
          return !!this.chooseBankId;

        default:
          return false;
      }
    },
    // 基本信息
    BasicInformationEmit(v) {
      this.basicInformation = v;
    },
    // 联系人
    contactsInfoEmit(v) {
      console.log(v, "**** contactsInfoEmit");
      this.contactsInfo = v;
    },
    // 身份证
    identityEmit(orderId) {
      this.orderId = orderId;
      this.actionIndex = 3;
    },
    // 银行卡
    chooseBankIdEmit(bankId) {
      this.chooseBankId = bankId;
    },
    goToAddBankClick() {
      this.innerJump("addBank", { orderId: this.orderId }, true);
    },
    submit() {
      if (!this.canSubmit()) {
        this.$toast("Please complete all information first");
        return;
      }
      switch (this.actionIndex) {
        case 0: // 基本信息
          this.postBasicInfoSave();
          break;

        case 1: // 联系人
          this.postAddInfoSave();
          break;
        case 2: // 上传身份证
          if (this.$refs.refIdentity.length) {
            this.$refs.refIdentity[0].submit();
          }
          break;

        case 3:
          this.postBindRemittanceAccount();
          break;

        default:
          break;
      }
    },
    // 基本信息
    async postBasicInfoSave() {
      try {
        this.showLoading();
        this.eventTracker("basic_submit");
        let saveData = { ...this.basicInformation };
        if (!this.validateEmail(saveData.email)) {
          this.$toast("Please enter the correct email address.");
          return;
        }
        let data = await this.$http.post(`/api/user/basicInfo/save`, saveData);
        if (data.returnCode == 2000) {
          this.eventTracker("basic_submit_success");
          this.submitCopywriting = "personal";
          this.submitSuccess = true;
          setTimeout(() => {
            this.actionIndex = 1;
            this.submitSuccess = false;
          }, 1000);
        }
      } catch (error) {
        this.eventTracker("basic_submit_error");
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    // 联系人
    async postAddInfoSave() {
      try {
        this.showLoading();
        this.eventTracker("contact_submit");
        console.log(this.contactsInfo);
        let data = await this.$http.post(`/api/user/addInfo/save`, {
          contacts: this.contactsInfo,
        });
        if (data.returnCode === 2000) {
          this.eventTracker("contact_submit_success");
          this.submitCopywriting = "contacts";
          this.submitSuccess = true;
          setTimeout(() => {
            this.actionIndex = 2;
            this.submitSuccess = false;
          }, 2000);
        }
      } catch (error) {
        this.eventTracker("contact_submit_error");
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    // 银行卡
    async postBindRemittanceAccount() {
      try {
        this.showLoading();
        this.eventTracker("bank_submit");
        await this.$http.post(`/api/order/bindRemittanceAccount`, {
          orderId: this.orderId,
          remittanceAccountId: this.chooseBankId,
        });
        this.eventTracker("bank_submit_success");
        let appMode = await this.getAppMode();
        if (appMode.confirmType == 1) {
          // 需要进确认申请页
          this.innerJump("loanConfirm", { orderId: this.orderId }, true);
        } else {
          // 不需要进确认申请页
          this.innerJump(
            "loanSuccessMulti",
            {
              orderId: this.orderId,
              single: true,
              systemTime: new Date().getTime(),
            },
            true
          );
        }
      } catch (error) {
        this.eventTracker("bank_submit_error");
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    validateEmail(email) {
      // 邮箱验证正则
      var reg =
        /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      return reg.test(email);
    },
  },
};
</script>
<style lang="scss" scoped>
.information-frame {
  padding: 20px 24px;
  padding-bottom: 110px;
  background: #f9f9f9;
  padding-top: 0;
  flex: 1;

  .list-frame {
    background: #ffffff;
    border-radius: 14px;
    margin-top: 20px;

    .active {
      .title {
        color: #333333;
      }
      .lock-icon {
        display: none;
      }
    }

    .title {
      font-size: 18px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #999999;
      line-height: 26px;
    }

    .lock-icon {
      width: 14px;
      height: 16px;
      margin-left: 10px;
    }

    .right-icon {
      width: 14px;
      height: 14px;
    }

    .done-icon {
      width: 12px;
      height: 10px;
    }

    .right-icon-transform {
      transform: rotate(90deg);
    }

    .line {
      width: 100%;
      height: 2px;
      background: #e4e4e4;
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
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      width: 293px;
      height: 59px;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
    }
  }

  .submit {
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 10px;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
  }
  .step {
    padding-top: 10px;
    margin-bottom: 32px;
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
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 293px;
    height: 59px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
}
</style>
