<template>
  <div class="group-view">
    <app-group-edit-drawer :visible="editVisible" :close="closeEdit"/>
    <div class="groups-header">
      <div class="groups-header-name">
        Группы
      </div>
    </div>
    <div class="group-body">
      <div class="group-body-info">
        <div class="group-body-info-header">
          <div class="group-body-info-header-content">
            <div class="group-body-info-header-content-name">
              {{currentGroup && currentGroup.name}}
            </div>
            <div class="group-body-info-header-content-participants">
              {{currentGroup && currentGroup.participants.length}} участников
            </div>
          </div>
          <div class="group-body-info-header-action">
            <a-popover title="Действия с группой" trigger="click" overlayClassName="group-header-action-popup-content">
              <template slot="content">
                <a-popconfirm title="Подтверите удаление？" okText="Подтверждаю" cancelText="Отмена" @confirm="deleteGroup">
                  <a-tooltip title="Удалить">
                    <a-button icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
                <a-tooltip title="Редактировать">
                  <a-button icon="edit" @click="editGroup"></a-button>
                </a-tooltip>
              </template>
              <a-button icon="menu" class="open-action-button"></a-button>
            </a-popover>
          </div>
        </div>
        <div class="group-body-info-description">
          {{currentGroup && currentGroup.description}}
        </div>
      </div>
      <div class="group-body-participants">
        <div class="group-body-participants-participant" v-for="participant in currentGroup && currentGroup.participants">
          <a-avatar :src="participant.googleImage"></a-avatar>
          <div class="group-body-participants-participant-info">
            <div class="group-body-participants-participant-info-name">
              {{participant.firstName + " " + participant.lastName}}
            </div>
            <div class="group-body-participants-participant-info-positions">
              {{participant.positions.join(', ')}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-comment-input :parent="{type: 'group', id: currentGroup && currentGroup._id}"/>
    <app-post v-for="post in posts" :post="post"/>
  </div>
</template>
<script>

  import {mapGetters} from "vuex";
  import {GET_POSTS} from "../store/post/actions.type";
  import AppCommentInput from "../components/common/CommentInput";
  import AppPost from "../components/common/Post";
  import {DELETE_GROUP, GET_CURRENT_GROUP} from "../store/group/actions.type";
  import AppGroupEditDrawer from "../components/drawers/GroupEditDrawer";

  export default {
    components: {
      AppCommentInput,
      AppPost,
      AppGroupEditDrawer
    },
    data() {
      return {
        editVisible: false,
      }
    },
    methods: {
      editGroup() {
        this.openEdit();
      },
      deleteGroup() {
        this.$store.dispatch(DELETE_GROUP, this.currentGroup._id)
          .then(() => {
            this.$router.push({name: 'groups'})
          })
      },
      closeEdit() {
        this.editVisible = false;
      },
      openEdit() {
        this.editVisible = true;
      },
    },
    beforeMount() {
      this.$store.dispatch(GET_CURRENT_GROUP, this.$route.params._id)
        .then(() => {
          this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'group', id: this.currentGroup._id}}});
        });
    },
    computed: {
      ...mapGetters(['posts', 'currentGroup']),
    }
  }
</script>

<style lang="scss">

  .group-view {
    height: calc(100vh - 3.125rem);
    overflow: auto;
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
      margin: 1.5rem 3.125rem 1rem 3.125rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &-info {
        min-width: 15rem;
        width: calc(100% - 17rem);
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
              height: 23px;
              font-size: 18px;
              font-weight: bold;
              font-style: normal;
              font-stretch: normal;
              line-height: 0.72;
              letter-spacing: normal;
              text-align: left;
              color: #4d4f5c;
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
        width: 15rem;
        background-color: white;
        height: 19rem;
        border-radius: 0.25rem;
        padding: 1rem;

        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

        &-participant {
          display: flex;

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