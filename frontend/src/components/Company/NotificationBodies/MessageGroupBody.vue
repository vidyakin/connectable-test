<template>
  <div>
    <b>{{creator}}</b> создал новую группу:
    <i>
      <router-link :to="'/group/'+id">{{getGroupName}}</router-link>
    </i>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "MsgGroupBody",
  props: ["id", "creator", "name"],
  computed: {
    ...mapGetters(["groups"]),
    getGroupName() {
      const group = this.groups.find((g) => g._id == this.id);
      return group ? group.name : `not found (id ${this.id})`;
    },
  },
};
</script>

<style>
</style>