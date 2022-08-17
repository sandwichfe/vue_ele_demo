<template>
  <div class="back-top">
    <svg-icon iconClass="backtop" className="bt-icon"></svg-icon>
  </div>
</template>

<script>
export default {
  name: "BackTop",
};
</script>

<style scoped>
.back-top {
  position: fixed;
  right: 12%;
  bottom: 80px;
}
.back-top .bt-icon {
  width: 43px;
  height: 43px;
  fill: currentColor;
  color: #c8dae2;
  opacity: 0.4;
  cursor: pointer;
}
</style>