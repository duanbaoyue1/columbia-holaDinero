import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messageBox: {
      show: false,
      messageInfo: {},
    },
    appGlobal: {
      appName: "holaDinero",
      token: "63fdfd55e4b0f6a603fac657",
      appVersionCode: 1000, // app版本号
      mobileType: "2", // 手机类型
      userId: "", // 用户id
      afId: "", // afid
      gaId: "", // gaid
      gps: "", // gps坐标
      gpsAddress: "", // gps地址
      channelCode: "google", // 渠道号
      androidId: "",
    },
    tabBar: {
      show: true,
      title: "",
      transparent: false,
      fixed: false,
      backCallback: null,
    },
    repaymentNum: 0,
    appMode: {},
    userInfo: {},
    isAppChecked: true, // 是否已经较验在app中
    eventTrackStartTime: 0,
    eventTrackerActionCnt: 0,
    jumpPageTypes: localStorage.getItem("jump-page-types") // 页面类型
      ? JSON.parse(localStorage.getItem("jump-page-types"))
      : [],
  },
  mutations: {
    setAppGlobal(state, data) {
      state.appGlobal = {
        ...state.appGlobal,
        ...data,
      };
      localStorage.setItem("app-local", JSON.stringify(data));
    },
    showMessageBox(state, data) {
      state.messageBox = {
        show: true,
        messageInfo: data,
      };
    },
    hideMessageBox(state, data) {
      state.messageBox = {
        show: false,
        messageInfo: state.messageBox.messageInfo,
      };
    },
    setUserInfo(state, data) {
      state.userInfo = {
        ...state.userInfo,
        ...data,
      };
    },
    setAppChecked(state, data) {
      sessionStorage.setItem("app-checked", true);
      state.isAppChecked = data;
    },
    setTabBar(state, data) {
      if (!data.backCallback) {
        data.backCallback = null;
      }
      state.tabBar = {
        ...state.tabBar,
        ...data,
      };
    },
    setAppMode(state, data) {
      state.appMode = data;
    },
    setEventTrackerActionCnt(state, data) {
      if (data === 0) {
        state.eventTrackerActionCnt = 0;
        return;
      }
      state.eventTrackerActionCnt += 1;
    },
    setEventTrackStartTime(state) {
      state.eventTrackStartTime = new Date().getTime();
    },
    setRepaymentNum(state, data) {
      state.repaymentNum = data;
    },
    setJumpPageTypes(state, data) {
      state.jumpPageTypes = data;
      localStorage.setItem("jump-page-types", JSON.stringify(data));
    },
  },
  getters: {
    appGlobal: (state) => state.appGlobal,
    userInfo: (state) => state.userInfo,
    isAppChecked: (state) => state.isAppChecked,
    tabBar: (state) => state.tabBar,
    appMode: (state) => state.appMode,
    repaymentNum: (state) => state.repaymentNum,
    jumpPageTypes: (state) => state.jumpPageTypes,
  },
  actions: {
    async setAppGlobal({ commit }, data) {
      commit("setAppGlobal", data);
    },
    async showMessageBox({ commit }, data) {
      commit("showMessageBox", data);
    },
    async hideMessageBox({ commit }, data) {
      commit("hideMessageBox", data);
    },
    async setUserInfo({ commit }, data) {
      commit("setAppGlobal", data);
    },
    async setAppChecked({ commit }, data) {
      commit("setAppChecked", data);
    },
    async updateToken({ commit }, data) {
      commit("setAppGlobal", data);
    },
    async setTabBar({ commit }, tabBar) {
      commit("setTabBar", tabBar);
    },
    async setAppMode({ commit }, appMode) {
      commit("setAppMode", appMode);
    },
    async setEventTrackerActionCnt({ commit }, data) {
      commit("setEventTrackerActionCnt", data);
    },
    async setEventTrackStartTime({ commit }, data) {
      commit("setEventTrackStartTime", data);
    },
    async setRepaymentNum({ commit }, repaymentNum) {
      commit("setRepaymentNum", repaymentNum);
    },
    async setJumpPageTypes({ commit }, data) {
      commit("setJumpPageTypes", data);
    },
  },
});
