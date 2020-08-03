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
            @click="approve(req.groupId, req.userId)"
            style="margin-right: 10px;"
          >Одобрить</a-button>
          <a-button
            type="danger"
            icon="close"
            @click="deleteParticipant(req.groupId, req.userId)"
          >Отклонить</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    approve(groupId, participantId) {
      this.$store
        .dispatch(APPROVE_PARTICIPANTS_REQUEST, {
          groupId,
          participantId,
        })
        .then(() =>
          this.$notification["success"]({
            placement: "topRight",
            message: "Запрос одобрен",
            description: "Вступление в группу одобрено",
          })
        )
        .then(() => this.checkParticipants());
    },
    deleteParticipant(groupId, participantId) {
      this.$store
        .dispatch(DELETE_PARTICIPANT, {
          groupId,
          participantId,
        })
        .then(() =>
          this.$notification["info"]({
            placement: "topRight",
            message: "Запрос отклонен",
            description: "Вступление в группу отклонено",
          })
        )
        .then(() => this.checkParticipants());
    },
  },
};
</script>

<style>
</style>