<template>
  <div class="post-wrapper">
    <div class="post-wrapper-header">
      <div class="post-wrapper-header-photo">
        <a-avatar :src="post && post.author.googleImage"></a-avatar>
      </div>
      <div>
        <div class="post-wrapper-header-author">
          {{ post.author.firstName + ' ' + post.author.lastName }}
        </div>
        <div class="post-wrapper-header-time">
          {{ post && post.created }}
        </div>
      </div>
    </div>
    <div class="post-wrapper-content">
      {{ post && post.message }}

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
    <div class="post-comment-input" v-if="commenting">
      <a-input class="comment-input" placeholder="Комментарий..." v-model="commentContent"
               @pressEnter="sendComment(post._id)"></a-input>
    </div>
    <div class="post-wrapper-comments">
      <app-comment v-for="comment in post.comments" :comment="comment"></app-comment>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import AppComment from './Comment'
  import {SEND_COMMENT, SEND_LIKE, SEND_NEW_POST} from "../../store/post/actions.type";

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
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage', 'user']),
    },
    methods: {
      send() {
        this.$store.dispatch(SEND_NEW_POST, {
          message: this.current,
          parent: this.parent,
          author: this.user,
          attachment: []
        })
      },
      commented() {
        this.commenting = true;
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
        this.$store.dispatch(SEND_COMMENT, comment);
      },
    },
    props: {
      post: Object,
    }
  }
</script>

<style lang="scss">

  .comment-input {
    border-radius: 0.25rem !important;
    height: 3.125rem !important;
    margin: 1.25rem 1rem !important;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04) !important;
    width: calc(100% - 2rem) !important;

    .ant-input {
      border-color: white !important;
      height: 3.125rem;

      &:focus {
        border-color: white !important;
        box-shadow: 0 0 0 0 white !important;
      }

    }
  }

  .post-wrapper {
    border-color: white;
    border-radius: 0.25rem;
    margin: 1.25rem 3.125rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    width: calc(100% - 6.25rem) !important;
    background-color: white;
    text-align: left;
    padding: 1.25rem;

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
    }
  }

</style>