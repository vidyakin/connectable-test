<template>
  <div class="company">
    <app-comment-input/>
    <div class="company-name">
      Компания
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AppCommentInput from '../components/common/CommentInput'

  export default Vue.extend({
    name: 'AppCompany',
    components: {
      AppCommentInput
    },
  });
</script>

<style lang="scss">

  .company {
    background-color: #f0f0f7;
    height: 100vh;
    &-name {
      font-size: 1.5rem;
      color: #43425d;
      text-align: left;
      margin-left: 3.125rem;
    }

  }

</style>