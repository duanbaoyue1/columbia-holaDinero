import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/style/index.scss";
import "amfe-flexible";

// 注册全局mixins
import publicMixins from "@/utils/publicMixins";
import syncData from "@/utils/syncData";
import eventTrack from "@/utils/eventTrack";

Vue.mixin(publicMixins);
Vue.mixin(syncData);
Vue.mixin(eventTrack);

import request from "@/services";
Vue.prototype.$http = request;

Vue.config.productionTip = false;

import toast from "@/components/toast";
Vue.use(toast);
import loading from "@/components/loading";
Vue.use(loading);

import MessageBox from "@/components/message-box";
Vue.component("message-box", MessageBox);

import Vconsole from "vconsole";
if (process.env.MODE === "development") {
  new Vconsole();
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
