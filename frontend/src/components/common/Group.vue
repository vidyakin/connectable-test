<template>
  <!-- Приватная группа, когда пользователь это ее создатель -->
  <!-- <div class="group" v-if="group.type === 2 && group.creatorId === datauser._id || userIsAdmin"> -->
  <div class="group" v-if="groupVisible">
    <div class="header" :class="group.type === 2 ? 'private' : ''">
      <div class="title">
        <div class="title-name" @click="redirectToGroup">{{group.name}}</div>
        <div
          class="title-count"
        >{{group.participants_ref.length}} {{group && endingWords(group.participants_ref.length)}}</div>
        <div
          class="title-type"
        >{{['Открытая группа','Закрытая группа','Приватная группа'][group.type]}}</div>
      </div>
      <!-- Меню действий для админа/владельца -->
      <div class="action" v-if="group && group.creatorId === datauser._id || userIsAdmin">
        <a-popover
          title="Действия с группой"
          trigger="click"
          v-model="groupActionPopoverVisible"
          overlayClassName="popup-content"
        >
          <template slot="content">
            <a-popconfirm
              title="Подтверите удаление группы"
              okText="Подтверждаю"
              cancelText="Отмена"
              @confirm="deleteGroup"
            >
              <a-tooltip title="Удалить!">
                <a-button icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <a-button icon="menu" class="open-action-button"></a-button>
        </a-popover>
      </div>
    </div>
    <!-- GROUP CONTENT -->
    <div class="content" v-if="group.participants_ref" @click="redirectToGroup">
      <div
        :class="['participant', participant._id == group.creator ? 'creator' : '']"
        v-for="participant in group.participants_ref.map(p => p.user_ref)"
        :key="participant._id"
      >
        <!--<a-avatar :src="participant.googleImage"></a-avatar>-->
        <div class="info">
          <div class="name">{{ fullName(participant) | undefReplace }}</div>
          <div class="positions">{{participant.positions && participant.positions.join(', ')}}</div>
        </div>
        <a-icon class="img-creator" type="crown" v-if="participant._id == group.creator" />
      </div>
    </div>
  </div>
  <!-- Остальные группы -->
  <!-- <div class="group" v-else-if="group.type != 2">
    <div class="group-header">
      <div class="group-header-content">
        <div class="group-header-content-name" @click="redirectToGroup">{{group.name}}</div>
        <div class="group-header-content-count">{{group.participants.length}} {{group && endingWords(group.participants.length)}}</div>
      </div>
      <! -- v-if="$can('read', {'accessEmail': datauser.email, '__type': 'User'})"-- >
      <div class="group-header-action" v-if="group && group.creatorId === datauser._id || userIsAdmin" >
        <a-popover title="Действия с группой" trigger="click" overlayClassName="group-header-action-popup-content">
          <template slot="content">
            <a-popconfirm
                title="Подтверите удаление группы"
                okText="Подтверждаю"
                cancelText="Отмена"
                @confirm="deleteGroup"
              >          
              <a-tooltip title="Удалить!">
                <a-button icon="delete" @click="deleteGroup"></a-button>
              </a-tooltip>            
            </a-popconfirm>
          </template>
          <a-button icon="menu" class="open-action-button"></a-button>
        </a-popover>
      </div>
    </div>
    <div class="group-content" v-if="group.participants" @click="redirectToGroup">
      <div class="group-content-participant" v-for="participant in group.participants" :key="participant._id">
        <! -- <a-avatar :src="participant.googleImage"></a-avatar> - ->
        <div class="group-content-participant-info">
          <div class="group-content-participant-info-name">{{participant.firstName + " " + participant.lastName}}</div>
          <div class="group-content-participant-info-positions">{{participant.positions.join(', ')}}</div>
        </div>
      </div>
    </div>
  </div>-->
</template>

<script>
import { mapGetters } from "vuex";
import { DELETE_GROUP } from "@/store/group/actions.type";
import store from "../../store";
export default {
  name: "AppGroup",
  data() {
    return {
      groupActionPopoverVisible: false,
      datauser: store.getters.userData
        ? store.getters.userData.result
        : store.getters.user,
      output: "",
    };
  },
  beforeMount() {
    const null_prt = this.group.participants_ref.findIndex((e) => e == null);
    console.log(
      `before mount, ${null_prt != -1 ? "есть пустые участники группы" : ""}`
    );
  },
  mounted() {
    //console.log(`mounted`);
  },
  props: {
    group: Object,
  },
  computed: {
    ...mapGetters(["userData", "userIsAdmin"]),
  },
  // created() {
  //   console.log(
  //     `>> Group created: dataUser is ${JSON.stringify(
  //       this.datauser,
  //       null,
  //       3
  //     )}, group: ${this.group}`
  //   );
  // },
  filters: {
    undefReplace(val) {
      return val == undefined ? "<DELETED>" : val;
    },
  },
  methods: {
    deleteGroup() {
      this.$store.dispatch(DELETE_GROUP, this.group._id).then(() => {
        this.groupActionPopoverVisible = false;
        this.$notification["success"]({
          message: "Група удалена",
          placement: "topRight",
        });
      });
    },
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
    redirectToGroup() {
      this.$router.push({ name: "group", params: { _id: this.group._id } });
    },
    groupVisible() {
      return (
        this.group.type !== 2 ||
        (this.group.type === 2 && this.group.creatorId === this.datauser._id) ||
        this.userIsAdmin
      );
    },
    fullName(participant) {
      return participant.firstName == undefined
        ? "<DELETED>"
        : participant.firstName + " " + participant.lastName;
    },
  },
};
</script>

<style lang="scss">
.group {
  min-width: 16rem;
  max-width: 16rem;
  background-color: white;
  height: 313.8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  margin-right: 2rem;
  margin-bottom: 2rem;

  & .header {
    background-color: #f5f6fa;
    height: 4rem;
    padding: 0.75rem 0.5rem 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;

    & .private {
      background-color: lavender;
    }

    & .title {
      max-width: 90%;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .title-name {
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
        // overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          cursor: pointer;
        }
      }

      .title-count {
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
      .title-type {
        font-size: 9pt;
        align-self: flex-end;
        color: grey;
      }
    }

    .action {
      .ant-btn {
        padding: 0;
      }

      .popup-content {
        text-align: center;

        // .ant-popover-inner-content {
        // display: flex;
        // justify-content: center;
        // .ant-btn {
        //   border: 0;
        //   background-color: transparent;
        // }
        // }
      }
    }
  }

  & > .content {
    // height: 16rem;
    background-color: white;
    overflow: auto;
    width: 100%;
    cursor: pointer;

    .participant {
      display: flex;
      position: relative;
      padding: 5px 1rem;

      // &:hover {
      //   background-color: cornsilk;
      // }

      .info {
        margin-left: 0.5rem;

        .name {
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

        .positions {
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

      &.creator {
        background-color: lavender;
      }
    }
    .img-creator {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}
</style>