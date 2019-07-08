<template>
  <div>
    <div class="label">{{ label }}</div>
    <a-input v-bind="$attrs" v-on="$listeners" class="basic-input"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default Vue.extend({
    name: 'AppInput',
    props: {
      label: String,
    },
  });
</script>

<style scoped lang="scss">
  .label {
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
  }
  .basic-input {
    height: 2.5rem;
    border-radius: 0;
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.08);
    line-height: 2.5rem;
    width: 100%;
  }
</style>