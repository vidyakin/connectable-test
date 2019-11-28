<template>
  <div class="group-view">
    <app-group-edit-drawer :visible="editVisible" :close="closeEdit" />
    <app-requests-drawer
      :visible="requestVisible"
      :close="closeRequests"
      v-if="currentGroup && currentGroup.type === 1"
    />
    <app-invite-drawer
      :visible="requestVisible"
      :close="closeRequests"
      v-if="currentGroup && currentGroup.type === 2"
    />

    <div class="group-body" >
      <div class="group-body-info">
        <div class="group-body-info-header">
          <div class="group-body-info-header-content">
            <div class="group-body-info-header-content-name">{{currentGroup && currentGroup.name}}</div>
            <div
              class="group-body-info-header-content-participants"
            >{{currentGroup && currentGroup.participants.length}}  {{currentGroup && endingWords(currentGroup.participants.length)}}</div>
          </div>
          <div class="group-body-info-header-action">
            <a-popover
              title="Действия с группой"
              trigger="click"
              v-model="visible"
              overlayClassName="group-header-action-popup-content"
              v-if="currentGroup && currentGroup.creatorId === userinfo._id"
            >
              <template slot="content">
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
                <a-tooltip title="Редактировать">
                  <a-button icon="edit" @click="editGroup"></a-button>
                </a-tooltip>
                <a-tooltip title="Заявки" >
                  <a-badge :count="currentGroup && currentGroup.requests.length" @click="hide">
                    <a-button icon="team" @click="openRequests"></a-button>
                  </a-badge>
                </a-tooltip>
              </template>
              <a-button icon="menu" class="open-action-button"></a-button>
            </a-popover>
          </div>
        </div>
        <div class="group-body-info-description">{{currentGroup && currentGroup.description}}</div>
        <template>
          <a-button
            type="primary"
            @click="createParticipant"
            v-if="currentGroup && currentGroup.type === 0 && currentGroup.participants &&
                    currentGroup.participants.findIndex(({_id}) =>_id === userinfo._id) === -1"
          >Вступить</a-button>
          <a-button
            type="primary"
            @click="createParticipantsRequest"
            v-if="currentGroup && currentGroup.type === 1 && currentGroup.participants &&
                    currentGroup.participants.findIndex(({_id}) =>_id === userinfo._id) === -1
 && !participantsRequest"
          >Подать заявку</a-button>
          <a-button
            @click="deleteParticipant"
            v-if="currentGroup && currentGroup.type === 1 && currentGroup.participants &&
                    currentGroup.participants.findIndex(({_id}) =>_id === userinfo._id) === -1
                    && participantsRequest"
          >Отменить заявку</a-button>
        </template>
      </div>
      <div class="group-body-participants">
        <div class="group-body-info-header-content-name">Участники</div>
        <div
          class="group-body-participants-participant"
          v-for="(participant, index) in currentGroup && currentGroup.participants"
          :key="index"
        >
          <a-avatar :src="(participant.googleImage ? participant.googleImage : require('../assets/no_image.png'))"></a-avatar>
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
    <template
      v-if="(currentGroup && currentGroup.type === 0 )||
       currentGroup && currentGroup.participants.findIndex(({_id}) => _id === userinfo._id) !== -1"
    >
      <app-comment-input :parent="{type: 'group', id: currentGroup && currentGroup._id}" />
      <app-post v-for="(post, index) in posts" :post="post" :key="index" />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { GET_POSTS } from '../store/post/actions.type';
import AppCommentInput from '../components/common/CommentInput';
import AppPost from '../components/common/Post';
import {
  CREATE_PARTICIPANT,
  DELETE_GROUP,
  DELETE_PARTICIPANT,
  GET_CURRENT_GROUP,
  GET_PARTICIPANTS_REQUEST,
} from '../store/group/actions.type';
import AppGroupEditDrawer from '../components/drawers/GroupEditDrawer';
import AppRequestsDrawer from '../components/drawers/RequestsDrawer';
import AppInviteDrawer from '../components/drawers/InviteDrawer';
import store from '../store';
export default {
  components: {
    AppCommentInput,
    AppPost,
    AppGroupEditDrawer,
    AppRequestsDrawer,
    AppInviteDrawer,
  },
  data() {
    return {
      editVisible: false,
      requestVisible: false,
      visible: false,
      output: '',
      userinfo: (store.getters.userData.result ? store.getters.userData.result : store.getters.user.result),
    };
  },
  methods: {
    endingWords(count) {
      if (count == 0) {
        this.output = 'нет участников';
      } else if (count == 1) {
        this.output = ' участник';
      } else if ((count > 20) && ((count % 10) == 1)) {
        this.output = ' участник';
      } else if (((count >= 2) && (count <= 4)) || (((count % 10) >= 2) && ((count % 10) <= 4)) && (count > 20)) {
        this.output = ' участника';
      } else {
        this.output = ' участников';
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
    deleteGroup() {
      this.$store.dispatch(DELETE_GROUP, this.currentGroup._id).then(() => {
        this.$router.push({ name: 'groups' });
      });
    },
    closeEdit() {
      this.editVisible = false;
    },
    openEdit() {
      this.editVisible = true;
    },
    createParticipant() {
      this.$store.dispatch(CREATE_PARTICIPANT, {
        participantId: this.userinfo._id,
        groupId: this.currentGroup._id,
      });
    },
    deleteParticipant() {
      this.$store
        .dispatch(DELETE_PARTICIPANT, {
          participantId: this.userinfo._id,
          groupId: this.currentGroup._id,
        })
        .then(() => this.checkParticipants());
    },
    createParticipantsRequest() {
      this.$store
        .dispatch(CREATE_PARTICIPANT, {
          participantId: this.userinfo._id,
          groupId: this.currentGroup._id,
          approved: false,
        })
        .then(() => this.checkParticipants());
    },
    checkParticipants() {
      this.$store.dispatch(GET_PARTICIPANTS_REQUEST, {
        groupId: this.currentGroup._id,
        participantId: this.userinfo._id,
      });
    },
  },
  beforeMount() {
    this.$store.dispatch(GET_CURRENT_GROUP, this.$route.params._id).then(() => {
      this.checkParticipants();
      this.$store.dispatch(GET_POSTS, {
        filter: {
          parent: {
            type: 'group',
            id: this.currentGroup._id,
          },
        },
      });
    });
  },
  computed: {
    ...mapGetters(['posts', 'currentGroup', 'user', 'userData', 'participantsRequest']),
  },
};
</script>

<style lang="scss">
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
      padding: 1rem;

      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

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
            padding-bottom: 20px;
          }

          &-participants {
            height: 15px;
            opacity: 0.5;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 2.08;
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
}
</style>