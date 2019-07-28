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
        <a-avatar :src="participant.googleImage"></a-avatar>
        <div class="request-info">
          <div class="request-info-name">
            {{participant.firstName + " " + participant.lastName}}
          </div>
          <div class="request-info-positions">
            {{participant.positions.join(', ')}}
          </div>
        </div>
        <div class="request-actions">
          <a-button type="primary" icon="check" @click="approve(participant._id)"></a-button>
          <a-button type="danger" icon="close"></a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppInput from '../common/Input'
  import {UPDATE_USER_INFO} from "../../store/user/actions.type";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {APPROVE_PARTICIPANTS_REQUEST, CREATE_GROUP, EDIT_GROUP} from "../../store/group/actions.type";

  export default {
    name: "AppUserEditDrawer",
    data() {
      return {
        current: '',
        createButtonSpinning: false,
        type: 1,
      }
    },
    components: {
      ATextarea,
      AppInput,
    },
    computed: {
      ...mapGetters(['user', 'currentGroup']),
    },
    methods: {
      onClose() {
        this.close();
      },
      approve(participantId) {
        this.$store.dispatch(APPROVE_PARTICIPANTS_REQUEST, {
          groupId: this.currentGroup._id,
          participantId,
        })
      },
    },
    props: {
      close: Function,
      visible: Boolean,
    },
    beforeMount() {
    },
  }
</script>

<style lang="scss">
  .requests-wrapper {
    .ant-btn {
      margin-left: 0.5rem;
    }

    .request {
      display: flex;
      padding: .5rem;

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
</style>