<template>
  <div class="google-feedback">
    <div class="google-feedback-content">
      <div class="tips">
        <img :src="require('@/assets/images/feedback-guidance.png')" />
      </div>
      <div class="title">¿Qué opina de HolaDinero？</div>
      <div class="stars">
        <div class="star" v-for="(item, index) in stars" :key="index">
          <img
            :src="
              curStar >= index + 1
                ? require('@/assets/images/star.png')
                : require('@/assets/images/not-star.png')
            "
            @click="toggleStar(index + 1)"
          />
        </div>
      </div>
      <div class="input-area">
        <div class="tips1" v-if="curStar >= 4">
          Ir a Google Play para una reseña de 5 estrellas Aumentar la tasa de
          aprobación al
          <span>90%</span>
        </div>
        <div v-else>
          <textarea
            maxlength="100"
            v-model="comments"
            @keyup="changeContent"
            placeholder="¡Por favor, deje su opinión, vamos a leer y comentarios cuidadosamente!"
          ></textarea>
        </div>
      </div>
      <div class="submit">
        <button @click="submit">
          {{ curStar > 3 ? "Ir a GooglePlay Comentarios" : "Enviar" }}
        </button>
        <button class="cancel" @click="hide">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "son",
  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      curStar: 5,
      comments: "",
    };
  },
  methods: {
    toggleStar(star) {
      this.curStar = star;
    },
    hide() {
      this.$emit("update:show", false);
    },
    changeContent() {
      if (this.comments.trim() == "") {
        this.comments = "";
      }
    },
    async submit() {
      if (this.curStar <= 3 && !this.comments.length) {
        this.$toast("Por favor, introduzca su sugerencia");
        return;
      }

      try {
        this.showLoading();
        let res = await this.$http.post(`/api/product/saveFavourableComment`, {
          grade: this.curStar,
          content: this.comments,
        });
        if (res.returnCode == 2000) {
          this.$toast("Presentación exitosa!");
          if (this.curStar >= 4) {
            this.toAppMethod("runToStore");
          }
          setTimeout((res) => {
            this.$emit("update:show", false);
          }, 1000);
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.google-feedback {
  position: fixed;
  z-index: 222;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);

  &-content {
    width: 295px;
    background: #ffffff;
    border-radius: 16px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .submit {
      button {
        margin: 20px 24px;
        width: 247px;
        height: 40px;
        font-size: 16px;
        font-weight: 900;
        background: #a05bf8;
        border-radius: 20px;
        color: #fff;
        line-height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        box-sizing: border-box;
        padding: 0;

        &:disabled {
          background: #e9e9e9;
          color: #999999;
        }
      }
      .cancel {
        font-weight: 400;
        color: #b0b0b0;
        background: transparent;
        margin-top: -10px;
        margin-bottom: 10px;
        background: transparent;
        box-shadow: none;
      }
    }

    .title {
      font-size: 16px;
      font-family: Roboto, Roboto;
      font-weight: bold;
      color: #000000;
      line-height: 19px;
      text-align: center;
      margin-bottom: 20px;
    }
    .tips {
      img {
        width: 295px;
        margin: -38px auto 15px;
      }
    }
    .stars {
      display: flex;
      justify-content: center;
      margin-right: -20px;
      img {
        width: 34px;
        margin-right: 20px;
      }
    }
    .input-area {
      margin: 24px 24px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      text-align: center;
      .tips1 {
        font-size: 11px;
        // font-family: Roboto, Roboto;
        font-weight: 900;
        color: #333333;
        line-height: 18px;
        margin-left: -5px;
        margin-right: -5px;
        span {
          color: #ff0000;
          font-size: 16px;
        }
      }
      textarea {
        width: 255px;
        height: 86px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        padding: 16px;
        font-size: 12px;
        font-weight: 400;
        resize: none;
        color: #333;
        line-height: 18px;
        text-align: left;
        box-sizing: border-box;
        font-family: Roboto-Regular, Roboto;
        word-break: break-word;
      }
    }
    .close {
      position: absolute;
      bottom: -54px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
