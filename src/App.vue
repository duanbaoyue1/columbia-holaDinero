<template>
  <div id="app">
    <div v-if="!isAppChecked" class="app-error">error!</div>
    <div
      v-else
      class="page-wrap"
      :class="{
        'has-tab': $route.meta.showTab,
        'has-nav': tabBar.show,
        'background-fff': $route.meta.backgroundFFF
      }"
    >
      <nav-bar v-show="mounted && tabBar.show" />
      <transition name="fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
          <router-view />
        </keep-alive>
        <!-- 这里是不被缓存的视图组件 -->
        <router-view v-else />
      </transition>

      <tab-bar :showRepayment="showRepayment" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import navBar from '@/components/navBar'
import tabBar from '@/components/tabBar'

export default {
  components: {
    navBar,
    tabBar
  },
  data() {
    return {
      showRepayment: !!localStorage.getItem('app-is-multi'),
      mounted: false
    }
  },
  created() {
    this.setTabBar({
      show: false
    })
  },
  async mounted() {
    document.documentElement.style.fontSize =
      document.documentElement.clientWidth / 10 + 'px'
    setTimeout((res) => {
      this.mounted = true
    }, 500)
  },
  computed: {
    ...mapState(['isAppChecked', 'appMode'])
  },
  watch: {
    'appMode.maskModel': {
      handler(newVal, oldVal) {
        if (this.appMode && typeof this.appMode.maskModel != 'undefined') {
          if (this.appMode.maskModel == 1) {
            this.showRepayment = true
          } else {
            this.showRepayment = false
            localStorage.removeItem('app-is-multi')
          }
        }
      },
      deep: true,
      immediate: true
    },

    $route(to, from) {
      console.log('route change', from, to, this.$route.meta.showTab)
      document.body.style.overflow = ''
      document.title = to.meta.title || ''
      this.toAppMethod('holdUp', { isInterception: false })
      try {
        this.hideLoading()
      } catch (error) {
        console.log(error)
      }
      this.checkAndSetAppLocal()
      if (to.query.nextUrl && from && from.name) {
        this.openWk(to.query.nextUrl)
      }
      if (to.query.token) {
        this.updateToken({ token: to.query.token })
      }
      if (to.query.appChecked || sessionStorage.getItem('app-checked')) {
        this.setAppChecked(true)
      }
    }
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    checkAndSetAppLocal() {
      let appLocal = localStorage.getItem('app-local')
      if (appLocal) {
        this.setAppGlobal(JSON.parse(appLocal))
      }
    }
  }
}
</script>

<style lang="scss">
.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0s;
}
#app {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.app-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
