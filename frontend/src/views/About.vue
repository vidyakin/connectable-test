<template>
  <div class="about">
    <div class="about-name">О нас</div>
  </div>
</template>

<style lang="scss">
  .is-hide-img-header{
    .about {
      height: calc(100vh - 50px);
    }
  }
  .about {
    padding: 30px;
    background-color: #f0f0f7;
    height: calc(100vh - 210px);
    overflow: auto;

    @media (max-width: 767px) {
      padding: 20px 15px;
    }
    &-name {
      font-size: 1.5rem;
      line-height: 32px;
      color: #43425d;
      text-align: left;
      margin-bottom: 30px;
    }
  }
</style>