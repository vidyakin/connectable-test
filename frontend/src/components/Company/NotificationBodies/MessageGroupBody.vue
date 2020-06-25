<template>
  <div>
    <b>{{creator}}</b> создал новую группу:
    <i>
      <router-link :to="'/group/'+id">{{name}}</router-link>
    </i>
  </div>
</template>

<script>
export default {
  name: "MsgGroupBody",
  props: ["id", "creator", "name"]
};
</script>

<style>
</style>