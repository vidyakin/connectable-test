<template >
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
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import AppLoginBar from './LoginBar'
  import {SEND_NEW_POST} from "../../store/post/actions.type";

  export default {
    name: "AppPost",
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
    methods: {
      send() {
        this.$store.dispatch(SEND_NEW_POST, {message: this.current, parent: this.parent, author: this.user, attachment: []})
      },
    },
    props: {
      post: Object,
    }
  }
</script>

<style lang="scss">

  .post-wrapper {
    border-color: white;
    border-radius: 0.25rem;
    margin: 1.25rem 3.125rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    width: calc(100% - 6.25rem)!important;
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
    }
  }

</style>