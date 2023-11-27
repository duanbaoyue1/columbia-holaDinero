<template>
  <div class="content-area">
    <div class="header-frame"></div>
    <div class="content-frame">
      <div class="frame row-flex">
        <div class="title">Lunes – Sábado (9:30-18:30)</div>
      </div>
      <div class="frame row-flex">
        <div class="title">{{ feedEmail }}</div>
      </div>

      <div class="frame" v-for="(item, index) in questions" :key="index">
        <div class="row-space-between-center" @click="showAnswer(index)">
          <div class="desc-title">{{ item.desc }}</div>
        </div>

        <div v-if="item.isChecked" class="content" v-html="item.answer"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: "rapidocashcs01@outlook.com",
      questions: [
        {
          isChecked: false,
          desc: "¿Cuánto tardaré en recibir mi préstamo una vez aprobado?",
          answer:
            "Por lo general, los fondos tardan de 1 a 2 días hábiles en llegar, pero puede tardar hasta el tercer día hábil debido a la lentitud de procesamiento de los bancos, así que por favor sea paciente. Por favor, espere pacientemente. El tiempo de liberación está sujeto al tiempo real de llegada. <br /><br /> Recomendamos los siguientes cuatro bancos: Nequi, Bancolombia, Daviplata, que admiten préstamos en fin de semana y festivos y tienen un tiempo de llegada rápido.",
        },
        {
          isChecked: false,
          desc: "He realizado un pago pero mi pedido no se ha actualizado, ¿qué debo hacer?",
          answer:
            "Lamentamos que esté experimentando este problema, por favor tenga paciencia ya que los pagos pueden tardar hasta 24 horas en llegar. Si el pedido no se ha actualizado en más de 24 horas, póngase en contacto con nuestro servicio de atención al cliente por correo electrónico.",
        },
        {
          isChecked: false,
          desc: "¿Por qué ha fallado el pago del pedido?",
          answer:
            'La mayoría de las veces se debe a un problema con su cuenta bancaria receptora, así que cambie los datos de su cuenta bancaria receptora. <br /><br /> Puede cambiar su cuenta bancaria en la página "Mi - Cuenta Bancaria" y luego volver a solicitar el préstamo.',
        },
        {
          isChecked: false,
          desc: "¿Cómo puedo aumentar el importe de mi préstamo?",
          answer:
            "Nuestro sistema evaluará el importe de su préstamo en función de su solvencia, por lo que le rogamos que efectúe sus pagos puntualmente y mantenga un buen historial crediticio, ya que ello contribuirá a aumentar el importe de su préstamo.",
        },
        {
          isChecked: false,
          desc: "¿Por qué ha fallado mi solicitud de préstamo?",
          answer:
            "Lamentablemente, puede deberse a varias razones y determinamos la elegibilidad de cada prestatario basándonos en la lógica y los algoritmos que hemos establecido. Si tu préstamo no se aprueba, significa que tu perfil no se ajusta al algoritmo y al modelo de riesgo crediticio que hemos establecido.",
        },
      ],
    };
  },
  created() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "help Center",
    });
  },
  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, {
        ...this.questions[index],
        isChecked: !this.questions[index].isChecked,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-frame {
  width: 100%;
  height: 300px;
  position: relative;
  z-index: 1;
}
.logo {
  width: 100%;
  height: 300px;
}

.frame {
  width: 335px;
  background: #ffffff;
  border-radius: 16px;
  margin: 20px auto 0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 99;
}

.content-frame {
  margin-top: -190px;
  word-break: break-word;
}

.title {
  font-size: 16px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #0d0d0d;
  line-height: 19px;
  margin-left: 20px;
}

.desc-title {
  width: 257px;
  font-size: 16px;
  font-family: Roboto-Medium, Roboto;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
  word-break: break-word;
}

.content {
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #a7a7a7;
  line-height: 18px;
  margin-top: 10px;
}

.row-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
}

.row-space-between-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
