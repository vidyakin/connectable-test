<template>
  <div class="comment-wrapper">

    <div class="comment-wrapper-avatar">
      <a-avatar :src="comment.author.googleImage"></a-avatar>
    </div>

    <div class="comment-wrapper-content">
      <div class="comment-wrapper-content-text">
        <div class="comment-wrapper-content-text-author">
          {{ comment.author.firstName }} {{ comment.author.lastName }}
        </div>
        <div class="comment-wrapper-content-text-message">
          {{ comment.message }}
        </div>
      </div>
      <div class="comment-wrapper-content-time">
        <span @click="like(comment._id, 'comment')" v-if="comment.likes.findIndex(e => e.author._id === user._id) ===  -1">Нравится</span>
        <span @click="answering = true">Ответить</span>{{ getMomentTime(comment.created) }}
      </div>
      <span v-if="comment.answers.length > 0 && !showAnswer" class="show-answers" @click="() => showAnswer=true">Показать {{comment.answers.length}} ответ</span>
      <span v-if="showAnswer" class="show-answers" @click="() => showAnswer=false">Скрыть</span>
      <div v-if="showAnswer" class="comment-wrapper" v-for="answer in comment.answers">
        <div class="comment-wrapper-avatar">
          <a-avatar :src="answer.author.googleImage"></a-avatar>
        </div>
        <div class="comment-wrapper-content">
          <div class="comment-wrapper-content-text">
            <div class="comment-wrapper-content-text-author">
              {{ answer.author.firstName }} {{ answer.author.lastName }}
            </div>
            <div class="comment-wrapper-content-text-message">
              {{ answer.message }}
            </div>
          </div>
          <div class="comment-wrapper-content-time">
            <span @click="like(answer._id, 'answer')"
                  v-if="answer.likes.findIndex(e => e.author._id === user._id) ===  -1"
            >Нравится</span>
            {{getMomentTime(answer.created) }}
          </div>
        </div>
        <div class="comment-wrapper-likes">
          <div class="comment-wrapper-likes-like" v-if="answer.likes.length > 0">
            <a-icon type="like"></a-icon>
            {{answer.likes.length}}
          </div>
        </div>
      </div>
      <div class="post-comment-input" v-if="showAnswer || answering">
        <a-avatar :src="user.googleImage"></a-avatar>
        <a-input class="comment-input" placeholder="Ответить..." v-model="commentContent"
                 @pressEnter="sendComment(comment._id)"></a-input>
      </div>
    </div>
    <div class="comment-wrapper-likes">
      <div class="comment-wrapper-likes-like" v-if="comment.likes.length > 0">
        <a-icon type="like"></a-icon>
        {{comment.likes.length}}
      </div>
    </div>
    <a-popover title="Действия с комментарием" trigger="click" overlayClassName="action-popup-content">
      <template slot="content">
        <a-tooltip title="Удалить">
          <a-icon type="delete" @click="deleteComment(comment._id)"></a-icon>
        </a-tooltip>
        <a-tooltip title="Редактировать">
          <a-icon type="edit" @click=""></a-icon>
        </a-tooltip>
      </template>
      <a-button icon="ellipsis" class="open-action-button"></a-button>
    </a-popover>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import {GET_POSTS, SEND_COMMENT, SEND_LIKE, SEND_NEW_POST} from "../../store/post/actions.type";
  import moment from "moment";

  export default {
    name: "AppCommentInput",
    components: {
      AppLoginBar,
    },
    data() {
      return {
        current: '',
        commentContent: '',
        answering: false,
        showAnswer: false,
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage', 'user']),
    },
    methods: {
      getMomentTime(time) {
        return moment(time).fromNow(true);
      },
      sendComment(id, type) {
        const comment = {
          parent: {type: 'comment', id: id},
          author: this.user,
          message: this.commentContent,
        };
        this.$store.dispatch(SEND_COMMENT, comment)
          .then(() => this.commentContent = '');
      },
      like(id, type) {
        const like = {
          parent: {type: type, id: id},
          author: this.user,
        };
        this.$store.dispatch(SEND_LIKE, like)
      },
      deleteComment(id) {
        const like = {
          parent: {type: type, id: id},
          author: this.user,
        };
        this.$store.dispatch(DELETE_COMMENT, id);
      },
    },
    props: {
      parent: Object,
      comment: Object,
    }
  }
</script>

<style lang="scss">
  .comment-wrapper {

    display: flex;
    margin-top: 0.75rem;

    &-avatar {
      margin-right: 0.625rem;
      height: 2rem;
    }

    &-content {

      &-time {
        color: #4d4f5c;
        font-size: 0.625rem;
        padding-left: 0.5rem;

        span {
          margin-right: 0.5rem;

          &:hover {

            cursor: pointer;

          }

        }
      }

      &-text {
        background-color: #f5f6fa;
        border-radius: 4rem;
        display: flex;
        height: 2rem;
        line-height: 2rem;

        &-author {
          margin-right: 1.125rem;
          font-size: 0.75rem;
          font-weight: bold;
          color: #949494;
          padding-left: 0.5rem
        }

        &-message {
          font-size: 0.75rem;
          font-weight: normal;
          color: #000000;
          padding-right: 20px;
          width: 200px;
        }

      }

    }


    &-likes {
      position: relative;

      &-like {

        position: absolute;

        top: 15px;
        left: -10px;
        background-color: white;
        border: 1px solid white;
        border-radius: 15px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
        padding: 0 5px;
        display: flex;
        svg {


        }

      }

    }

    .show-answers {
      font-size: 10px;
      padding-left: 8px;
      cursor: pointer ;
    }

  }
</style>