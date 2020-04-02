<template>
  <div class="group" v-if="group.type === 2 && group.creatorId === datauser._id">
    <div class="group-header">
      <div class="group-header-content">
        <div class="group-header-content-name" @click="redirectToGroup">{{group.name}}</div>
        <div class="group-header-content-count">{{group.participants.length}} {{group && endingWords(group.participants.length)}}</div>
      </div>
      <div class="group-header-action" v-if="group && group.creatorId === datauser._id" >
        <a-popover
          title="Действия с группой"
          trigger="click"
          overlayClassName="group-header-action-popup-content"
        >
          <template slot="content">
            <a-tooltip title="Удалить">
              <a-button icon="delete" @click="deleteGroup"></a-button>
            </a-tooltip>
          </template>
          <a-button icon="menu" class="open-action-button"></a-button>
        </a-popover>
      </div>
    </div>
    <div class="group-content" v-if="group.participants" @click="redirectToGroup">
      <div class="group-content-participant" v-for="participant in group.participants" :key="participant._id">
        <!--<a-avatar :src="participant.googleImage"></a-avatar>-->
        <div class="group-content-participant-info">
          <div
            class="group-content-participant-info-name"
          >{{participant.firstName + " " + participant.lastName}}</div>
          <div class="group-content-participant-info-positions">{{participant.positions.join(', ')}}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="group" v-else-if="group.type != 2">
    <div class="group-header">
      <div class="group-header-content">
        <div class="group-header-content-name" @click="redirectToGroup">{{group.name}}</div>
        <div class="group-header-content-count">{{group.participants.length}} {{group && endingWords(group.participants.length)}}</div>
      </div>
      <!--v-if="$can('read', {'accessEmail': datauser.email, '__type': 'User'})"-->
      <div class="group-header-action" v-if="group && group.creatorId === datauser._id" >
        <a-popover
                title="Действия с группой"
                trigger="click"
                overlayClassName="group-header-action-popup-content"
        >
          <template slot="content">
            <a-tooltip title="Удалить">
              <a-button icon="delete" @click="deleteGroup"></a-button>
            </a-tooltip>
          </template>
          <a-button icon="menu" class="open-action-button"></a-button>
        </a-popover>
      </div>
    </div>
    <div class="group-content" v-if="group.participants" @click="redirectToGroup">
      <div class="group-content-participant" v-for="participant in group.participants" :key="participant._id">
        <!--<a-avatar :src="participant.googleImage"></a-avatar>-->
        <div class="group-content-participant-info">
          <div
                  class="group-content-participant-info-name"
          >{{participant.firstName + " " + participant.lastName}}</div>
          <div class="group-content-participant-info-positions">{{participant.positions.join(', ')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  DELETE_GROUP,
} from '@/store/group/actions.type';
import store from '../../store';
export default {
  name: 'AppGroup',
  data() {
    return {
      datauser: (store.getters.userData ? store.getters.userData.result : store.getters.user ),
      output: '',
    };
  },
  props: {
    group: Object,
  },
  computed: {
    ...mapGetters(['userData']),
  },
  methods: {
    deleteGroup() {
      this.$store.dispatch(DELETE_GROUP, this.group._id).then(() => {
        this.$notification['success']({
          message: 'Група удалена',
          placement: 'topRight'
        });
      });
    },
    endingWords(count) {
      if (count === 0) {
        this.output = 'нет участников';
      } else if (count === 1) {
        this.output = ' участник';
      } else if ((count > 20) && ((count % 10) === 1)) {
        this.output = ' участник';
      } else if (((count >= 2) && (count <= 4)) || (((count % 10) >= 2) && ((count % 10) <= 4)) && (count > 20)) {
        this.output = ' участника';
      } else {
        this.output = ' участников';
      }
      return this.output;
    },
    redirectToGroup() {
      this.$router.push({ name: 'group', params: { _id: this.group._id } });
    },
  },
};
</script>

<style lang="scss">
.group-header-action-popup-content {
  .ant-popover-inner-content {
    display: flex;
    justify-content: center;
    .ant-btn {
      border: 0;
      background-color: transparent;
    }
  }
}
.group {
  min-width: 16rem;
  max-width: 16rem;
  background-color: white;
  height: 313.8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  margin-right: 2rem;
  margin-bottom: 2rem;
  &-header {
    background-color: #f5f6fa;
    height: 4rem;
    padding: 0.75rem 0.5rem 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    &-content {
      max-width: 90%;

      &-name {
        height: 20px;
        font-size: 16px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #949494;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          cursor: pointer;
        }
      }

      &-count {
        height: 13px;
        font-size: 10px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.3;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }
    }

    &-action {
      .ant-btn {
        padding: 0;
      }
    }
  }

  &-content {
    height: 16rem;
    background-color: white;
    overflow: auto;
    cursor: pointer;

    &-participant {
      display: flex;
      padding: 5px 1rem;

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
</style>