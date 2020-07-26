<template>
  <div id="profile" class="group-view">
    <template v-if="isLoaded">
      <app-group-edit-drawer :visible="editVisible" :close="closeEdit" />
      <!-- запросы на вступление могут видеть в закрытых группых -->
      <!-- <app-requests-drawer
        :visible="requestVisible && currentGroup.type === 1"
        :close="closeRequests"
      />-->
      <!-- приглашать можно в закрытых и приватных -->
      <app-invite-drawer :visible="invitesVisible" :close="closeInvites" :group="currentGroup" />
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
            >{{currentGroup.participants_ref.length}} {{endingWords(currentGroup.participants_ref.length)}}</div>
          </div>
          <!-- Заголовок группы с действиями -->
          <div class="group-body-info-header-action">
            <a-popover
              title="Действия с группой"
              trigger="click"
              v-model="groupActionsVisible"
              overlayClassName="group-header-action-popup-content"
              v-if="currentGroup.creatorId === userData.result._id || userIsAdmin"
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
                <!-- <a-tooltip title="Заявки" v-if="currentGroup.type === 1">
                  <a-badge :count="currentGroup.requests_ref.length" @click="hide">
                    <a-button icon="team" @click="openRequests"></a-button>
                  </a-badge>
                </a-tooltip>-->
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
      <!-- ПРАВАЯ ПАНЕЛь -->
      <div>
        <!-- УЧАСТНИКИ -->
        <div class="group-body-items">
          <div class="header">Участники ({{currentGroup.participants_ref.length}})</div>
          <div class="item" v-for="(participant, index) in members" :key="index">
            <a-avatar
              :src="(participant.googleImage ? participant.googleImage : require('../assets/no_image.png'))"
            ></a-avatar>
            <div class="info">
              <div class="name">{{fio(participant)}}</div>
              <div class="positions">{{participant.positions && participant.positions.join(', ')}}</div>
            </div>
            <div class="icon">
              <a-icon type="crown" v-if="participant._id == currentGroup.creator" />
              <a-popconfirm
                placement="left"
                ok-text="Да"
                cancel-text="Нет"
                @confirm="deleteParticipant(participant._id)"
              >
                <template slot="title">
                  <p>
                    Удалить
                    <b>{{participant.firstName + " " + participant.lastName}}</b> из группы?
                  </p>
                </template>
                <a-button
                  class="btn-user-delete"
                  type="link"
                  v-if="user_id == currentGroup.creator && participant._id != currentGroup.creator"
                >
                  <a-icon type="user-delete" />
                </a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
        <!-- ЗАЯВКИ -->
        <div
          class="group-body-items"
          v-if="currentGroup.requests_ref.length && (currentGroup.creatorId === userData.result._id || userIsAdmin)"
        >
          <div class="header">Заявки ({{currentGroup.requests_ref.length}})</div>
          <div class="item" v-for="(req, index) in reqs" :key="index">
            <a-avatar
              :src="(req.googleImage ? req.googleImage : require('../assets/no_image.png'))"
            ></a-avatar>
            <div class="info">
              <div class="name">{{req.firstName + " " + req.lastName}}</div>
              <div class="positions">{{req.positions && req.positions.join(', ')}}</div>
              <div class="req-buttons">
                <a-button type="primary" icon="check" size="small" @click="approveRequest(req._id)"></a-button>
                <a-button type="danger" icon="close" size="small" @click="deleteRequest(req._id)"></a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- SPINNER while loading -->
    <a-spin size="large" v-else />
    <!-- Блок из поля ввода комментария и постов -->
    <template v-if="isLoaded && (currentGroup.type === 0 || userIsMember)">
      <app-comment-input :parent="{type: 'group', id: currentGroup._id}" />
      <app-post v-for="(post, index) in posts" :post="post" :key="index" />
    </template>
    <!-- Блок кнопок для вступления в группу -->
    <template class="btn-additional" v-if="isLoaded">
      <a-button
        type="primary"
        @click="createParticipant"
        v-if="currentGroup.type === 0 && !userIsMember"
      >Вступить</a-button>
      <a-button
        type="primary"
        @click="createParticipantsRequest"
        v-if="currentGroup.type === 1
              && !userIsMember
              && !userSentRequest"
      >Подать заявку</a-button>
      <a-button
        type="primary"
        @click="deleteOwnParticipant"
        v-if="currentGroup.type === 1   
            && !userIsMember
            && userSentRequest"
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
  DELETE_REQUEST,
  GET_CURRENT_GROUP,
  APPROVE_PARTICIPANTS_REQUEST,
  GET_PARTICIPANTS_REQUEST,
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
    GroupOwnerChangeDialog,
  },
  data() {
    return {
      isLoaded: false,
      editVisible: false,
      requestVisible: false,
      invitesVisible: false,
      changeOwnerVisible: false,
      visible: false,
      groupActionsVisible: false,
      hovered: false,
      output: "",
      //currentGroup: null,
      // userinfo: store.getters.userData.result
      //   ? store.getters.userData.result
      //   : store.getters.user.result
    };
  },
  computed: {
    ...mapGetters(["posts", "user", "currentGroup", "userData", "userIsAdmin"]),
    user_id() {
      return this.userData.result._id;
    },
    getGroupProp(f) {
      return this.currentGroup[f];
    },
    members() {
      return this.currentGroup.participants_ref.map((p) => p.user_ref);
    },
    reqs() {
      return this.currentGroup.requests_ref.map((p) => p.user_ref);
    },
    isAuthor() {
      return this.currentGroup.creator === this.user_id;
    },
    userIsMember() {
      return this.members.findIndex((user) => user._id === this.user_id) !== -1;
    },
    userSentRequest() {
      return !!this.currentGroup.requests_ref.find(
        (el) => el.user_ref._id.toString() == this.user_id
      );
    },
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
      this.groupActionsVisible = false;
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
      this.groupActionsVisible = false;
      this.changeOwnerVisible = true;
    },
    closeOwnerChange() {
      this.changeOwnerVisible = false;
    },
    // Работа с участниками группы
    createParticipant() {
      this.$store.dispatch(CREATE_PARTICIPANT, {
        groupId: this.currentGroup._id,
        userId: this.user_id,
      });
    },
    deleteOwnParticipant() {
      this.$store.dispatch(DELETE_PARTICIPANT, {
        groupId: this.currentGroup._id,
        userId: this.user_id,
      });
      //.then(() => this.checkParticipants());
    },
    createParticipantsRequest() {
      this.$store.dispatch(CREATE_PARTICIPANT, {
        groupId: this.currentGroup._id,
        userId: this.user_id,
      });
      //.then(() => this.checkParticipants());
    },
    approveRequest(userId) {
      this.$store
        .dispatch(APPROVE_PARTICIPANTS_REQUEST, {
          groupId: this.currentGroup._id,
          userId,
        })
        .then(() => {});
    },
    deleteRequest(userId) {
      this.$store.dispatch(DELETE_REQUEST, {
        groupId: this.currentGroup._id,
        userId,
      });
      //.then(() => this.checkParticipants());
    },
    deleteParticipant(userId) {
      this.$store.dispatch(DELETE_PARTICIPANT, {
        groupId: this.currentGroup._id,
        userId,
      });
      //.then(() => this.checkParticipants());
    },
    fio(participant) {
      return participant.firstName == undefined
        ? "<DELETED>"
        : participant.firstName + " " + participant.lastName;
    },
    // checkParticipants() {
    //   this.$store.dispatch(GET_PARTICIPANTS_REQUEST, {
    //     groupId: this.currentGroup._id,
    //     participantId: this.user_id,
    //   });
    // },
  },
  async beforeMount() {},
  async beforeCreate() {
    await this.$store.dispatch(GET_CURRENT_GROUP, this.$route.params._id);
    //this.currentGroup = this.$store.getters.currentGroup;
    //console.log(`curr. group: ${this.currentGroup?._id}`);

    //this.checkParticipants();
    await this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "group",
          id: this.currentGroup._id,
        },
      },
    });
    this.isLoaded = true;
    console.log(`before create`);
  },
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

    &-items {
      min-width: 15rem;
      width: 22rem;
      background-color: white;
      // height: 19rem;
      border-radius: 0.25rem;
      padding: 1rem;
      margin-bottom: 5px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

      & .header {
        font-size: 13px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
      }

      @media (max-width: 767px) {
        width: 100%;
      }

      & .item {
        display: flex;
        margin-bottom: 10px;

        & .info {
          margin-left: 0.5rem;
          flex-grow: 1;

          & .name {
            height: 17px;
            font-size: 13px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.85;
            text-align: left;
            color: #4d565c;
          }

          & .positions {
            height: 14px;
            font-size: 11px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.18;
            text-align: left;
            color: #808495;
          }
        }
        & .icon {
          color: goldenrod;
          & .btn-user-delete {
            padding: 0;
            &:hover {
              color: red;
            }
          }
        }
      }
    }
  }

  .btn-additional {
    justify-self: left;
    display: flex;
  }

  .req-buttons button {
    margin-right: 10px;
  }
}
</style>