<template>
  <div class="h5-content content-area">
    <div class="head">Privacy Policy</div>

    Please read the following terms of this policy carefully to understand how we process your personal data and how we will process it. This policy sets out how we will store any personal data collected from, about you or provided to us by you. By accepting this Privacy Policy, you expressly consent to the collection, retention, analysis, use and Disclosure of your personal information.
    <br />
    <br />
    <br />
    <br />
    HandyCash is committed to protecting the privacy of user information, and collects all your data just to help you use the product better. Your information is uploaded to https://sdk.fin-handycash.com/original/indiaUpload for encrypted storage and will not be misused or disclosed. We strictly abide by Indian laws.
    <br />
    <br />
    <br />
    <br />
    <strong>Call Log Information</strong>
    <br />
    <br />
    To verify that the user is who they say they are, we need to verify their account by obtaining their call logs. After the user receives their voice verification code, double-check the call logs for that number by checking both the voice verification code and the call logs to make sure there are no issues and that the user has registered themselves, i.e. that they have successfully registered, and then upload this information (https://sdk.fin-handycash.com/original/indiaUpload).
    <br />
    <br />
    <br />
    <br />
    <strong class="backyellow">SMS</strong>
    <br />
    <br />
    <div class="backyellow"><strong>We collect all text messages sent to and from your cell phone. By analyzing your cash flow patterns and various accounts, we determine your risk profile and then provide you with appropriate credit analysis. We monitor financial text messages to ensure account security and to assess users' creditworthiness and loan approvals. To prevent financial fraud and dishonest loan applications, it is necessary to collect users' SMS permissions, which we will encrypt and upload to our servers at https://sdk.fin-handycash.com/original/indiaUpload. We will not disclose and resell to third parties your personal information.</strong></div>
    <br />
    <br />
    <br />
    <br />
    <strong>Collect message</strong>
    <br />
    <br />
    When using this service, we need to obtain, collect, store, manage and use your personal data obtained in the process, including but not limited to filling in online forms or data fields included in the platform, device information, access to user permissions, platform usage , and other information obtained through the Platform, email, telephone or other media (if required).
    <br />
    <br />
    <br />
    <br />
    <strong>Installed applications</strong>
    <br />
    <br />
    We collect a list of metadata information about installed applications, including the application name, package name, installation time, update time, version name and version code of each installed application on your device, for anti-fraud checks and to provide More accurate loan servicing. We will not disclose and resell your personal information to third parties.
    <br />
    <br />
    <br />
    <br />
    <strong>Device Information</strong>
    <br />
    <br />
    Collect and monitor specific information about your device, including phone hardware model, operating system and version, unique device identifiers (such as IMEI and serial number), user profile information, and mobile network information to ensure unauthorized devices cannot represent you to operate.
    <br />
    <br />
    <br />
    <br />
    <strong>Location</strong>
    <br />
    <br />
    Collect and monitor information about your device's location for risk assessment purposes for credit scoring.
    <br />
    <br />
    <br />
    <br />
    <strong>Camera</strong>
    <br />
    <br />
    We will need to take a camera selfie, scan and film the required KYC documents so that you can submit the information required for your application.
    <br />
    <br />
    <br />
    <br />
    <strong>Calendar</strong>
    <br />
    <br />
    You need to get the permission of the calendar, after the loan, you can set a reminder for the user about the loan maturity date to remind the user to repay the loan in time to avoid late payment penalty, the calendar information will be uploaded (https://sdk.fin-handycash.com/original/indiaUpload), the user will automatically delete the calendar reminder after the loan is repaid in time.
    <br />
    <br />
    <br />
    <br />
    <strong>Use of information</strong>
    <br />
    <br />
    <br />
    <br />
    We may associate any category of information with any other category of information and, whenever combined, treat the combined information as personal data under this policy. The information we collect will be used to determine whether to extend loans to customers, the amount of such loans and the terms and conditions applicable to such loans. We also comply with an order of a court, arbitration panel, tribunal, regulatory order or order or any other legal or regulatory obligation that we will not disclose personally identifiable information to other parties.
    <br />
    <br />
    <br />
    <br />
    <strong>Personal Information Security</strong>
    <br />
    <br />
    We take reasonable steps to protect your personal information from unauthorized access, use or disclosure. We use industry standard security measures, including encryption, firewalls and secure servers, to protect your information.
    <br />
    <br />
    <br />
    <br />
    <strong>Third-Party SDKs and Links to Other Websites</strong>
    <br />
    <br />
    Our Apps may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices or the content of these third-party sites or services. We encourage you to read the privacy policy of any third-party website or service before providing any personal information.
    <br />
    <br />
    <br />
    <br />
    <strong>Your rights</strong>
    <br />
    <br />
    We will use your data to compile statistics relating to our user base or loan portfolio and may disclose such information to any third party for such purposes, provided that such information remains anonymous. You can choose to edit/modify, delete/withdraw any personal information shared to the platform at any time. Please remember that deleting or withdrawing information may affect the services we provide to you. You will need to provide supporting documents related to the change of personal information so that the company can verify the change of personal information.
    <br />
    <br />
    <br />
    <br />
    <strong>Privacy Policy Updates</strong>
    <br />
    <br />
    We reserve the right to modify this policy at any time, so please check back often. Changes and modifications will be effective immediately upon posting on the Portal. Continued use of the Service constitutes your acceptance of such new or updated policies, as the case may be.
    <br />
    <br />
    <br />
    <br />
    <strong>Contacting us</strong>
    <br />
    <br />
    If you have any questions, concerns or complaints about this privacy policy or the use of your personal information, please contact us at:
    <br />
    <br />
    Mail : handycash01@outlook.com
  </div>
</template>

<script>
export default {
  created() {},
  mounted() {
    if (!this.noHeader) {
      this.setTabBar({
        show: true,
        fixed: true,
        transparent: false,
        title: 'Privacy',
      });
    } else {
      this.setTabBar({
        show: false,
      });
    }
  },
  data() {
    return {
      noHeader: this.$route.query.noHeader || false,
    };
  },
};
</script>

<style lang="scss" scoped>
.h5-content {
  padding: 20px;
  background: #fff;
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 16px;
  word-break: break-word;

  .backyellow {
    background: #fffc54;
    color: #000;
  }

  .head {
    font-size: 13px;
    color: #333;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  strong {
    font-weight: bold !important;
    color: #333;
  }
}
</style>
