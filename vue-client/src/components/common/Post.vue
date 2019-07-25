<template>
  <div class="post-wrapper">
    <div class="post-wrapper-body">
      <div class="post-wrapper-header">
        <div class="post-wrapper-header-photo">
          <a-avatar :src="post && post.author.googleImage"></a-avatar>
        </div>
        <div>
          <div class="post-wrapper-header-author">
            {{ post.author.firstName + ' ' + post.author.lastName }}
          </div>
          <div class="post-wrapper-header-time">
            {{ post && getMomentTime(post.created) }}
          </div>
        </div>
      </div>
      <div class="post-wrapper-content">
        <div>
          {{ post && post.message }}
        </div>
        <img :src="post && post.attachment && post.attachment[0].src" alt="" height="260"
             v-if="post.attachment[0] && post.attachment[0].type === 'image'">
        <video alt="" height="260" controls v-if="post.attachment[0] && post.attachment[0].type === 'video'">
          <source :src="post && post.attachment && post.attachment[0].src" type="video/mp4">
        </video>
        <div class="post-wrapper-content-likes">
          <div class="post-wrapper-content-likes-authors" v-if="post.likes && post.likes.length > 0">
            <a-icon type="like"></a-icon>
            {{ post.likes[0] && post.likes[0].author.firstName + ' ' + post.likes[0].author.lastName}}{{ post.likes[1]
            &&
            ', ' + post.likes[1].author.firstName + ' ' + post.likes[1].author.lastName}}
            <span v-if="post.likes.length > 2"> и еще {{post.likes && post.likes.length - 2 }}
          </span>
          </div>
        </div>

      </div>
      <div class="post-wrapper-footer">
        <span v-if="post.likes.findIndex(e => e.author._id === user._id) > -1">Вам нравится</span>
        <a-button icon="like" @click="like(post._id)" v-else>Нравится</a-button>
        <a-button icon="message" @click="commented">Комментировать</a-button>
      </div>
      <div class="post-wrapper-comments">
        <span @click="seeAllComment" v-if="post.comments.length > 2 && !allComment"
              class="post-wrapper-comments-open-all">Посмотреть ещё {{post.comments.length - 2}} комментариев</span>
        <span @click="closeAllComment" v-if="allComment" class="post-wrapper-comments-open-all">Скрыть</span>
        <app-comment v-if="!allComment"
                     v-for="comment in post.comments && post.comments.slice(post.comments.length - 2)"
                     :comment="comment"></app-comment>
        <app-comment v-if="allComment" v-for="comment in post.comments" :comment="comment"></app-comment>
      </div>
      <div class="post-comment-input" v-if="commenting">
        <a-avatar :src="user && user.googleImage"></a-avatar>
        <a-input class="comment-input" placeholder="Комментарий..." v-model="commentContent"
                 @pressEnter="sendComment(post._id)"></a-input>
      </div>
    </div>
    <div>
      <a-popover title="Действия с событием" trigger="click" overlayClassName="action-popup-content">
        <template slot="content">
          <a-tooltip title="Удалить">
            <a-icon type="delete" @click="deletePost"></a-icon>
          </a-tooltip>
          <a-tooltip title="Поделиться">
            <a-icon type="share-alt" @click="repost"></a-icon>
          </a-tooltip>
          <a-tooltip title="Редактировать">
            <a-icon type="edit" @click=""></a-icon>
          </a-tooltip>
        </template>
        <a-button icon="menu" class="open-action-button"></a-button>
      </a-popover>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import AppComment from './Comment'
  import {DELETE_POST, REPOST, SEND_COMMENT, SEND_LIKE, SEND_NEW_POST} from "../../store/post/actions.type";
  import moment from "moment";

  export default {
    name: "AppPost",
    components: {
      AppLoginBar,
      AppComment,
    },
    data() {
      return {
        current: '',
        commenting: false,
        commentContent: '',
        allComment: false,
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage', 'user']),
    },
    methods: {
      commented() {
        this.commenting = true;
      },
      getMomentTime(time) {
        return moment(time).fromNow(true);
      },
      like(postId) {
        const like = {
          parent: {type: 'post', id: postId},
          author: this.user,
        };
        this.$store.dispatch(SEND_LIKE, like);
      },
      sendComment(postId) {
        const comment = {
          parent: {type: 'post', id: postId},
          author: this.user,
          message: this.commentContent,
        };
        this.$store.dispatch(SEND_COMMENT, comment)
          .then(() => {
            this.commentContent = ''
          });
      },
      deletePost() {
        this.$store.dispatch(DELETE_POST, this.post._id)
      },
      seeAllComment() {
        this.allComment = true;
      },
      closeAllComment() {
        this.allComment = false;
      },
      repost() {
        const rePost = {...this.post};
        delete rePost._id;
        this.$store.dispatch(REPOST, {...rePost, likes: [], comments: [], parent: {type: 'user', id: this.user._id}});
      },
    },
    props: {
      post: Object,
    }
  }
</script>

<style lang="scss">

  .post-comment-input {
    margin: 1rem 0 !important;
    display: flex;
    width: 100%!important;

    img {
      height: 2rem!important;
      width: 2rem!important;
    };
  }

  .comment-input {
    margin: 0 1rem!important;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04) !important;
    width: calc(100% - 4rem) !important;
    height: 30px;
    background-color: #f5f6fa!important;

    .ant-input {
      border-radius: 60px;
      border-color: white !important;
      height: 3.125rem;

      &:focus {
        border-color: white !important;
        box-shadow: 0 0 0 0 white !important;
      }

    }
  }

  .post-wrapper {
    display: flex;
    justify-content: space-between;
    border-color: white;
    border-radius: 0.25rem;
    margin: 1.25rem 3.125rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    width: calc(100% - 6.25rem) !important;
    background-color: white;
    text-align: left;
    padding: 1.25rem;

    &-body {
      width: calc(100% - 1rem)
    }

    &-header {
      display: flex;

      &-author {
        color: #4d565c;
        font-size: 0.8125rem;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
      }

      &-time {
        font-size: 0.6875rem;
        color: #808495;
      }

      &-photo {
        margin-right: 0.625rem;
      }

    }

    &-content {
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;

      &-likes {
        margin-top: 1rem;

      }
    }

    &-footer {
      color: #4d565c;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: rgba(0, 0, 0, 0.1);

      .ant-btn {

        background-color: transparent;
        border: 0;

      }

    }
  }

  .post-wrapper-comments {

    margin-top: 1rem;

    &-open-all {
      &:hover {

        cursor: pointer;

      }
    }


  }

</style>