<template>
  <div class="user-info">

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
        <span>Нравится</span> <span>Ответить</span>{{ comment.created }}
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import {SEND_NEW_POST} from "../../store/post/actions.type";

  export default {
    name: "AppCommentInput",
    components: {
      AppLoginBar,
    },
    data() {
      return {
        current: '',
      }
    },
    computed: {
      ...mapGetters(['showHeaderImage', 'user']),
    },
    methods: {},
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
          color: #949494,;
          padding-left: 0.5rem
        }

        &-message {
          font-size: 0.75rem;
          font-weight: normal;
          color: #000000
        }

      }

    }


  }
</style>