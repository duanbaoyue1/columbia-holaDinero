import Vue from "vue";
import VueRouter from "vue-router";
import layout from "../views/layout.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: layout,
    redirect: { path: "/home" },
    meta: {
      title: "",
      showTab: true, // 显示底部tabbar
    },
    children: [
      {
        path: "information",
        name: "information",
        component: () => import("../views/information.vue"),
        meta: {
          title: "Información básica",
        },
      },
      {
        path: "contacts",
        name: "contacts",
        component: () => import("../views/contacts.vue"),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "jumpLoading",
        name: "jumpLoading",
        component: () => import("../views/jumpLoading.vue"),
        meta: {
          title: "",
        },
      },
      {
        path: "completeBank",
        name: "completeBank",
        component: () => import("../views/completeBank.vue"),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "addBank",
        name: "addBank",
        component: () => import("../views/addBank.vue"),
        meta: {
          title: "Select Bank Account",
        },
      },
      {
        path: "loanSuccessMulti",
        name: "loanSuccessMulti",
        component: () => import("../views/loanSuccessMulti.vue"),
        meta: {
          title: "Loan Application",
        },
      },
      {
        path: "loanFail",
        name: "loanFail",
        component: () => import("../views/loanFail.vue"),
        meta: {
          title: "Loan Application",
        },
      },
      {
        path: "loanConfirm",
        name: "loanConfirm",
        component: () => import("../views/loanConfirm.vue"),
        meta: {
          title: "Loan Application",
          navReturnFFF: true,
        },
      },
      {
        path: "helpCenter",
        name: "helpCenter",
        component: () => import("../views/helpCenter.vue"),
        meta: {
          title: "Help Center",
        },
      },
      {
        path: "orderDetail",
        name: "orderDetail",
        component: () => import("../views/orderDetail.vue"),
        meta: {
          title: "Order Detail",
        },
      },
      {
        path: "deferDetail",
        name: "deferDetail",
        component: () => import("../views/deferDetail.vue"),
        meta: {
          title: "Deferment",
        },
      },
      {
        path: "deferHistory",
        name: "deferHistory",
        component: () => import("../views/deferHistory.vue"),
        meta: {
          title: "Deferment",
        },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../views/settings.vue"),
        meta: {
          title: "Set up",
        },
      },
      {
        path: "createPassword",
        name: "createPassword",
        component: () => import("../views/createPassword.vue"),
        meta: {
          title: "Create Password",
        },
      },
      {
        path: "retrievePassword",
        name: "retrievePassword",
        component: () => import("../views/retrievePassword.vue"),
        meta: {
          title: "Retrieve Password",
        },
      },
      {
        path: "privacy",
        name: "privacy",
        component: () => import("../views/privacy.vue"),
        meta: {
          title: "Privacy Policy",
        },
      },
      {
        path: "terms",
        name: "terms",
        component: () => import("../views/terms.vue"),
        meta: {
          title: "Terms of Services",
        },
      },
      {
        path: "identity",
        name: "identity",
        component: () => import("../views/identity.vue"),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "home",
        name: "home",
        component: () => import("../views/home/home.vue"),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "repayment",
        name: "repayment",
        component: () => import("../views/home/repayment.vue"),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "mine",
        name: "mine",
        component: () => import("../views/home/mine.vue"),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "orderList",
        name: "orderList",
        component: () => import("../views/orderList.vue"),
        meta: {
          title: "All orders",
        },
      },
      {
        path: "test",
        name: "test",
        component: () => import("../views/test.vue"),
        meta: {
          title: "test",
        },
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/notFound.vue"),
  },
  {
    path: "*", // 此处需特别注意至于最底部
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "hash",
  base: import.meta.env.BASE_URL, // 这个配置也很重要，否则会出现页面空白情况
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to, to.name, "**** to");
  console.log(from, from.name, "***** from");

  const pateTypes = store.getters.jumpPageTypes;
  const f = pateTypes.find((f) => f.path === to.name);
  // type：1：H5 2：安卓
  // type === 2 跳转安卓page
  if (f && f.path && f.type === 2) {
    // 是否在APP中
    if (typeof wjs === "undefined") {
      return next();
    }
    if (to.name !== "mine") {
      wjs["h5ToAndroidPage"](
        JSON.stringify({ toPage: to.name, fromPage: from.name })
      );
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
