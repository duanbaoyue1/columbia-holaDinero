<template>
  <div class="contacts-frame">
    <div
      v-for="(item, index) in familyContacts"
      :key="index + 'familyContacts'"
    >
      <div class="edit-area-header color-theme">
        Emergency Contact {{ index + 1 }}
      </div>
      <div class="edit-area">
        <div class="line-item">
          <label>Family Member</label>
          <select-item
            :items="RELATION_SHIPS"
            title="Family Member"
            :itemAttrs="index"
            @choose="chooseRelation"
          />
        </div>

        <div
          class="line-item phone-select-wrapper"
          @click="choosePhone('familyPhone', index)"
        >
          <label>Contact {{ index + 1 }} Phone No.</label>
          <div>
            <input
              id="familyPhone"
              v-model="item.mobile"
              disabled
              placeholder="Please select"
            />
            <img
              class="icon"
              src="@/assets/images/information/address-book.png"
            />
          </div>
        </div>
        <div class="line-item">
          <label>Contact {{ index + 1 }} Name</label>
          <input v-model="item.name" placeholder="Please enter" @input="emit" />
        </div>
      </div>

      <div
        class="line"
        v-if="friendContacts.length || familyContacts.length != index + 1"
      />
    </div>

    <div
      v-for="(item, index) in friendContacts"
      :key="index + 'friendContacts'"
    >
      <div class="edit-area-header color-theme">
        Emergency Contact {{ index + 1 + familyContacts.length }}
      </div>
      <div class="edit-area">
        <div
          class="line-item phone-select-wrapper"
          @click="choosePhone('friendPhone', index)"
        >
          <label>Friends Phone No.</label>
          <div>
            <input
              id="fiendPhone"
              v-model="item.mobile"
              disabled
              placeholder="Please select"
            />
            <img
              class="icon"
              src="@/assets/images/information/address-book.png"
            />
          </div>
        </div>
        <div class="line-item">
          <label>Friends Name</label>
          <input v-model="item.name" placeholder="Please enter" @input="emit" />
        </div>
      </div>

      <div class="line" v-if="friendContacts.length != index + 1" />
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/selectItem'
import { RELATION_SHIPS } from '@/utils/constants'
const FIRST_GET_PHONE_KEY = 'is-getted-phone'

export default {
  components: {
    selectItem
  },

  data() {
    window.choosePhoneCallback = (data) => {
      if (typeof data == 'string') {
        data = JSON.parse(data)
      }
      let { mobile, name } = data
      mobile = mobile.replace(/ /g, '')
      // 1. 验证号码是否有效
      if (mobile.length < 10 || mobile.length > 15) {
        this.showMessageBox({
          content:
            'The format of cell phone number is not correct, please choose again',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox()
          },
          iconPath: 'fail',
          showClose: false
        })
        return
      }
      // 2. 验证是否有重复的
      let currentPhone = [...this.familyContacts, ...this.friendContacts].map(
        (t) => t.mobile
      )
      if (currentPhone.includes(mobile)) {
        this.showMessageBox({
          content:
            'Duplicate cell phone number, please re-select another contact.',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox()
          },
          iconPath: 'repeat',
          showClose: false
        })
        return
      }
      if (this.lastPhoneType) {
        if (this.lastPhoneType == 'familyPhone') {
          this.familyContacts[this.lastPhoneIndex].mobile = mobile
          this.familyContacts[this.lastPhoneIndex].name = name
        } else {
          this.friendContacts[this.lastPhoneIndex].mobile = mobile
          this.friendContacts[this.lastPhoneIndex].name = name
        }
        this.emit()
      }
    }

    return {
      RELATION_SHIPS,
      canSubmit: true, // 是否可以提交
      submitSuccess: false,
      friendContacts: [],
      familyContacts: [],
      lastPhoneType: '',
      lastPhoneIndex: 0,
      saving: false
    }
  },
  mounted() {
    this.getAppContactsNum()
    this.eventTracker('contact_access')
  },
  methods: {
    async getAppContactsNum() {
      let familyContactsNum = 1,
        friendContactsNum = 1
      try {
        this.showLoading()
        let res = await this.$http.post(`/api/app/getAppContactsNum`)
        familyContactsNum = res.data.familyContactsNum
        friendContactsNum = res.data.friendContactsNum
      } catch (error) {
      } finally {
        this.familyContacts = Array.from(
          { length: familyContactsNum },
          (v, k) => k
        ).map((t) => {
          return { relation: '', mobile: '', name: '' }
        })
        this.friendContacts = Array.from(
          { length: friendContactsNum },
          (v, k) => k
        ).map((t) => {
          return { relation: 'Friends', mobile: '', name: '' }
        })
        this.emit()
        this.hideLoading()
      }
    },
    chooseRelation(data) {
      this.familyContacts[data.attr].relation = data.value
      this.emit()
    },
    choosePhone(type, index) {
      this.lastPhoneType = type
      this.lastPhoneIndex = index
      let isGettedPhone = localStorage.getItem(FIRST_GET_PHONE_KEY)
      if (!isGettedPhone) {
        localStorage.setItem(FIRST_GET_PHONE_KEY, 'true')
        this.showMessageBox({
          content:
            'Please make sure that you choose a real cell phone number, otherwise the money will not be released.',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox()
            this.toAppMethod('openMessage', {
              fuName: 'choosePhoneCallback'
            })
          },
          iconPath: 'correct',
          showClose: false
        })
      } else {
        this.toAppMethod('openMessage', {
          fuName: 'choosePhoneCallback'
        })
      }
    },
    emit() {
      this.$emit('contactsInfoEmit', [
        ...this.familyContacts,
        ...this.friendContacts
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-frame {
  padding-bottom: 30px;

  .line {
    height: 4px;
    background: #f9f9f9;
    margin-top: 30px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .edit-area-header {
    font-size: 16px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    line-height: 24px;
    padding: 0 20px;
    margin-top: 30px;
  }

  .edit-area {
    padding: 0 20px;
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
    }

    .line-item {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;

      label {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        flex-shrink: 0;
        margin-right: 10px;
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        text-align: right;
        padding: 0 0px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }

    .phone-select-wrapper {
      > div {
        display: flex;
        align-items: center;
        input {
          background: transparent;
        }
        img {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
