<template>
  <div class="event-block">
    <div class="title">{{event.name}}</div>
    <div>Описание: {{event.description}}</div>
    <div>Дата начала: {{(new Date(event.date)).toLocaleString()}}</div>
    <div>Окончание: {{(new Date(event.end)).toLocaleString()}}</div>
    <div>Создал: {{eventAuthorName(event)}}</div>
    <router-link to="/calendar">Перейти в календарь</router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["event"],
  computed: {
    ...mapGetters(["users"]),
  },
  methods: {
    eventAuthorName(event) {
      const user = this.users.find((u) => u._id == event.userId);
      return user == undefined
        ? "Пользователь не найден"
        : user.firstName + " " + user.lastName;
    },
  },
};
</script>

<style lang="scss">
.event-block {
  border: 1px solid darkgrey;
  border-radius: 6px;
  padding: 10px;
  width: 400px;
  .title {
    font-size: 14pt;
    font-weight: bold;
  }
}
</style>