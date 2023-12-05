<template>
  <van-pull-refresh
    class="home"
    :disabled="disabledPullRefresh"
    v-model="loading"
    success-text=" "
    loading-text=" "
    loosing-text=" "
    pulling-text=" "
    @refresh="onRefresh"
  >
    <div class="home-content">
      <div class="normal-margin-horizontal">
        <div class="loan-wrapper column-direction-center">
          <div class="row-space-between-center" style="width: 100%">
            &nbsp;
            <div class="available-text">Préstamo máximo($)</div>
            <m-icon
              type="update"
              :width="16"
              :height="15"
              @click="updateData"
            />
          </div>
          <div class="available-number row-flex">
            {{
              (isMultiple ? multipleCredit.remaining : curAvailableAmount)
                | formatMonet
            }}
            <m-icon
              v-if="multipleCredit.locked || appMode.locked"
              class="lock-icon"
              type="lock"
              :width="17"
              :height="20"
            />
          </div>
        </div>

        <div class="row-space-between margin-top-8">
          <div class="total-used row-space-between-center">
            <div class="label">Crédito total($)</div>
            <div class="number">
              {{
                (isMultiple ? multipleCredit.sumQuota : appMode.totalCredit)
                  | formatMonet
              }}
            </div>
          </div>
          <div
            class="total-used row-space-between-center"
            style="margin-left: 7px"
          >
            <div class="label">Crédito usado ($)</div>
            <div class="number">
              {{
                (isMultiple ? multipleCredit.usedQuota : appMode.usedCredit)
                  | formatMonet
              }}
            </div>
          </div>
        </div>

        <div class="action-btn" @click="clickApply">
          <div class="status-tips" v-if="btnTips">
            <div v-html="btnTips"></div>
          </div>
          {{ isMultiple ? multipleCredit.button : appMode.button }}
        </div>

        <div v-if="isMultiple" class="multi-select" @click="clickShowRecommend">
          <span>Soluciones personalizadas</span>
          <div>
            <span :class="{ 'has-num': selectItems.length > 0 }"
              >{{ selectItems.length }} productos</span
            >
            <m-icon type="right" :width="10" :height="16" />
          </div>
        </div>

        <img v-else class="money-icon" src="@/assets/images/money.png" />

        <easy-application />
      </div>
    </div>

    <van-action-sheet
      v-model="showRecommend"
      :safe-area-inset-bottom="false"
      close-on-click-action
      class="home-recommend"
    >
      <div class="pop-content">
        <m-icon
          class="close"
          type="close"
          :width="20"
          :height="20"
          @click="showRecommend = false"
        />
        <multi-recommend
          :list="multiRecommendList"
          @update="updateMultiSelect"
        />
      </div>
    </van-action-sheet>
  </van-pull-refresh>
</template>

<script>
import { mapActions } from "vuex";
import MultiRecommend from "@/components/multiRecommend";
import easyApplication from "@/components/easyApplication";

export default {
  components: {
    MultiRecommend,
    easyApplication,
  },
  data() {
    return {
      disabledPullRefresh: false,
      created: false,
      query: this.$route.query,
      from: this.$route.query.from,
      loading: false,
      selectItems: [], // 多推选中的产品
      multiRecommendList: [], // 多推的产品
      isMultiple: !!localStorage.getItem("app-is-multi"), // 是否多推首页
      showRecommend: false,
      actionText: "Apply",
      btnTips: "Apply",
      actionCallback: null, // 按纽回调
      multipleCredit: {
        usedQuota: 0,
        sumQuota: 0,
        remaining: 0,
        repaymentNum: 0,
        button: "",
        locked: null,
      },
      list: [
        {
          path: "home", // 首页 tab
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "mine", // 个人中心 tab
          type: 2, // 1：H5 2：安卓
        },
        {
          path: "repayment", // 待还款 tab
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "information", // 个人信息（认证页）
          type: 2, // 1：H5 2：安卓
        },
        {
          path: "contacts", // 联系人（认证页）
          type: 2, // 1：H5 2：安卓
        },
        {
          path: "identity", // 身份证（认证页）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "addBank", // 绑定银行卡 （认证页）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "loanConfirm", // 贷款确认页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "loanSuccessMulti", // 申请结果页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "loanFail", // 申请失败页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "orderDetail", // 订单详情页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "deferHistory", // 还款历史页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "deferDetail", // 展期详情页
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "orderList", // 全部订单（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "helpCenter", // 帮助中心（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "completeBank", // 银行卡（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "settings", // 设置（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "createPassword", // 创建密码（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "retrievePassword", // 修改密码（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "terms", // 服务条款（个人中心）
          type: 1, // 1：H5 2：安卓
        },
        {
          path: "privacy", // 隐私政策（个人中心）
          type: 1, // 1：H5 2：安卓
        },
      ],
    };
  },
  computed: {
    curAvailableAmount() {
      if (typeof this.appMode.availableCredit != "undefined") {
        return this.appMode.availableCredit;
      } else if (typeof this.appMode.amount != "undefined") {
        return this.appMode.amount;
      } else {
        return "";
      }
    },
  },
  watch: {
    "appMode.maskModel": {
      async handler(newVal, oldVal) {
        if (
          newVal != oldVal &&
          this.appMode &&
          typeof this.appMode.maskModel != "undefined"
        ) {
          if (this.appMode.maskModel == 1) {
            // 多推
            localStorage.setItem("app-is-multi", true);
            this.isMultiple = true;
            await this.getMultiRecommendItems();
          } else {
            // 现金贷
            this.isMultiple = false;
            this.toAppMethod("getRepaymentInfo", {
              isRepayment: false,
              repaymentNumber: 0,
            });
            localStorage.removeItem("app-is-multi");
          }
          this.updateTextAndAction();
          this.startSyncData();
        }
      },
      deep: true,
      immediate: true,
    },
    showRecommend: {
      async handler(newVal, oldVal) {
        this.disabledPullRefresh = !!this.showRecommend;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    this.setTabBar({
      show: false,
    });
    this.getMapDataListKey();
  },

  mounted() {
    this.eventTracker("home_access");
    if (!this.checkInApp()) {
      window.getMapDataListCallback();
    }
  },
  activated() {
    this.setEventTrackStartTime();

    if (this.checkInApp() && !this.created) {
      return;
    }

    this.updateData();

    // 页面配置
    this.getAppJumpConfig();
  },
  methods: {
    ...mapActions(["setAppGlobal", "setAppChecked", "setJumpPageTypes"]),
    // 调用app方法获取所有参数
    getMapDataListKey() {
      window.getMapDataListCallback = async (data) => {
        console.log("app 回调 getMapDataListKeyCallback", data);
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        data = data || {};
        this.setAppChecked(true);
        this.setAppGlobal(data);
        this.updateData();
        this.created = true;
      };
      // 安卓返回首页刷新数据
      window.updateHome = () => {
        this.updateData();
      };
      this.toAppMethod("getMapDataList", {
        fuName: "getMapDataListCallback",
        updateData: "updateHome",
      });
    },
    async getAppJumpConfig() {
      const res = await this.$http.post(`/api/app/getAppJumpConfig`);
      // this.toAppMethod("getToPageList", { list: res.data });
      // this.setJumpPageTypes(res.data);
      this.toAppMethod("getToPageList", { list: this.list });
      this.setJumpPageTypes(this.list);
    },
    clickShowRecommend() {
      if (!this.selectItems || this.selectItems.length == 0) {
        return;
      }
      this.showRecommend = true;
    },
    async updateData() {
      try {
        this.showLoading();
        await this.getAppMode();
        if (this.appMode.maskModel == 1) {
          await this.getMultiRecommendItems();
        }
        await this.getUserInfo();
        this.updateTextAndAction();
        this.hideLoading();
      } catch (error) {
        console.log(error);
        this.hideLoading();
      }
    },
    updateTextAndAction() {
      // 清除数据
      this.btnTips = "";
      this.actionText = "Apply";
      this.actionCallback = () => {
        this.$toast("Por favor, inténtelo de nuevo！");
      };

      if (this.appMode.maskModel == 1) {
        this.actionText = this.multipleCredit.button || "Aplicar ahora";
        if (this.actionText == "Aplicar ahora") {
          // 有可借
          this.actionCallback = async () => {
            // 多推
            if (this.selectItems.length > 0) {
              this.showLoading();
              let syncRes;
              try {
                // 1. 先同步数据
                try {
                  syncRes = await this.judgeCanApply();
                } catch (error) {
                  this.hideLoading();
                  this.$toast("Carga fallida, inténtelo más tarde");
                  return;
                }
                // 2. 真正提交
                if (syncRes.success) {
                  let res = await this.$http.post(
                    `/api/order/mergePush/preApply`,
                    {
                      productList: this.selectItems.map((t) => t.id),
                    }
                  );
                  if (res.returnCode == 2000) {
                    await this.$http.post(`/api/order/mergePush/apply`, {
                      orderIdList: res.data.orderIdList,
                    });
                    this.$toast("Solicitud enviada con éxito");
                    setTimeout((res) => {
                      this.sendEventTrackData({ leaveBy: 1, page: "home" });

                      this.innerJump("loanSuccessMulti", {
                        systemTime: this.getLocalSystemTimeStamp(),
                      });
                    }, 1000);
                  }
                }
              } catch (error) {
                this.$toast(error.message);
              } finally {
                this.hideLoading();
              }
            }
          };
        } else if (this.actionText == "Ir a reembolsar") {
          this.btnTips =
            "Demasiados préstamos ahora. Por favor, pagar primero y desbloquear una mayor cantidad del préstamo.";
          // 有待还款或逾期，无可借
          this.actionCallback = () => {
            this.innerJump("repayment");
          };
        } else if (
          this.actionText == "En revisión" ||
          this.actionText == "Desembolsando"
        ) {
          // 无可借，订单全部放款中或者审核中
          this.actionCallback = () => {
            this.innerJump("orderList");
          };
        } else if (this.actionText == "Rechazo") {
          // 无可借，订单全被拒绝
          this.actionCallback = () => {
            this.$toast("Por favor, inténtelo de nuevo después de 0:00");
          };
        }
      } else if ([0, 3].includes(this.appMode.maskModel)) {
        this.actionText = "Aplicar ahora";
        // 未认证跳转
        if (this.appMode.basicInfoAuth == 0) {
          this.btnTips = "Casi:95%";
          this.actionCallback = () => {
            this.innerJump("information", { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.addInfoAuth == 0) {
          this.btnTips = "Casi:96%";
          this.actionCallback = () => {
            this.innerJump("contacts", { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.identityAuth == 0) {
          this.btnTips = "Casi:97%";
          this.actionCallback = () => {
            this.innerJump("identity", { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.remittanceAccountAuth == 0) {
          this.btnTips = "Casi:98%";
          this.actionCallback = () => {
            this.innerJump("addBank", {
              orderId: this.appMode.orderId,
              from: "order",
            });
          };
        } else if (
          this.appMode.orderId &&
          typeof this.appMode.orderStatus != "undefined"
        ) {
          // 默认都跳订单详情页
          this.actionCallback = () => {
            this.innerJump("orderDetail", { orderId: this.appMode.orderId });
          };

          if ([20, 21].includes(this.appMode.orderStatus)) {
            // 订单审核中
            this.actionText = "Evaluando";
          } else if ([80, 90].includes(this.appMode.orderStatus)) {
            // 待还款 | 逾期
            this.actionText = "Ir a reembolsar";
            this.btnTips =
              "Devuelve el dinero a tiempo y desbloquea un préstamo de mayor cuantía";
          } else if (this.appMode.orderStatus == 40) {
            // 拒绝
            this.actionText = "Rechazo";
            this.actionCallback = () => {
              this.$toast("Por favor, inténtelo de nuevo después de 0:00!");
            };
          } else if ([30, 70].includes(this.appMode.orderStatus)) {
            // 放款中
            this.actionText = "Desembolsando";
          } else {
            this.btnTips = "Casi:99%";
            this.actionCallback = () => {
              this.sendEventTrackData({ leaveBy: 1, page: "home" });
              this.innerJump("loanConfirm", { orderId: this.appMode.orderId });
            };
          }
        }
      } else if (this.appMode.maskModel == 2) {
        this.actionText = "Rechazo";
        this.actionCallback = () => {
          this.$toast("Por favor, inténtelo de nuevo después de 0:00!");
        };
      }
    },
    async getMultiRecommendItems() {
      try {
        this.showLoading();
        let res = await this.$http.post(`/api/product/mergeProduct/list`);
        this.multipleCredit = {
          usedQuota: res.data.usedQuota,
          sumQuota: res.data.sumQuota,
          remaining: res.data.remaining,
          repaymentNum: res.data.repaymentNum,
          button: res.data.button,
          locked: res.data.locked,
        };
        this.updateMultiSelect(res.data.mergPushProductList || []);
        this.multiRecommendList = res.data.mergPushProductList || [];
        this.toAppMethod("getRepaymentInfo", {
          isRepayment: true,
          repaymentNumber: res.data.repaymentNum,
        });
        this.setRepaymentNum(res.data.repaymentNum);
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async onRefresh() {
      try {
        await this.getAppMode();
        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    updateMultiSelect(selectItems) {
      this.selectItems = selectItems;
      let totalValue = selectItems.reduce((prev, cur, index, arr) => {
        return prev + parseInt(cur.minAmount);
      }, 0);
      this.$set(this.multipleCredit, "remaining", totalValue);
    },

    async clickApply() {
      this.eventTracker("home_apply");
      if (this.actionCallback) {
        this.actionCallback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;

  &-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-top: 60px;
    background-image: url(@/assets/images/home-banner.png);
    background-attachment: local;
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% 180px;

    .loan-wrapper {
      width: 335px;
      margin: 60px auto 0;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      background: #fff;
      border-radius: 16px;
      box-sizing: border-box;
      padding: 24px 20px;

      .available-text {
        font-size: 18px;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
      }

      .available-number {
        font-size: 48px;
        font-family: DINAlternate, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 54px;
      }
      .lock-icon {
        margin: 23px 0 0 8px;
      }

      .number {
        font-size: 48px;
        font-weight: bold;
        color: #333333;
        text-align: center;
        display: flex;
        align-items: baseline;
        justify-content: center;
      }
    }

    .total-used {
      width: 164px;
      display: flex;
      flex-direction: column;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;

      .label {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
      .number {
        font-size: 24px;
        font-family: DINAlternate, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 32px;
      }
    }

    .multi-select {
      height: 64px;
      background: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      margin-top: 24px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 900;
      color: #000;
      line-height: 20px;
      > span {
        font-weight: bold;
      }
      > div {
        display: flex;
        align-items: center;

        span {
          height: 20px;
          background: #e6e6e6;
          font-size: 12px;
          font-family: Roboto, Roboto;
          font-weight: 400;
          color: #999999;
          line-height: 12px;
          transform: scale(0.9);
          padding: 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          margin-right: 8px;
          &.has-num {
            background: #ff4a43;
            font-size: 12px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
          }
        }
      }
    }
  }
}

.action-btn {
  width: 335px;
  height: 48px;
  background: #a05bf8;
  border-radius: 28px;
  font-size: 18px;
  font-family: Roboto, Roboto;
  font-weight: 900;
  color: #ffffff;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  position: relative;

  .status-tips {
    position: absolute;
    background: #ec594c;
    padding: 4px 8px;
    border-radius: 10px 10px 10px 0;
    font-size: 12px;
    font-family: Roboto, Roboto;
    font-weight: 900;
    color: #ffffff;
    line-height: 16px;
    right: 0px;
    bottom: 34px;
    max-width: 280px;
    box-sizing: border-box;
  }
}

.money-icon {
  width: 335px;
  height: 96px;
  margin-top: 8px;
}

.row-space-between {
  display: flex;
  justify-content: space-between;
}

.home-recommend {
  height: 80%;
  background: #f6f6f6;
  .pop-content {
    position: relative;
    height: 100%;
    overflow: hidden;
    .close {
      position: absolute;
      top: 16px;
      right: 24px;
    }
  }
}
</style>
