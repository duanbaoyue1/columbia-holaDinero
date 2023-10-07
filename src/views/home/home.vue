<template>
  <van-pull-refresh
    class="home"
    :disabled="disabledPullRefresh"
    loading-text="loading"
    loosing-text="Release to refresh"
    pulling-text="Pull down to refresh"
    v-model="loading"
    @refresh="onRefresh"
  >
    <div class="home-bg"></div>
    <div class="home-content">
      <div class="originate">We can originate loans quickly</div>
      <div class="loan-wrapper">
        <div class="amount-frame">
          <img class="amount-img" src="@/assets/images/home.png" />
          <div class="available-text">Available Amount (₹)</div>
          <div class="available-number row-flex">
            {{
              isMultiple
                ? multipleCredit.remaining || 0
                : curAvailableAmount | thousands
            }}
            <img
              v-if="showLock"
              class="lock-img"
              src="@/assets/images/lock.png"
            />
          </div>
        </div>
        <div class="total-used-frame column-space-between padding-20">
          <div class="row-space-between normal-padding-horizontal">
            <div class="column-direction-center">
              <div class="total-credit">Total Credit (₹)</div>
              <div class="total-credit-number margin-top-8">
                {{
                  isMultiple
                    ? multipleCredit.sumQuota || 0
                    : appMode.totalCredit || 0 | thousands
                }}
              </div>
            </div>
            <div class="column-direction-center">
              <div class="total-credit">Used Credit (₹)</div>
              <div class="total-credit-number margin-top-8">
                {{
                  isMultiple
                    ? multipleCredit.usedQuota || 0
                    : appMode.usedCredit || 0 | thousands
                }}
              </div>
            </div>
          </div>

          <div class="action-btn margin-top-28" @click="clickApply">
            <div class="status-tips" v-if="btnTips" v-html="btnTips"></div>
            {{ isMultiple ? multipleCredit.button : actionText }}
          </div>

          <div v-if="showRepayTips" class="repay-amount">
            Please repay first and unlock a higher loan amount
          </div>
        </div>

        <div class="margin-top-30">
          <div
            v-if="isMultiple"
            class="multi-select"
            @click="clickShowRecommend"
          >
            <span>Customized Solutions</span>
            <img class="right-arrow" src="@/assets/images/right-arrow.png" />
            <div
              class="products"
              :class="{ 'has-num': selectItems.length > 0 }"
            >
              {{ selectItems.length }} products
            </div>
          </div>
          <div v-else>
            <img
              class="cash-loan-banner"
              src="@/assets/images/cash-loan-banner.png"
            />
          </div>
        </div>

        <!-- easy application -->
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
        <img
          class="close"
          src="@/assets/images/close.png"
          @click="showRecommend = false"
        />
        <multi-recommend
          @update="updateMultiSelect"
          :list="multiRecommendList"
        ></multi-recommend>
      </div>
    </van-action-sheet>
  </van-pull-refresh>
</template>

<script>
import { mapActions } from "vuex";
import multiRecommend from "@/components/multiRecommend";
import easyApplication from "./components/easyApplication";

export default {
  components: {
    multiRecommend,
    easyApplication,
  },
  data() {
    return {
      showLock: false,
      showRepayTips: false,
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
      multipleCredit: {},
    };
  },
  computed: {
    curAvailableAmount() {
      if (typeof this.appMode.availableCredit != "undefined") {
        return this.appMode.availableCredit;
      } else if (typeof this.appMode.amount != "undefined") {
        return this.appMode.amount;
      } else {
        return 10000;
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
    if (this.from == "bridge" && !this.query.reload) {
      location.replace(location.href + "&reload=true");
    }
    this.setGlobalData();
    this.allDataKey();
  },

  mounted() {
    if (!this.checkInApp()) {
      window.allDataCallback();
    }
  },
  activated() {
    if (this.checkInApp() && !this.created) {
      return;
    }
    console.log("home activated and refresh data!");
    this.updateData();
  },
  methods: {
    ...mapActions(["setAppGlobal", "setAppChecked", "updateToken"]),

    // 调用app方法获取所有参数
    allDataKey() {
      window.allDataCallback = async (data) => {
        console.log("app 回调 allDataKeyCallback", data);
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        data = data || {};
        delete data.apiHost;
        if (data.appVersionCode) {
          data.appVersion = data.appVersionCode;
        }
        if (data.appVersionName) {
          data.appVersionV = data.appVersionName;
        }
        this.setAppGlobal(data);
        this.updateData();
        this.created = true;
      };
      this.toAppMethod("allData", {
        fuName: "allDataCallback",
      });
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
        await this.getUserInfo();
        await this.getAppMode();
        if (this.appMode.maskModel == 1) {
          await this.getMultiRecommendItems();
        }

        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },

    updateTextAndAction() {
      this.showLock = false;
      this.showRepayTips = false;
      // 清除数据
      this.btnTips = "";
      this.actionText = "Apply";
      this.actionCallback = () => {
        this.$toast("please try later!");
      };

      if (this.appMode.maskModel == 1) {
        this.actionText = this.multipleCredit.button || "Apply";
        if (this.actionText == "Apply immediately") {
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
                  this.$toast(
                    "Your message verification failed, please wait a minute and try again"
                  );
                  return;
                }
                // 2. 真正提交
                if (syncRes) {
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
                    this.$toast("Apply successfully");
                    setTimeout((res) => {
                      this.innerJump("loanSuccessMulti", {
                        systemTime: new Date().getTime(),
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
        } else if (this.actionText == "Repay") {
          this.showLock = true;
          this.showRepayTips = true;
          // 有待还款或逾期，无可借
          this.actionCallback = () => {
            this.innerJump("repayment");
          };
        } else if (
          this.actionText == "Reviewing" ||
          this.actionText == "Disbursing"
        ) {
          this.showLock = true;
          // 无可借，订单全部放款中或者审核中
          this.actionCallback = () => {
            this.innerJump("orderList");
          };
        } else if (this.actionText == "Rejected") {
          // 无可借，订单全被拒绝
          this.showLock = true;
          this.actionCallback = () => {
            this.$toast("The order was rejected. Please try again after 0:00");
          };
        }
      } else if (this.appMode.maskModel == 3 || this.appMode.maskModel == 0) {
        this.actionText = "Apply";
        //未认证跳转
        if (this.appMode.basicInfoAuth == 0) {
          this.btnTips = "Almost:95%";
          this.actionCallback = () => {
            this.innerJump("completeInformation", {
              actionIndex: 0,
            });
          };
        } else if (this.appMode.addInfoAuth == 0) {
          this.btnTips = "Almost:96%";
          this.actionCallback = () => {
            this.innerJump("completeInformation", {
              actionIndex: 1,
            });
          };
        } else if (this.appMode.identityAuth == 0) {
          this.btnTips = "Almost:97%";
          this.actionCallback = () => {
            this.innerJump("completeInformation", {
              actionIndex: 2,
            });
          };
        } else if (this.appMode.remittanceAccountAuth == 0) {
          this.btnTips = "Almost:98%";
          this.actionCallback = () => {
            this.innerJump("completeInformation", {
              orderId: this.appMode.orderId,
              actionIndex: 3,
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
            this.actionText = "Reviewing";
            this.showLock = true;
          } else if ([80, 90].includes(this.appMode.orderStatus)) {
            // 待还款 | 逾期
            this.actionText = "Repay";
            this.showLock = true;
            this.showRepayTips = true;
          } else if (this.appMode.orderStatus == 40) {
            // 拒绝
            this.actionText = "Rejected";
            this.actionCallback = () => {
              this.$toast(
                "The order was rejected. Please try again after 0:00!"
              );
            };
          } else if (
            this.appMode.orderStatus == 30 ||
            this.appMode.orderStatus == 70
          ) {
            // 放款中
            this.actionText = "Disbursing";
          } else {
            this.btnTips = "Almost:99%";
            this.actionCallback = () => {
              this.innerJump("loanConfirm", { orderId: this.appMode.orderId });
            };
          }
        }
      } else if (this.appMode.maskModel == 2) {
        this.actionText = "Rejected";
        this.actionCallback = () => {
          this.$toast("The order was rejected. Please try again after 0:00!");
        };
      }
    },

    setGlobalData() {
      if (this.from == "bridge") {
        this.setAppGlobal(this.query);
      }
      this.setAppChecked(true);
    },

    async getMultiRecommendItems() {
      try {
        let res = await this.$http.post(`/api/product/mergeProduct/list`);
        this.updateMultiSelect(res.data.mergPushProductList || []);
        this.multiRecommendList = res.data.mergPushProductList || [];
        this.setRepaymentNum(res.data.repaymentNum);
        this.multipleCredit = {
          usedQuota: res.data.usedQuota,
          sumQuota: res.data.sumQuota,
          remaining: res.data.remaining,
          repaymentNum: res.data.repaymentNum,
          button: res.data.button,
        };
      } catch (error) {}
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
      if (this.actionCallback) {
        this.actionCallback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/parameters.scss";

.home-recommend {
  height: 80%;

  .pop-content {
    background: #f9f9f9;
    position: relative;
    height: 100%;
    overflow: hidden;

    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 16px;
      right: 24px;
    }
  }
}

.repay-amount {
  font-size: 12px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #fe4207;
  line-height: 16px;
  margin: 10px 0 0 8px;
}

.lock-img {
  width: 17px;
  height: 20px;
  margin: 15px 0 0 10px;
}

.right-arrow {
  width: 12px;
  height: 14px;
}

.home {
  height: 100%;
  box-sizing: border-box;

  &-bg {
    height: 300px;
    background: linear-gradient(270deg, #b2f2e7 0%, #cff5ee 100%);
  }

  &-content {
    height: 100%;
    position: relative;
    top: -220px;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 24px;

    .originate {
      font-size: 14px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #000000;
      line-height: 30px;
      margin-left: 20px;
    }

    .loan-wrapper {
      width: 345px;
      height: 392px;
      margin: 16px auto 0;

      .amount-frame {
        width: 345px;
        height: 104px;
        background: linear-gradient(270deg, #b3f2e8 0%, #edfffc 100%);
        border-radius: 14px 0px 0px 0px;
        position: relative;
      }

      .available-text {
        font-size: 12px;
        font-weight: 400;
        font-family: Roboto-Regular, Roboto;
        color: #333333;
        line-height: 18px;
        padding: 21px 0 0 20px;
      }

      .available-number {
        font-size: 36px;
        font-weight: bold;
        font-family: DINAlternate-Bold, DINAlternate;
        color: #333333;
        line-height: 46px;
        padding-left: 20px;
      }

      .amount-img {
        width: 175px;
        height: 122px;
        position: absolute;
        top: -18px;
        right: 0;
      }

      .total-used-frame {
        background: #ffffff;
        border-radius: 0px 0px 14px 14px;
        padding-bottom: 20px;
      }

      .total-credit {
        font-size: 12px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }

      .total-credit-number {
        font-size: 30px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 36px;
      }

      .action-btn {
        width: 100%;
        height: 48px;
        background: $themeColor;
        border-radius: 24px;
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: $themeFontColor;
        line-height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .status-tips {
          position: absolute;
          background: #ff4b3f;
          padding: 8px;
          border-radius: 10px 10px 10px 0;
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #fff;
          line-height: 12px;
          bottom: 35px;
          right: -14px;
          transform: scale(0.9);
        }
      }

      .multi-select {
        height: 48px;
        background: #fff;
        border-radius: 14px;
        margin-top: 30px;
        padding-left: 24px;
        padding-right: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000;
        line-height: 26px;
        position: relative;

        .products {
          background: #e0dddd;
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 900;
          color: #999999;
          border-radius: 10px 10px 10px 0;
          line-height: 12px;
          transform: scale(0.9);
          padding: 6px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 37px;
          right: 0;

          &.has-num {
            background: #ff4b3f;
            color: #fff;
          }
        }
      }

      .cash-loan-banner {
        width: 345px;
      }
    }
  }
}
</style>
