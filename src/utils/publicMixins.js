import { mapState, mapActions } from "vuex";
import { ImagePreview } from "vant";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "appGlobal",
      "userInfo",
      "tabBar",
      "appMode",
      "eventTrackerActionCnt",
      "eventTrackStartTime",
    ]),
  },
  filters: {
    phoneHideFilter(item) {
      if (!item) return "";
      return `${item.slice(0, 3)}****${item.slice(-3)}`;
    },
    // 千位转化
    formatMonet(num) {
      if (!num) num = 0;
      let str = num.toString().replace(/,/g, "");
      let integer = str.split(".")[0]; //获取整数位
      let decimal = str.split(".")[1]; //获取小数
      let res = integer.replace(/(?!^)(?=(\d{3})+$)/g, ",");
      if (decimal) {
        return `${res}.${decimal}`;
      }
      return res;
    },
  },
  beforeRouteLeave(to, from, next) {
    this.hideLoading();
    this.toAppMethod("holdUp", { isInterception: false });
    next();
  },
  methods: {
    ...mapActions([
      "showMessageBox",
      "hideMessageBox",
      "setTabBar",
      "setAppMode",
      "setRepaymentNum",
      "updateToken",
      "setEventTrackerActionCnt",
      "setEventTrackStartTime",
    ]),
    async getUserInfo() {
      let data = await this.$http.post(`/api/user/info`);
      let userInfo = data.data;
      console.log("set user info", userInfo);
      this.$store.commit("setUserInfo", userInfo);
      return userInfo;
    },
    checkInApp() {
      return typeof wjs != "undefined";
    },
    initInfoBackControl() {
      window.infoBtnCallBack = () => {
        this.showMessageBox({
          content: "¡Espere, todavía queda un paso para obtener el dinero!",
          confirmBtnText: "OK",
          cancelBtnText: "Renunciar",
          class: "back-control",
          confirmCallback: () => {
            this.hideMessageBox();
          },
          cancelCallback: () => {
            this.hideMessageBox();
            this.goAppBack();
          },
          iconPath: "Information-return",
        });
      };
      this.setTabBar({
        backCallback: window.infoBtnCallBack,
      });
      this.toAppMethod("holdUp", {
        isInterception: true,
        fuName: "infoBtnCallBack",
      });
    },
    previewImg(imgs, startIndex) {
      if (!imgs || !imgs.length || startIndex < 0) return;
      ImagePreview({
        images: imgs,
        startPosition: startIndex,
      });
    },
    logout() {
      this.toAppMethod("returnLogin");
    },
    innerJump(path, query, replace = false) {
      query = query || {};
      query.appChecked = true;
      if (replace) {
        this.$router.replace({ name: path, query: query });
      } else {
        this.$router.push({ name: path, query: query });
      }
    },
    async getAppMode() {
      try {
        let data = await this.$http.post(`/api/product/appMaskModel`);
        let appMode = data.data;
        this.setAppMode(appMode);
        return appMode;
      } catch (error) {
        return {};
      }
    },
    openWebview(url, type = 0) {
      this.toAppMethod("inFreshPage", { path: url, type: type });
    },
    async getOrderRelateUrl(orderId) {
      try {
        let data = await this.$http.post(`/api/order/getRepaymentUrl`, {
          orderId: orderId,
        });
        return data.data;
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    // 和H5交互
    toAppMethod(name, params = {}) {
      if (!this.checkInApp()) return;
      try {
        console.log("start method:", name);
        console.log("params:", JSON.stringify(params));
        wjs[name](JSON.stringify(params));
        return true;
      } catch (error) {
        console.log("no such method:", name);
        return false;
      }
    },
    // app埋点
    eventTracker(key) {
      console.log("app埋点：", key);
      this.toAppMethod("afEventLog", { key: key });
    },
    goHome() {
      this.innerJump("home", {}, true);
    },
    goAppBack() {
      let prevPage = window.location.href;
      window.history.go(-1);
      // 如果500ms没有跳转成功则去首页
      setTimeout(function () {
        if (window.location.href == prevPage) {
          console.log("on goAppBack not go prev");
          this.goHome();
        }
      }, 500);
    },
    getAssetsImages(path) {
      return new URL(`../assets/images/${path}.png`, import.meta.url).href;
    },
  },
};
