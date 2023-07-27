<template>
  <div class="add-bank content-area">
    <div class="edit-area">
      <div class="line-item">
        <div class="label">Name</div>
        <input v-model="userInfo.panName" disabled placeholder="Please enter your name" />
      </div>
      <div class="line-item">
        <div class="label">
          <span>IFSC Code</span>
          <span class="color-red" @click="showIfsc = true">Dont't remember your IFSC?</span>
        </div>
        <input v-model="editData.ifsc" autocomplete="off" maxlength="11" onKeyUp="value=value.replace(/[\W]/g,'')" placeholder="Please enter IFSC code" />
      </div>
      <div class="line-item">
        <div class="label">Account Number</div>
        <input v-model="editData.accountNumber" placeholder="Please enter your account number" />
      </div>
      <div class="line-item">
        <div class="label">Confirm Account Number</div>
        <input v-model="editData.accountNumberConfirm" placeholder="Please enter account number again" />
      </div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Submit</button>
    </div>
    <van-action-sheet v-model="showIfsc" title="Select Your IFSC" close-on-click-action>
      <div class="pop-content">
        <ifsc-select @complete="completeIfsc" />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import ifscSelect from '@/components/ifsc-select.vue';
export default {
  components: {
    ifscSelect,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length >= 3;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Select Bank Account',
    });
  },
  data() {
    return {
      showIfsc: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {
        ifsc: '',
      },
      saving: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    completeIfsc(data) {
      this.editData.ifsc = data.choosedIfsc;
      this.showIfsc = false;
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('bank_add_submit');
        if (this.editData.accountNumber != this.editData.accountNumberConfirm) {
          this.$toast('Account number is not consistent');
          return;
        }
        let saveData = { ...this.editData };
        saveData.name = this.userInfo.panName;
        delete saveData.accountNumberConfirm;

        if (saveData.ifsc.length != 11) {
          this.$toast('Please enter correct IFSC');
          return;
        }
        if (saveData.accountNumber.length < 7 || saveData.accountNumber.length > 22) {
          this.$toast('Please enter correct account number');
          return;
        }
        let data = await this.$http.post(`/api/remittance/addRemittanceAccount`, saveData);
        if (data.returnCode == 2000) {
          this.innerJump('complete-bank', this.$route.query, true);
        }
        this.eventTracker('bank_add_submit_success');
      } catch (error) {
        this.eventTracker('bank_add_submit_error');
        this.$toast(error.message);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-bank {
  padding: 10px 20px;
  padding-bottom: 110px;

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .edit-area {
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .line-item {
      font-size: 14px;
      margin-top: 23px;
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        .color-red {
          color: #ff4b3f !important;
          font-size: 14px;
        }
      }
      input {
        width: 100%;
        height: 50px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        background: transparent;
      }
    }
  }
}
</style>
