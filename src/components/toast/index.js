import toast from './index.vue';
export default Vue => {
  let toastComp = Vue.extend(toast);
  function showToast(msg, duration = 3e3) {
    try {
      this.hideLoading();
    } catch (error) {}
    let toastDom = new toastComp({
      data() {
        return {
          show: true,
          msg,
        };
      },
    }).$mount();
    document.body.appendChild(toastDom.$el);
    setTimeout(() => {
      toastDom.show = false;
    }, duration);
  }
  Vue.prototype.$toast = showToast;
};
