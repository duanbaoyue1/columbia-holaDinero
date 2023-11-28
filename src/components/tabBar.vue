<template>
  <!-- <div class="tab-bar row-space-between">
    <div
      class="row-center column-direction display-flex-1"
      v-for="item in tabList"
      :key="item.id"
      @click="tabClick(item)"
    >
      <m-icon
        :type="item.checked ? item.active : item.noActive"
        :width="40"
        :height="40"
      />
      <div
        class="title"
        :style="{ color: item.checked ? '#A05BF8' : '#999999' }"
      >
        {{ item.title }}
      </div>
    </div>
  </div> -->
  <van-tabbar route name="fade" v-if="$route.meta.showTab" @change="changeTab">
    <van-tabbar-item replace to="/home">
      <span>Préstamos</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/loans.png')
              : require('@/assets/images/loans-not.png')
          "
        />
      </template>
    </van-tabbar-item>

    <van-tabbar-item
      v-if="showRepayment"
      replace
      to="/repayment"
      :badge="repaymentNum > 0 ? repaymentNum : ''"
    >
      <span>Reembolsando</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/repayment.png')
              : require('@/assets/images/repayment-not.png')
          "
        />
      </template>
    </van-tabbar-item>

    <van-tabbar-item replace to="/mine">
      <span>Mi</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/me.png')
              : require('@/assets/images/me-not.png')
          "
        />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    showRepayment: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    window.tabChange = async (data) => {
      console.log("app 回调 tabChange", data);
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      this.innerJump(data.toH5Page, {}, true);
    };
    return {
      tabList: [
        {
          id: 1,
          path: "home",
          title: "Préstamos",
          active: "loans",
          noActive: "loans-not",
          badge: 0,
          checked: true,
        },
        {
          id: 2,
          path: "repayment",
          title: "Reembolsando",
          active: "repayment",
          noActive: "repayment-not",
          badge: 0,
          checked: false,
        },
        {
          id: 3,
          path: "mine",
          title: "Mi",
          active: "me",
          noActive: "me-not",
          badge: 0,
          checked: false,
        },
      ],
    };
  },
  computed: {
    ...mapState(["repaymentNum"]),
  },
  watch: {
    showRepayment: {
      handler(newVal) {
        console.log(newVal, "******* getRepaymentInfo");
        this.toAppMethod("getRepaymentInfo", {
          isRepayment: newVal,
          repaymentNumber: this.repaymentNum,
        });
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    tabClick(item) {
      this.tabList.forEach((f) => {
        if (item.id === f.id) {
          f.checked = true;
        } else {
          f.checked = false;
        }
      });
    },
    changeTab(i) {
      if (this.showRepayment) {
        if (i === 2) {
          this.h5ToAndroidPage();
        }
        return;
      }
      if (i === 1) {
        this.h5ToAndroidPage();
      }
    },
    h5ToAndroidPage() {
      this.toAppMethod("h5ToAndroidPage", {
        fromPage: "home",
        toPage: "mine",
        callback: "tabChange",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  width: 100%;
  height: 80px;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px -2px 16px 0px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 12px;
  font-family: Roboto, Roboto;
  font-weight: 500;
  color: #999999;
  line-height: 16px;
  margin-top: 4px;
}
.tab-ber-img {
  width: 40px;
  height: 40px;
}
</style>
