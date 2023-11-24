<template>
  <div>
    <div class="title">Quiénes somos</div>
    <div class="row-space-between-center">
      <div class="frame" style="padding: 19px 16px 16px">
        <m-icon type="easy-application" :width="74" :height="50" />
        <div>EI proceso fácil</div>
      </div>
      <div class="frame" style="padding: 24px 16px 16px">
        <m-icon type="low-interest-rate" :width="66" :height="45" />
        <div>Bajo interés</div>
      </div>
      <div class="frame" style="padding: 16px 16px 12px">
        <m-icon type="realtime-disbursament" :width="50" :height="52" />
        <div class="column-direction-center">
          <div>Aprobación</div>
          <div>rápida</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang='scss' scoped>
.title {
  font-size: 20px;
  font-family: Roboto, Roboto;
  font-weight: bold;
  color: #343434;
  line-height: 24px;
  margin-top: 16px;
}

.frame {
  width: 106px;
  height: 120px;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  margin-top: 8px;
  box-sizing: border-box;
  font-size: 10px;
  font-family: Roboto, Roboto;
  font-weight: 400;
  color: #333333;
  line-height: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;
}
</style>