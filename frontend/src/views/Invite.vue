<template>
  <div>
    <a-modal
      title="Приглашение"
      v-if="invite"
      okText="Принять"
      cancelText="Отказаться"
      @ok="approveInvite"
      @cancel="cancelInvite"
      :visible="true"
    >
      <div>
        Вас приглашают в группу
        <span style="font-weight: bold">{{invite.group.name}}</span>
      </div>
    </a-modal>
    <div v-if="!invite" class="unavailable-invite">Данное приглашение больше недоступно</div>
  </div>
</template>

<script>
import {
  APPROVE_INVITE,
  CANCEL_INVITE,
  GET_INVITE,
} from "../store/group/actions.type";
import { mapGetters } from "vuex";
import { SET_INVITE } from "../store/group/mutations.type";

export default {
  name: "AppInvite",
  beforeCreate() {
    this.$store.dispatch(GET_INVITE, this.$route.params._id);
  },
  computed: {
    ...mapGetters(["invite"]),
  },
  methods: {
    approveInvite() {
      this.$store.dispatch(APPROVE_INVITE, this.invite._id).then(() => {
        this.$router.push({
          name: "group",
          params: { _id: this.invite.group._id },
        });
        this.$store.commit(SET_INVITE, null);
      });
    },
    cancelInvite() {
      this.$store.dispatch(CANCEL_INVITE, this.invite._id).then(() => {
        this.$router.push({ name: "company" });
        this.$store.commit(SET_INVITE, null);
      });
    },
  },
};
</script>

<style lang="scss">
.unavailable-invite {
  border: 1px solid indianred;
  border-radius: 10px;
  padding: 30px;
  margin: 30px auto;
  width: 400px;
  text-align: center;
  background-color: lavender;
  font-size: 12pt;
  font-weight: bold;
}
</style>