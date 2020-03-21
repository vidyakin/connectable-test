<template>
  <a-drawer
    title="Управление запросами"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <div class="requests-wrapper">
      <div class="request" v-for="participant in currentGroup.requests">
        <a-avatar :src="(participant.googleImage ? participant.googleImage : require('../../assets/no_image.png'))"></a-avatar>
        <div class="request-info">
          <div class="request-info-name">{{participant.firstName + " " + participant.lastName}}</div>
          <div class="request-info-positions">{{participant.positions.join(', ')}}</div>
        </div>
        <div class="request-actions">
          <a-popover
                  title="Действия с пользователем"
                  trigger="click"
                  overlayClassName="user-action-wrap"
          >
            <template slot="content">
              <div class="user-action">
                <a-button type="primary" icon="check" @click="approve(participant._id)"></a-button>
                <a-button type="danger" icon="close"  @click="deleteParticipant(participant._id)"></a-button>
              </div>
            </template>
            <a-button icon="menu" class="open-action-button"></a-button>
          </a-popover>


        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import AppInput from '../common/Input';
import { UPDATE_USER_INFO } from '../../store/user/actions.type';
import ATextarea from 'ant-design-vue/es/input/TextArea';
import store from '../../store';
import {
  CREATE_PARTICIPANT,
  DELETE_GROUP,
  DELETE_PARTICIPANT,
  GET_CURRENT_GROUP,
  GET_PARTICIPANTS_REQUEST,
} from '../../store/group/actions.type';
import {
  APPROVE_PARTICIPANTS_REQUEST,
  CREATE_GROUP,
  EDIT_GROUP,
} from '../../store/group/actions.type';

export default {
  name: 'AppUserEditDrawer',
  data() {
    return {
      current: '',
      createButtonSpinning: false,
      type: 1,
      userinfo: (store.getters.userData.result ? store.getters.userData.result : store.getters.user.result),
    };
  },
  components: {
    ATextarea,
    AppInput,
  },
  computed: {
    ...mapGetters(['user', 'currentGroup', 'posts', 'userData']),
  },
  methods: {
    onClose() {
      this.close();
    },
    approve(participantId) {
      this.$store.dispatch(APPROVE_PARTICIPANTS_REQUEST, {
        groupId: this.currentGroup._id,
        participantId,
      });
    },
    deleteParticipant(participantId) {
      this.$store
              .dispatch(DELETE_PARTICIPANT, {
                participantId: participantId,
                groupId: this.currentGroup._id,
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
  props: {
    close: Function,
    visible: Boolean,
  },
  beforeMount() { return; },
};
</script>

<style lang="scss">
  .user-action {
    display: flex;
  }
  .user-action button {
    display: block;
    margin: 0 auto;
  }
.requests-wrapper {
  .ant-btn {
    margin-left: 0.5rem;
  }

  .request {
    display: flex;
    padding: 0.5rem;
    justify-content: space-between;
    .ant-avatar {
      margin-right: 10px;
    }
    &-info {

      &-name {
        font-size: 13px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.3;
        letter-spacing: normal;
        text-align: left;
        color: #4d565c;
      }

      &-positions {
        font-size: 11px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.3;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }
    }
  }
}
</style>