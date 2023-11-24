<template>
  <div class="permissions">
    <div class="header-wrapper">
      <div>PERMISSION</div>
      <div class="bottom">
        <p>Hi,there</p>
        <p>To assess your eligibility and facilitate faster disbursal of your loan, we need these permissions.</p>
      </div>
      <m-icon class="icon" type="permissions/back2" :width="161" :height="161"></m-icon>
    </div>
    <div class="content">
      <div>EasyMoney is committed to providing a better experience for its users. That is why EasyMoney also requests certain information on the user's device when applying for credit. This information is only used to better assess risk. We do not share users' personal information with third parties without their consent.</div>
      <div class="module" v-for="item in lists" :key="item.iconName">
        <div class="header">
          <m-icon class="icon" :type="item.iconName" :width="item.iconWidth" :height="item.iconHeight"></m-icon>
          <span>{{ item.title }}</span>
        </div>
        <div class="desc" v-html="item.desc"></div>
      </div>
      <div>Please note that all personal information is collected by us "as is" and we are not responsible for the accuracy of any personal information you provide.</div>
      <br/>
      <div>Your information is encrypted and stored confidentially on our server (https://easy--money.com) and is completely deleted when the user's service is terminated.</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [
        {
          iconName: 'permissions/icon5',
          title: 'Contacts',
          desc: 'EasyMoney may collect your contact information, including the names and phone numbers of your contacts. This collection will only be done with your consent. This information is also necessary for risk analysis to identify credible referrals, to assess your creditworthiness, and to identify fraudulent referrals. It will help you to check your creditworthiness. Yes, EasyMoney will not obtain or use this information from your mobile device without your consent. (This information is uploaded to: https://easy--money.com).',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon3',
          title: 'SMS',
          desc: "EasyMoney stores and uploads your text messages in a legal manner (https://easy--money.com). The purpose of this text message access request is to evaluate the user's creditworthiness for loan origination purposes. Otherwise, collecting and evaluating your text messages and contact list is necessary to determine the criteria for genuine users and to prevent bots or temporary users from overloading the server.",
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon1',
          title: 'Device Information',
          desc: 'We look for information about the devices you use, including brand, monitor, hardware, monitor, hardware system version, monitor and operating system version.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon7',
          title: 'Camera Information',
          desc: 'For smooth lending, we use cameras for recognition and to strictly protect your information.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon6',
          title: 'Location Information',
          desc: 'Location information is only collected while you are using our applications to determine if you are within the scope of our services. If you exit our application, we will no longer collect your location information.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon8',
          title: 'Phone status',
          desc: "To improve fraud detection and risk management, we need user profile data to collect and monitor certain information about your phone, such as your phone's unique device identifier. This information helps us uniquely identify users and detect and prevent unauthorized device activity on your behalf. We upload this information to (https://easy--money.com) and will only access or use it with your permission.",
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon4',
          title: 'Storage',
          desc: "This permission is necessary to ensure that a user's credit account statements are downloaded and stored securely on their cell phone. The same goes for the user to download the appropriate files to expedite approval and repayment of the loan. This permission also allows the user to enjoy a very smooth and seamless experience when using the app. We will only access or use this information if it is uploaded to the site (https://easy--money.com) and if we have the user's permission to do so.",
          iconWidth: 18,
          iconHeight: 18,
        },
      ],
    };
  },

  mounted() {
    setTimeout(() => {
      this.toAppMethod('testMethod', { b: 1, c: 2 });
    }, 2000);
  },
};
</script>

<style lang="scss" scoped>
.permissions {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #3190f0 0%, #185cb4 100%);

  .header-wrapper {
    height: 237px;
    position: relative;
    .icon {
      position: absolute;
      top: 42px;
      right: -10px;
    }
    div {
      &:first-child {
        padding-top: 89px;
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
        padding-left: 20px;
        line-height: 42px;
      }
      &.bottom {
        height: 90px;
        background: #d8e4fb;
        border-radius: 14px;
        padding: 16px 20px;
        margin: 16px 20px 0;
        box-sizing: border-box;
        p {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          &:first-child {
            font-size: 16px;
            font-weight: bold;
            color: #1143a4;
            line-height: 24px;
            margin-bottom: 2px;
          }
        }
      }
    }
  }

  .content {
    border-radius: 24px 24px 0px 0px;
    padding: 65px 20px 10px;
    margin-top: -45px;
    background: #fff;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
    word-break: break-word;

    .module {
      margin-bottom: 20px;
      margin-top: 20px;
      .header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
        padding-left: 18px;
        &::before {
          position: absolute;
          content: ' ';
          width: 6px;
          height: 16px;
          background: #1143a4;
          border-radius: 3px;
          left: 0;
        }
        .icon {
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          font-weight: 900;
          color: #333;
          line-height: 18px;
        }
      }
      .desc {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
        word-break: break-word;
      }
    }
  }
}
</style>
