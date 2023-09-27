import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '../views/layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: layout,
    redirect: { path: '/home' },
    meta: {
      title: '',
      showTab: true // 显示底部tabbar
    },
    children: [
      {
        path: 'completeInformation',
        name: 'completeInformation',
        component: () => import('../views/completeInformation.vue'),
        meta: {
          title: 'Complete information',
          backgroundFFF: true
        }
      },
      {
        path: 'addBank',
        name: 'addBank',
        component: () => import('../views/addBank.vue'),
        meta: {
          title: 'Select Bank Account',
          backgroundFFF: true
        }
      },
      {
        path: 'receiptAccount',
        name: 'receiptAccount',
        component: () => import('../views/receiptAccount.vue'),
        meta: {
          title: 'Receipt Account'
        }
      },
      {
        path: 'loanSuccessMulti',
        name: 'loanSuccessMulti',
        component: () => import('../views/loanSuccessMulti.vue'),
        meta: {
          title: 'Loan Application'
        }
      },
      {
        path: 'loanFail',
        name: 'loanFail',
        component: () => import('../views/loanFail.vue'),
        meta: {
          title: 'Loan Application'
        }
      },
      {
        path: 'loanConfirm',
        name: 'loanConfirm',
        component: () => import('../views/loanConfirm.vue'),
        meta: {
          title: 'Loan Application'
        }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/about.vue'),
        meta: {
          title: 'About us'
        }
      },
      {
        path: 'helpCenter',
        name: 'helpCenter',
        component: () => import('../views/helpCenter.vue'),
        meta: {
          title: 'Help Center'
        }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('../views/orderDetail.vue'),
        meta: {
          title: 'Order Detail',
          backgroundFFF: true
        }
      },
      {
        path: 'utr',
        name: 'utr',
        component: () => import('../views/utr.vue'),
        meta: {
          title: 'UTR'
        }
      },
      {
        path: 'deferHistory',
        name: 'deferHistory',
        component: () => import('../views/deferHistory.vue'),
        meta: {
          title: 'Deferment'
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/settings.vue'),
        meta: {
          title: 'Set up',
          backgroundFFF: true
        }
      },
      {
        path: 'createPassword',
        name: 'createPassword',
        component: () => import('../views/createPassword.vue'),
        meta: {
          title: 'Create Password'
        }
      },
      {
        path: 'retrievePassword',
        name: 'retrievePassword',
        component: () => import('../views/retrievePassword.vue'),
        meta: {
          title: 'Retrieve Password'
        }
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import('../views/privacy.vue'),
        meta: {
          title: 'Privacy Policy'
        }
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import('../views/terms.vue'),
        meta: {
          title: 'Terms of Services'
        }
      },
      {
        path: 'complainHome',
        name: 'complainHome',
        component: () => import('../views/complainHome.vue'),
        meta: {
          title: 'Complaints'
        }
      },
      {
        path: 'complainList',
        name: 'complainList',
        component: () => import('../views/complainList.vue'),
        meta: {
          title: 'Complaint record'
        }
      },
      {
        path: 'complainEdit',
        name: 'complainEdit',
        component: () => import('../views/complainEdit.vue'),
        meta: {
          title: 'Complaints'
        }
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/home.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true // 显示底部tabbar
        }
      },
      {
        path: 'repayment',
        name: 'repayment',
        component: () => import('../views/home/repayment.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true // 显示底部tabbar
        }
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import('../views/home/mine.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true // 显示底部tabbar
        }
      },
      {
        path: 'orderList',
        name: 'orderList',
        component: () => import('../views/orderList.vue'),
        meta: {
          title: 'All orders',
          backgroundFFF: true
        }
      },
      {
        path: 'orderDeferment',
        name: 'orderDeferment',
        component: () => import('../views/orderDeferment.vue'),
        meta: {
          title: 'Deferment'
        }
      },
      {
        path: 'testb',
        name: 'testb',
        component: () => import('../views/testb.vue'),
        meta: {
          title: 'testb'
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound.vue')
  },
  {
    path: '*', // 此处需特别注意至于最底部
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: import.meta.env.BASE_URL, // 这个配置也很重要，否则会出现页面空白情况
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
})

export default router
