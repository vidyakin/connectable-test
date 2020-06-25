<template>
  <div>
    <router-link :to="'/user/'+id">{{name}}</router-link>, добро пожаловать в команду!
  </div>
</template>

<script>
export default {
  name: "MsgEmplBody",
  props: ["id", "name"]
};
</script>

<style>
</style>