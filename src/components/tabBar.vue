<template>
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
    return {};
  },
  computed: {
    ...mapState(["repaymentNum", "jumpPageTypes"]),
  },
  methods: {
    changeTab(i) {
      const pageType = this.jumpPageTypes.find((f) => f.path === "mine");
      if (i === 0) {
        this.h5ToAndroidPage("home", "home");
      }
      if (this.showRepayment) {
        if (i === 1) {
          this.h5ToAndroidPage("home", "repayment");
        }
        if (i === 2 && pageType && pageType.path && pageType.type === 2) {
          this.h5ToAndroidPage("home", "mine");
        }
        return;
      }
      if (i === 1 && pageType && pageType.path && pageType.type === 2) {
        this.h5ToAndroidPage("home", "mine");
      }
    },
    h5ToAndroidPage(from, to) {
      this.toAppMethod("h5ToAndroidPage", {
        fromPage: from,
        toPage: to,
        callback: "tabChange",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-ber-img {
  width: 40px;
  height: 40px;
}
</style>
