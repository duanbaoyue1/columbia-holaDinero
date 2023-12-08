<template>
  <iframe class="frame" src="https://www.cre-dicheck.com/helpCenter.html" />
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: "",
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
.frame {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
