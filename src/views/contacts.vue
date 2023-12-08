<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="1"></complete-step>
    </div>

    <div
      class="edit-area-wrapper"
      v-for="(item, index) in contacts"
      :key="index"
    >
      <div class="edit-area-header">Contacto de emergencia {{ index + 1 }}</div>
      <div class="edit-area">
        <div class="line-item line-item-rela">
          <div class="desc">Elige el parentesco del contacto</div>
          <select-item
            :items="RELATION_SHIPS"
            title="Elige el parentesco del contacto"
            :itemAttrs="index"
            @choose="chooseRelation"
          />
        </div>

        <div class="line-item phone-select-wrapper" @click="choosePhone(index)">
          <label style="padding: 30px 0 20px 0">Número de contacto</label>
          <div class="">
            <input
              id="familyPhone"
              v-model="item.mobile"
              disabled
              placeholder="Por favor, elija"
            />
            <m-icon class="icon" type="address-book" :width="20" :height="20" />
          </div>
        </div>
        <div class="line-item">
          <label class="nombre">Nombre</label>
          <input v-model="item.name" placeholder="Por favor escribe" />
        </div>
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">
        Enviar
      </button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        ¡Enhorabuena!
        <br />
        Su información de Contacto ha sido verificada
      </span>
    </div>
  </div>
</template>

<script>
import selectItem from "@/components/selectItem";
import { RELATION_SHIPS } from "@/utils/constants";
import CompleteStep from "@/components/completeStep";
const FIRST_GET_PHONE_KEY = "is-getted-phone";

export default {
  components: {
    selectItem,
    CompleteStep,
  },

  data() {
    window.choosePhoneCallback = (data) => {
      console.log(data, "****** slingBooks");
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      let { mobile, name } = data;
      console.log(mobile);
      mobile = mobile.replace(/ /g, "");
      // 1. 验证号码是否有效
      if (mobile.length < 10 || mobile.length > 15) {
        this.showMessageBox({
          content:
            "El número de móvil del contacto no está en el formato correcto, por favor, vuelva a seleccionarlo",
          confirmBtnText: "Ok",
          confirmCallback: () => {
            this.hideMessageBox();
          },
          iconPath: "numero",
          showClose: false,
        });
        return;
      }
      // 2. 验证是否有重复的
      let currentPhone = [...this.contacts].map((t) => t.mobile);
      if (currentPhone.includes(mobile)) {
        this.showMessageBox({
          content: "Número de móvil duplicado, seleccione otro contacto",
          confirmBtnText: "Ok",
          confirmCallback: () => {
            this.hideMessageBox();
          },
          iconPath: "duplicate-phone",
          showClose: false,
        });
        return;
      }
      this.contacts[this.lastPhoneIndex].mobile = mobile;
      this.contacts[this.lastPhoneIndex].name = name;
    };

    return {
      RELATION_SHIPS,
      canSubmit: true, // 是否可以提交
      submitSuccess: false,
      contacts: [],
      lastPhoneIndex: 0,
      saving: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "Información del contacto",
      backCallback: null,
    });
  },
  mounted() {
    this.setEventTrackStartTime();
    this.getAppContactsNum();
    this.eventTracker("contact_access");
    this.initInfoBackControl();
  },
  watch: {
    contacts: {
      handler() {
        this.canSubmit =
          this.contacts.filter((t) => t.mobile).length == this.contacts.length;
      },
      deep: true,
    },
  },
  methods: {
    async getAppContactsNum() {
      let contactsNum = 1;
      try {
        let res = await this.$http.post(`/api/app/getAppContactsNum`);
        contactsNum = res.data.num;
      } catch (error) {
      } finally {
        this.contacts = Array.from({ length: contactsNum }, (v, k) => k).map(
          (t) => {
            return { relation: "", mobile: "", name: "" };
          }
        );
      }
    },
    chooseRelation(data) {
      this.contacts[data.attr].relation = data.value;
    },
    choosePhone(index) {
      this.lastPhoneIndex = index;
      let isGettedPhone = localStorage.getItem(FIRST_GET_PHONE_KEY);
      if (!isGettedPhone) {
        localStorage.setItem(FIRST_GET_PHONE_KEY, "true");
        this.showMessageBox({
          content:
            "Por favor, asegúrate de elegir un número de móvil real o el dinero no será liberado",
          confirmBtnText: "Ok",
          confirmCallback: () => {
            this.hideMessageBox();
            this.toAppMethod("slingBooks", {
              fuName: "choosePhoneCallback",
            });
          },
          iconPath: "hanging-book",
          showClose: false,
        });
      } else {
        this.toAppMethod("slingBooks", { fuName: "choosePhoneCallback" });
      }
    },
    async submit() {
      this.showLoading();
      try {
        this.eventTracker("contact_submit");
        let data = await this.$http.post(`/api/user/addInfo/save`, {
          contacts: this.contacts,
        });
        if (data.returnCode === 2000) {
          this.submitSuccess = true;
          this.eventTracker("contact_submit_success");
          setTimeout(() => {
            this.submitSuccess = false;
            this.sendEventTrackData({ leaveBy: 1 });
            this.innerJump(
              "identity",
              { orderId: this.$route.query.orderId, from: "order" },
              true
            );
          }, 2000);
        }
      } catch (error) {
        this.eventTracker("contact_submit_error");
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px;
  padding-bottom: 94px;
  overflow-y: auto;
  background: #f6f6f6;
  padding-top: 0;
  box-sizing: border-box;
  .edit-area-header {
    font-size: 16px;
    font-family: Roboto, Roboto;
    font-weight: 900;
    color: #a05bf8;
    line-height: 24px;
  }
  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      width: 293px;
      height: 59px;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f6f6f6;
  }
  .step {
    padding-top: 10px;
    margin-bottom: 32px;
  }

  .edit-area {
    border-radius: 8px;
    margin-bottom: 16px;

    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
    }

    .line-item {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      border-bottom: 2px solid #e3e3e3;
      height: 104px;
      &.line-item-rela {
        display: block;
        height: 104px;
        .desc {
          padding-top: 30px;
          padding-bottom: 20px;
        }
      }
      label {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        flex-shrink: 0;
        margin-right: 10px;
      }
      .nombre {
        padding-top: 30px;
        height: 20px;
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        padding: 0 0px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }

    input {
      background: #f9f9f9;
    }

    .phone-select-wrapper {
      > div {
        display: flex;
        align-items: center;
        input {
          background: transparent;
        }
        img {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
