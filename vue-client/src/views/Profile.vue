<template>
  <div class="profile">
    <app-comment-input v-model="content" @pressEnter="sendMessage" :parent="{type: 'user', id: user && user._id}"/>
    <app-post v-for="post in posts" :post="post"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AppCommentInput from '../components/common/CommentInput'
  import AppPost from '../components/common/Post'
  import {GET_POSTS} from "../store/post/actions.type";
  import {mapGetters} from "vuex";

  export default Vue.extend({
    name: 'AppCompany',
    data() {
      return {
        content: '',
      };
    },
    components: {
      AppCommentInput,
      AppPost,
    },
    methods: {
      sendMessage() {
        console.log(this.newPostMessage);
      }
    },
    beforeMount() {
      if (this.user) this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'user', id: this.user._id}}});
    },
    watch: {
      user(currentUser) {
        this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'user', id: currentUser._id}}})
      }
    },
    computed: {
      ...mapGetters(['posts', 'user']),
    }
  });
</script>

<style lang="scss">

  .profile {
    background-color: #f0f0f7;
    height: calc(100vh - 3.125rem);
    overflow: auto;

  }

</style>