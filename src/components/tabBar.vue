<template>
  <van-tabbar route name="fade" v-if="$route.meta.showTab">
    <van-tabbar-item replace to="/home">
      <span>Loans</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/loans.png')
              : require('@/assets/images/loans-not.png')
          "
        />
      </template>
    </van-tabbar-item>

    <van-tabbar-item
      v-if="showRepayment"
      replace
      to="/repayment"
      :badge="repaymentNum > 0 ? repaymentNum : ''"
    >
      <span>Repayment</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/repayment.png')
              : require('@/assets/images/repayment-not.png')
          "
        />
      </template>
    </van-tabbar-item>

    <van-tabbar-item replace to="/mine">
      <span>Me</span>
      <template #icon="props">
        <img
          class="tab-ber-img"
          :src="
            props.active
              ? require('@/assets/images/me.png')
              : require('@/assets/images/me-not.png')
          "
        />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    showRepayment: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['repaymentNum'])
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.tab-ber-img {
  width: 22px;
  height: 24px;
}
</style>
