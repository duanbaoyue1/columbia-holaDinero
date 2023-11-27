import Vue from "vue";
import VueRouter from "vue-router";
import layout from "../views/layout.vue";

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
        path: "permissions",
        name: "Permissions",
        component: () =>
          import(
            /* webpackChunkName: "permissions" */ "../views/permissions.vue"
          ),
        meta: {
          title: "Permissions",
        },
      },
      {
        path: "information",
        name: "information",
        component: () =>
          import(
            /* webpackChunkName: "information" */ "../views/information.vue"
          ),
        meta: {
          title: "Información básica",
        },
      },
      {
        path: "contacts",
        name: "contacts",
        component: () =>
          import(/* webpackChunkName: "contacts" */ "../views/contacts.vue"),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "completeBank",
        name: "completeBank",
        component: () =>
          import(
            /* webpackChunkName: "completeBank" */ "../views/completeBank.vue"
          ),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "addBank",
        name: "addBank",
        component: () =>
          import(/* webpackChunkName: "add-bank" */ "../views/addBank.vue"),
        meta: {
          title: "Select Bank Account",
        },
      },
      {
        path: "loanSuccessMulti",
        name: "loanSuccessMulti",
        component: () =>
          import(
            /* webpackChunkName: "loanSuccessMulti" */ "../views/loanSuccessMulti.vue"
          ),
        meta: {
          title: "Loan Application",
        },
      },
      {
        path: "loanFail",
        name: "loanFail",
        component: () =>
          import(/* webpackChunkName: "loanFail" */ "../views/loanFail.vue"),
        meta: {
          title: "Loan Application",
        },
      },
      {
        path: "paymentFail",
        name: "paymentFail",
        component: () =>
          import(
            /* webpackChunkName: "paymentFail" */ "../views/paymentFail.vue"
          ),
        meta: {
          title: "Solicitud de préstam",
          backgroundFFF: true, // 页面白色
        },
      },
      {
        path: "loanConfirm",
        name: "loanConfirm",
        component: () =>
          import(
            /* webpackChunkName: "loanConfirm" */ "../views/loanConfirm.vue"
          ),
        meta: {
          title: "Loan Application",
          navReturnFFF: true,
        },
      },
      {
        path: "helpCenter",
        name: "helpCenter",
        component: () =>
          import(
            /* webpackChunkName: "helpCenter" */ "../views/helpCenter.vue"
          ),
        meta: {
          title: "Help Center",
        },
      },
      {
        path: "orderDetail",
        name: "orderDetail",
        component: () =>
          import(
            /* webpackChunkName: "orderDetail" */ "../views/orderDetail.vue"
          ),
        meta: {
          title: "Order Detail",
        },
      },
      {
        path: "deferDetail",
        name: "deferDetail",
        component: () =>
          import(
            /* webpackChunkName: "deferDetail" */ "../views/deferDetail.vue"
          ),
        meta: {
          title: "Deferment",
        },
      },

      {
        path: "deferHistory",
        name: "deferHistory",
        component: () =>
          import(
            /* webpackChunkName: "deferHistory" */ "../views/deferHistory.vue"
          ),
        meta: {
          title: "Deferment",
        },
      },
      {
        path: "settings",
        name: "settings",
        component: () =>
          import(/* webpackChunkName: "settings" */ "../views/settings.vue"),
        meta: {
          title: "Set up",
        },
      },
      {
        path: "createPassword",
        name: "createPassword",
        component: () =>
          import(
            /* webpackChunkName: "createPassword" */ "../views/createPassword.vue"
          ),
        meta: {
          title: "Create Password",
        },
      },
      {
        path: "retrievePassword",
        name: "retrievePassword",
        component: () =>
          import(
            /* webpackChunkName: "retrieve-password" */ "../views/retrievePassword.vue"
          ),
        meta: {
          title: "Retrieve Password",
        },
      },
      {
        path: "privacy",
        name: "privacy",
        component: () =>
          import(/* webpackChunkName: "privacy" */ "../views/privacy.vue"),
        meta: {
          title: "Privacy Policy",
        },
      },
      {
        path: "terms",
        name: "terms",
        component: () =>
          import(/* webpackChunkName: "terms" */ "../views/terms.vue"),
        meta: {
          title: "Terms of Services",
        },
      },
      {
        path: "identity",
        name: "identity",
        component: () =>
          import(/* webpackChunkName: "identity" */ "../views/identity.vue"),
        meta: {
          title: "Complete information",
        },
      },
      {
        path: "complainHome",
        name: "complainHome",
        component: () =>
          import(
            /* webpackChunkName: "complainHome" */ "../views/complainHome.vue"
          ),
        meta: {
          title: "Complaints",
        },
      },
      {
        path: "complainList",
        name: "complainList",
        component: () =>
          import(
            /* webpackChunkName: "complainList" */ "../views/complainList.vue"
          ),
        meta: {
          title: "Complaint record",
        },
      },
      {
        path: "complainEdit",
        name: "complainEdit",
        component: () =>
          import(
            /* webpackChunkName: "complainEdit" */ "../views/complainEdit.vue"
          ),
        meta: {
          title: "Complaints",
        },
      },
      {
        path: "home",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/home/home.vue"),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "repayment",
        name: "repayment",
        component: () =>
          import(
            /* webpackChunkName: "repayment" */ "../views/home/repayment.vue"
          ),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "mine",
        name: "mine",
        component: () =>
          import(/* webpackChunkName: "mine" */ "../views/home/mine.vue"),
        meta: {
          title: "",
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: "orderList",
        name: "orderList",
        component: () =>
          import(/* webpackChunkName: "orderList" */ "../views/orderList.vue"),
        meta: {
          title: "All orders",
        },
      },
      {
        path: "testb",
        name: "testb",
        component: () =>
          import(/* webpackChunkName: "testb" */ "../views/testb.vue"),
        meta: {
          title: "testb",
        },
      },
    ],
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/notFound.vue"),
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
  console.log(to, "**** to");
  console.log(from, "***** from");
  next();
});

export default router;
