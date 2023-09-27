import loading from './index.vue'
export default (Vue) => {
  let loadingComp = Vue.extend(loading)
  let loadingDom
  function showLoading(msg, duration = 3e3) {
    if (!this.toAppMethod('display')) {
      // 调用app loading 不成功
      try {
        hideLoading()
      } catch (error) {}
      loadingDom = new loadingComp({
        data() {
          return {
            show: true,
            msg
          }
        }
      }).$mount()
      document.body.appendChild(loadingDom.$el)
    }
  }

  function hideLoading() {
    try {
      this.toAppMethod('cancel')
    } catch (error) {}
    try {
      loadingDom.show = false
    } catch (error) {}
  }
  Vue.prototype.showLoading = showLoading
  Vue.prototype.hideLoading = hideLoading
}
