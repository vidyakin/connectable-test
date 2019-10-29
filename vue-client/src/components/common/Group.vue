<template>
  <div class="group">
    <div class="group-header">
      <div class="group-header-content">
        <div class="group-header-content-name" @click="redirectToGroup">{{group.name}}</div>
        <div class="group-header-content-count">{{group.participants.length}} участников</div>
      </div>
      <div class="group-header-action" v-if="$can('read', {'accessEmail': datauser.email, '__type': 'User'})">
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
    <div class="group-content" v-if="group.participants">
      <div class="group-content-participant" v-for="participant in group.participants">
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
      this.$store.dispatch(DELETE_GROUP, this.group._id);
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
    /*justify-content: center;*/
    .ant-btn {
      border: 0;
      background-color: transparent;
    }
  }
}
.group {
  width: 16rem;
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

    &-content {
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

    &-participant {
      display: flex;
      padding: 1rem;

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