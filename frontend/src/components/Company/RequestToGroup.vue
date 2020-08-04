<template>
  <div class="post-wrapper">
    <div class="post-wrapper-body">
      <div class="post-wrapper-header">
        <div class="post-wrapper-header-photo">
          <a-avatar :src="(req.googleImage ? req.googleImage : require('@/assets/no_image.png'))" />
        </div>
        <div>
          <div class="post-wrapper-header-author">Заявка на вступление в группу</div>
          <div class="post-wrapper-header-time">{{req.created | asDateTime}}</div>
        </div>
      </div>
      <div class="post-wrapper-content">
        <div style="padding: 10px">
          <router-link :to="'/profile/'+req.userId">{{req.fullName}}</router-link>&nbsp;подал заявку на вступление в группу
          <router-link :to="'/group/'+req.groupId">{{req.groupName}}</router-link>
        </div>
        <div class="req-buttons" style="padding: 0 10px">
          <a-button
            type="primary"
            icon="check"
            @click="approve(req)"
            style="margin-right: 10px;"
          >Одобрить</a-button>
          <a-button type="danger" icon="close" @click="deleteParticipant(req)">Отклонить</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DELETE_PARTICIPANT,
  APPROVE_PARTICIPANTS_REQUEST,
  GET_REQUESTS_TO_MY_GROUPS,
} from "@/store/group/actions.type";
export default {
  props: ["req"],
  data() {
    return {};
  },
  filters: {
    asDateTime(d) {
      return new Date(d).toLocaleString();
    },
  },
  methods: {
    // для заявок
    approve({ groupId, userId }) {
      this.$store
        .dispatch(APPROVE_PARTICIPANTS_REQUEST, { groupId, userId })
        .then(() =>
          this.$notification["success"]({
            placement: "topRight",
            message: "Запрос одобрен",
            description: "Вступление в группу одобрено",
          })
        )
        .then((res) => {
          this.$store.dispatch(GET_REQUESTS_TO_MY_GROUPS, userId);
        })
        .catch((error) => {
          this.$notification["info"]({
            placement: "topRight",
            message: "Ошибка при одобрении заявки",
            description: error,
          });
        });
    },
    deleteParticipant({ groupId, userId }) {
      this.$store
        .dispatch(DELETE_PARTICIPANT, { groupId, userId })
        .then(() =>
          this.$notification["info"]({
            placement: "topRight",
            message: "Запрос отклонен",
            description: "Вступление в группу отклонено",
          })
        )
        .then((res) => {
          this.$store.dispatch(GET_REQUESTS_TO_MY_GROUPS, userId);
        })
        .catch((error) => {
          this.$notification["info"]({
            placement: "topRight",
            message: "Ошибка при отклонении заявки",
            description: error,
          });
        });
    },
  },
};
</script>

<style>
</style>