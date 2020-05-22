<template>
  <div id="profile" class="group-view">
    <template v-if="isLoaded">
      <app-group-edit-drawer :visible="editVisible" :close="closeEdit" />
      <!-- запросы на вступление могут видеть в закрытых группых -->
      <app-requests-drawer
        :visible="requestVisible && currentGroup.type === 1"
        :close="closeRequests"
      />
      <!-- приглашать можно в закрытых и приватных -->
      <app-invite-drawer :visible="invitesVisible" :close="closeInvites" />
    </template>

    <div class="group-body" v-if="isLoaded">
      <div class="group-body-info">
        <div class="group-body-info-header">
          <div class="group-body-info-header-content">
            <div class="group-body-info-header-content-name">{{currentGroup.name}}</div>
            <div
              class="group-body-info-type"
            >{{['Открытая','Закрытая','Приватная'][currentGroup.type] }} группа</div>
            <div
              class="group-body-info-header-content-participants"
            >{{currentGroup.participants.length}} {{endingWords(currentGroup.participants.length)}}</div>
          </div>
          <!-- Заголовок группы с действиями -->
          <div class="group-body-info-header-action">
            <a-popover
              title="Действия с группой"
              trigger="click"
              v-model="visible"
              overlayClassName="group-header-action-popup-content"
              v-if="currentGroup.creatorId === userinfo._id || userIsAdmin"
            >
              <template slot="content">
                <!-- Удаление группы -->
                <a-popconfirm
                  title="Подтверите удаление"
                  okText="Подтверждаю"
                  cancelText="Отмена"
                  @confirm="deleteGroup"
                >
                  <a-tooltip title="Удалить">
                    <a-button icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
                <!-- Редактирование -->
                <a-tooltip title="Редактировать">
                  <a-button icon="edit" @click="editGroup"></a-button>
                </a-tooltip>
                <!-- Приглашение в закрытую или приватную группу -->
                <a-tooltip title="Пригласить" v-if="currentGroup.type >= 1">
                  <a-button icon="plus" @click="openInvites"></a-button>
                </a-tooltip>
                <!-- Список заявок в закрытую группу -->
                <a-tooltip title="Заявки" v-if="currentGroup.type === 1">
                  <a-badge :count="currentGroup.requests.length" @click="hide">
                    <a-button icon="team" @click="openRequests"></a-button>
                  </a-badge>
                </a-tooltip>
                <!-- Смена владельца группы (администратора) -->
                <a-tooltip title="Изменить владельца" v-if="userIsAdmin">
                  <a-button icon="crown" @click="openOwnerChange"></a-button>
                </a-tooltip>
              </template>
              <a-button icon="menu" class="open-action-button"></a-button>
            </a-popover>
          </div>
        </div>
        <div class="group-body-info-description">{{currentGroup.description}}</div>
      </div>
      <!-- УЧАСТНИКИ -->
      <div class="group-body-participants">
        <div class="group-body-participants-header">Участники ({{currentGroup.participants.length}})</div>
        <div
          class="group-body-participants-participant"
          v-for="(participant, index) in currentGroup.participants"
          :key="index"
        >
          <a-avatar
            :src="(participant.googleImage ? participant.googleImage : require('../assets/no_image.png'))"
          ></a-avatar>
          <div class="group-body-participants-participant-info">
            <div
              class="group-body-participants-participant-info-name"
            >{{participant.firstName + " " + participant.lastName}}</div>
            <div
              class="group-body-participants-participant-info-positions"
            >{{participant.positions.join(', ')}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- SPINNER while loading -->
    <a-spin size="large" v-else />
    <!-- Блок из поля ввода комментария и постов -->
    <template
      v-if="isLoaded && (currentGroup.type === 0 || currentGroup.participants.findIndex(i => i._id === userinfo._id) !== -1)"
    >
      <app-comment-input :parent="{type: 'group', id: currentGroup._id}" />
      <app-post v-for="(post, index) in posts" :post="post" :key="index" />
    </template>
    <!-- Блок кнопок для вступления в группу -->
    <template class="btn-additional" v-if="isLoaded">
      <a-button
        type="primary"
        @click="createParticipant"
        v-if="currentGroup.type === 0 && isAuthor"
      >Вступить</a-button>
      <a-button
        type="primary"
        @click="createParticipantsRequest"
        v-if="currentGroup.type === 1
              && isAuthor
              && !participantsRequest"
      >Подать заявку</a-button>
      <a-button
        type="primary"
        @click="deleteParticipant"
        v-if="currentGroup.type === 1   
            && isAuthor
            && participantsRequest"
      >Отменить заявку</a-button>
    </template>
    <!-- Диалог изменения владельца -->
    <group-owner-change-dialog
      :visible="changeOwnerVisible"
      @close="closeOwnerChange"
      :group="currentGroup"
    />
  </div>
</template>
<script>
import store from "../store";
import { mapGetters } from "vuex";

import { GET_POSTS } from "../store/post/actions.type";
import {
  CREATE_PARTICIPANT,
  DELETE_GROUP,
  DELETE_PARTICIPANT,
  GET_CURRENT_GROUP,
  GET_PARTICIPANTS_REQUEST
} from "../store/group/actions.type";

import AppCommentInput from "../components/common/CommentInput";
import AppPost from "../components/common/Post";
import AppGroupEditDrawer from "../components/drawers/GroupEditDrawer";
import AppRequestsDrawer from "../components/drawers/RequestsDrawer";
import AppInviteDrawer from "../components/drawers/InviteDrawer";
import GroupOwnerChangeDialog from "../components/modal/ChangeGroupOwner";

export default {
  components: {
    AppCommentInput,
    AppPost,
    AppGroupEditDrawer,
    AppRequestsDrawer,
    AppInviteDrawer,
    GroupOwnerChangeDialog
  },
  data() {
    return {
      isLoaded: false,
      editVisible: false,
      requestVisible: false,
      invitesVisible: false,
      changeOwnerVisible: false,
      visible: false,
      hovered: false,
      output: "",
      //currentGroup: null,
      userinfo: store.getters.userData.result
        ? store.getters.userData.result
        : store.getters.user.result,
      userIsAdmin: false
    };
  },
  computed: {
    ...mapGetters([
      "posts",
      "user",
      "currentGroup",
      "userData",
      "participantsRequest"
    ]),
    getGroupProp(f) {
      return this.currentGroup[f];
    },
    isAuthor() {
      return (
        this.currentGroup.participants &&
        this.currentGroup.participants.findIndex(
          i => i._id === this.userinfo._id
        ) === -1
      );
    }
  },
  methods: {
    endingWords(count) {
      if (count === 0) {
        this.output = "нет участников";
      } else if (count === 1) {
        this.output = " участник";
      } else if (count > 20 && count % 10 === 1) {
        this.output = " участник";
      } else if (
        (count >= 2 && count <= 4) ||
        (count % 10 >= 2 && count % 10 <= 4 && count > 20)
      ) {
        this.output = " участника";
      } else {
        this.output = " участников";
      }
      return this.output;
    },
    hide() {
      this.visible = false;
    },
    editGroup() {
      this.openEdit();
    },
    openRequests() {
      this.requestVisible = true;
    },
    closeRequests() {
      this.requestVisible = false;
    },
    openInvites() {
      this.invitesVisible = true;
    },
    closeInvites() {
      this.invitesVisible = false;
    },
    deleteGroup() {
      this.$store.dispatch(DELETE_GROUP, this.currentGroup._id).then(() => {
        this.$router.push({ name: "groups" });
      });
    },
    closeEdit() {
      this.editVisible = false;
    },
    openEdit() {
      this.editVisible = true;
    },
    openOwnerChange() {
      this.visible = false;
      this.changeOwnerVisible = true;
    },
    closeOwnerChange() {
      this.changeOwnerVisible = false;
    },
    // Работа с участниками группы
    createParticipant() {
      this.$store.dispatch(CREATE_PARTICIPANT, {
        participantId: this.userinfo._id,
        groupId: this.currentGroup._id
      });
    },
    deleteParticipant() {
      this.$store
        .dispatch(DELETE_PARTICIPANT, {
          participantId: this.userinfo._id,
          groupId: this.currentGroup._id
        })
        .then(() => this.checkParticipants());
    },
    createParticipantsRequest() {
      this.$store
        .dispatch(CREATE_PARTICIPANT, {
          participantId: this.userinfo._id,
          groupId: this.currentGroup._id,
          approved: false
        })
        .then(() => this.checkParticipants());
    },
    checkParticipants() {
      this.$store.dispatch(GET_PARTICIPANTS_REQUEST, {
        groupId: this.currentGroup._id,
        participantId: this.userinfo._id
      });
    }
  },
  async beforeMount() {},
  async beforeCreate() {
    await this.$store.dispatch(GET_CURRENT_GROUP, this.$route.params._id);
    //this.currentGroup = this.$store.getters.currentGroup;
    //console.log(`curr. group: ${this.currentGroup?._id}`);

    this.checkParticipants();
    await this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "group",
          id: this.currentGroup._id
        }
      }
    });
    this.isLoaded = true;
    this.userIsAdmin = this.$can("read", {
      accessEmail: this.userinfo.email,
      __type: "Admin"
    });
    console.log(`before create`);
  }
};
</script>

<style lang="scss">
.group-view .group-body-participants {
  overflow-y: scroll;
}
.groups-header {
  display: flex;
  margin: 1.5rem 0 1rem 0;
  justify-content: space-between;

  &-name {
    height: 31px;
    font-size: 24px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.67;
    letter-spacing: normal;
    text-align: left;
    color: #43425d;
  }
}

.group-view {
  height: calc(100vh - 210px);
  overflow: auto;
  padding: 30px;
  background-color: #f0f0f7;

  &-header {
    display: flex;
    margin: 1.5rem 3.125rem 1rem 3.125rem;
    justify-content: space-between;

    &-name {
      height: 31px;
      font-size: 24px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.67;
      letter-spacing: normal;
      text-align: left;
      color: #43425d;
    }
  }

  .group-body {
    margin: 1.5rem 0 1rem 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &-info {
      min-width: 15rem;
      width: calc(100% - 23rem);
      background-color: white;
      height: 19rem;
      border-radius: 0.25rem;
      padding: 24px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

      @media (max-width: 767px) {
        width: 100%;
        margin-bottom: 1rem;
      }

      &-header {
        display: flex;
        justify-content: space-between;

        &-content {
          &-name {
            /*height: 23px;*/
            font-size: 18px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 0.72;
            letter-spacing: normal;
            text-align: left;
            color: #4d4f5c;
            padding-bottom: 6px;
          }
          &-participants {
            height: 15px;
            opacity: 0.5;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            // line-height: 2.08;
            letter-spacing: normal;
            text-align: left;
            color: #43425d;
          }
        }

        &-action {
          .ant-btn {
            padding: 0;
          }
        }
      }

      &-type {
        color: royalblue;
        font-size: 10pt;
        text-align: left;
      }
      &-description {
        margin-top: 1.5rem;

        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.54;
        letter-spacing: normal;
        text-align: left;
        color: #000000;
        overflow: scroll;
      }
    }

    &-participants {
      min-width: 15rem;
      width: 22rem;
      background-color: white;
      height: 19rem;
      border-radius: 0.25rem;
      padding: 1rem;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

      &-header {
        font-size: 13px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }

      @media (max-width: 767px) {
        width: 100%;
      }

      &-participant {
        display: flex;
        margin-bottom: 10px;

        &-info {
          margin-left: 0.5rem;

          &-name {
            height: 17px;
            font-size: 13px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.85;
            letter-spacing: normal;
            text-align: left;
            color: #4d565c;
          }

          &-positions {
            height: 14px;
            font-size: 11px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.18;
            letter-spacing: normal;
            text-align: left;
            color: #808495;
          }
        }
      }
    }
  }

  .btn-additional {
    justify-self: left;
    display: flex;
  }
}
</style>