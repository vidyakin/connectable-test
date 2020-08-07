<template>
  <div class="page-404">
    <div class="head">404</div>
    <div class="title">страница не найдена</div>
    <div>
      <router-link to="/company">На главную</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.page-404 {
  margin: 100px auto;
  text-align: center;
  .head {
    font-size: 36pt;
  }
  .title {
    font-size: 20pt;
  }
}
</style>