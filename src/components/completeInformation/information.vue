<template>
  <div class="edit-area">
    <div class="line-item">
      <label>Email</label>
      <input
        v-model="editData.email"
        placeholder="Please enter"
        @input="emit"
      />
    </div>

    <div class="line-item">
      <label>Gender</label>
      <select-item
        :items="ALL_ATTRS.GENDER"
        title="Gender"
        itemAttrs="gender"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Educational Qualification</label>
      <select-item
        :items="ALL_ATTRS.EDUCATION"
        title="Educational Qualification"
        itemAttrs="education"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Occupation</label>
      <select-item
        :items="ALL_ATTRS.OCCUPATION"
        title="Occupation"
        itemAttrs="occupation"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Salary Range</label>
      <select-item
        :items="ALL_ATTRS.SALARY"
        title="Salary Range"
        itemAttrs="monthlyIncome"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Marital Status</label>
      <select-item
        :items="ALL_ATTRS.MARITAL_STATUS"
        title="Marital Status"
        itemAttrs="marital"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Loan Purpose</label>
      <select-item
        :items="ALL_ATTRS.LOAN_PURPOSE"
        title="Loan Purpose"
        width="280"
        itemAttrs="loanPurpose"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Type of Accommodation</label>
      <select-item
        :items="ALL_ATTRS.ACCOMMODATION"
        title="Contacts Info"
        itemAttrs="houseType"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Number of Children</label>
      <select-item
        :items="ALL_ATTRS.CHILDREN"
        title="Number of Children"
        itemAttrs="childNum"
        @choose="chooseEditData"
      />
    </div>
    <div class="line-item">
      <label>Pay Method</label>
      <select-item
        :items="ALL_ATTRS.PAY_METHOD"
        title="Pay Method"
        itemAttrs="incomeWay"
        @choose="chooseEditData"
      />
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/selectItem'
import * as ALL_ATTRS from '@/utils/constants'

export default {
  components: {
    selectItem
  },
  data() {
    return {
      ALL_ATTRS,
      editData: {
        email: ''
      }
    }
  },
  mounted() {
    this.eventTracker('basic_access')
  },
  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value)
      this.emit()
    },
    emit() {
      this.$emit('BasicInformationEmit', this.editData)
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-area {
  padding: 0 20px 30px;
  .head {
    font-size: 14px;
    color: #000;
    line-height: 18px;
  }

  .line-item {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    &:last-child {
      border-bottom: none;
    }
    label {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 18px;
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
}
</style>
