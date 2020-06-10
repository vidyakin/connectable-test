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
      <div class="request" v-for="participant in currentGroup.requests" :key="participant._id">
        <div style="display: flex; margin: 5px 0;">
          <a-avatar
            :src="(participant.googleImage ? participant.googleImage : require('../../assets/no_image.png'))"
          ></a-avatar>
          <div class="request-info">
            <div class="request-info-name">{{participant.firstName + " " + participant.lastName}}</div>
            <div class="request-info-positions">{{participant.positions.join(', ')}}</div>
          </div>
        </div>
        <div class="request-actions">
          <div class="user-action" slot="content">
            <a-button type="primary" icon="check" size="small" @click="approve(participant._id)"></a-button>
            <a-button
              type="danger"
              icon="close"
              size="small"
              @click="deleteParticipant(participant._id)"
            ></a-button>
          </div>
          <!-- <a-popover
            title="Действия с пользователем"
            v-model="popoverVisible"
            placement="bottomRight"
            trigger="click"
            overlayClassName="user-action-popover"
          >
            <div class="user-action" slot="content">
              <a-button type="primary" icon="check" @click="approve(participant._id)"></a-button>
              <a-button type="danger" icon="close" @click="deleteParticipant(participant._id)"></a-button>
            </div>
            <a-button icon="menu"></a-button> 
          </a-popover>-->
        </div>
      </div>

      <div v-if="!currentGroup.requests.length">Нет заявок на вступление в группу</div>
    </div>
  </a-drawer>
</template>

<script>
import store from "../../store";
import { mapGetters } from "vuex";

import {
  CREATE_PARTICIPANT,
  DELETE_GROUP,
  DELETE_PARTICIPANT,
  GET_CURRENT_GROUP,
  GET_PARTICIPANTS_REQUEST
} from "../../store/group/actions.type";
import {
  APPROVE_PARTICIPANTS_REQUEST,
  CREATE_GROUP,
  EDIT_GROUP
} from "../../store/group/actions.type";

import AppInput from "../common/Input";
import ATextarea from "ant-design-vue/es/input/TextArea";

export default {
  name: "AppRequestsDrawer",
  data() {
    return {
      current: "",
      createButtonSpinning: false,
      type: 1,
      popoverVisible: false,
      userinfo: store.getters.userData.result
        ? store.getters.userData.result
        : store.getters.user.result
    };
  },
  mounted() {
    console.log("Заявки ", this.currentGroup.requests);
  },
  components: {
    ATextarea,
    AppInput
  },
  computed: {
    ...mapGetters(["user", "currentGroup", "posts", "userData"])
  },
  methods: {
    onClose() {
      this.close();
    },
    approve(participantId) {
      this.$store.dispatch(APPROVE_PARTICIPANTS_REQUEST, {
        groupId: this.currentGroup._id,
        participantId
      });
    },
    deleteParticipant(participantId) {
      this.$store
        .dispatch(DELETE_PARTICIPANT, {
          participantId: participantId,
          groupId: this.currentGroup._id
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
  props: {
    close: Function,
    visible: Boolean
  },
  beforeMount() {
    return;
  }
};
</script>

<style lang="scss">
.user-action {
  display: flex;
  // justify-content: center;
  margin-left: 35px;

  &-popover {
    z-index: 200;
  }
}
.user-action button {
  display: block;
  // margin: 0 auto;
}
.requests-wrapper {
  .ant-btn {
    margin-left: 0.5rem;
  }

  .request {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    // justify-content: space-between;
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