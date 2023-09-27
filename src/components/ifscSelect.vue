<template>
  <div class="content-wrapper">
    <ul class="nav">
      <li :class="{ active: curNav == 1 }" @click="toggleNav(1)">Bank</li>
      <li :class="{ active: curNav == 2 }" @click="toggleNav(2)">State</li>
      <li :class="{ active: curNav == 3 }" @click="toggleNav(3)">City</li>
      <li :class="{ active: curNav == 4 }" @click="toggleNav(4)">Branch</li>
    </ul>
    <ul class="items">
      <li
        v-for="item in banks"
        :class="{ active: classActive(item) }"
        :key="item.id"
        @click="chooseItem(item)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <div class="submit">
      <button
        class="bottom-submit-btn"
        :disabled="!choosedBranch"
        @click="complete"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // 查询所有的银行
    this.queryBanks()
  },
  computed: {
    classActive() {
      return (item) => {
        return (
          (this.curNav == 1 && this.choosedBank == item.id) ||
          (this.curNav == 2 && this.choosedState == item.id) ||
          (this.curNav == 3 && this.choosedCity == item.id) ||
          (this.curNav == 4 && this.choosedBranch == item.id)
        )
      }
    }
  },

  data() {
    return {
      curNav: 1,
      choosedBank: '',
      choosedState: '',
      choosedCity: '',
      choosedBranch: '',
      choosedBranchName: '',
      choosedIfsc: '',
      banks: [],
      states: [],
      cities: [],
      branches: []
    }
  },
  methods: {
    chooseItem(item) {
      if (this.curNav == 1) {
        this.choosedBank = item.id
        this.queryBanks(item.id)
      } else if (this.curNav == 2) {
        this.choosedState = item.id
        this.queryBanks(item.id)
      } else if (this.curNav == 3) {
        this.choosedCity = item.id
        this.queryBanks(item.id)
      } else if (this.curNav == 4) {
        this.choosedBranch = item.id
        this.choosedBranchName = item.name
        this.choosedIfsc = item.ifsc
      }
      if (this.curNav < 4) {
        setTimeout(() => {
          this.curNav++
        }, 500)
      }
    },
    async queryBanks(parentId) {
      parentId = parentId || ''
      // 查询所有的银行
      let data = await this.$http.post(`/api/remittance/remittanceBankList`, {
        parentId: parentId
      })
      this.banks = data.data.list
    },
    toggleNav(index) {
      if (index == 2 && !this.choosedBank) return
      if (index == 3 && !this.choosedState) return
      if (index == 4 && !this.choosedCity) return
      if (index == 1) {
        this.queryBanks()
      } else if (index == 2) {
        this.queryBanks(this.choosedBank)
      } else if (index == 3) {
        this.queryBanks(this.choosedState)
      } else {
        this.queryBanks(this.choosedCity)
      }
      this.curNav = index
    },
    complete() {
      this.$emit('complete', {
        choosedIfsc: this.choosedIfsc,
        choosedBank: this.choosedBank,
        choosedState: this.choosedState,
        choosedCity: this.choosedCity,
        choosedBank: this.choosedBank,
        choosedBranchName: this.choosedBranchName
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/parameters.scss';

.content-wrapper {
  height: 500px;
  background: #ffffff;
  position: relative;

  .nav {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    display: flex;
    position: fixed;
    height: 36px;
    right: 0;
    left: 0;
    box-sizing: border-box;
    justify-content: space-around;
    background: #fff;
    z-index: 2;
    border-radius: 18px;
    box-shadow: inset 0px 3px 4px 0px rgba(0, 0, 0, 0.14);

    li {
      width: 89px;
      height: 36px;
      font-size: 18px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333;
      border-radius: 18px;
      margin-left: -2px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active {
        color: #333;
        background: #fd973f;
        box-shadow: 0px 2px 6px 0px rgba(146, 72, 9, 0.4);
      }
    }
  }

  .items {
    position: absolute;
    top: 50px;
    bottom: 88px;
    left: 0;
    right: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    box-sizing: border-box;

    li {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999;
      margin-bottom: 30px;
      &:first-child {
        margin-top: 15px;
      }
      &.active {
        height: 40px;
        color: $themeColor;
        font-weight: 500;
        border-radius: 20px;
        border: 2px solid $themeColor;
        position: relative;
        &::after {
          position: absolute;
          content: ' ';
          height: 4px;
          left: 0;
          right: 0;
          bottom: -4px;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    padding-top: 10px;
  }
}
</style>
