<template>
  <div class="profile">
    <app-user-info></app-user-info>
    <app-comment-input :parent="{type: 'user', id: user && currentUser._id}"/>
    <app-post v-for="post in posts" :post="post"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import AppCommentInput from '../components/common/CommentInput'
  import AppPost from '../components/common/Post'
  import AppUserInfo from '../components/common/UserInfo'
  import {GET_POSTS} from "../store/post/actions.type";
  import {mapGetters} from "vuex";
  import {GET_USER} from "../store/user/actions.type";

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
      AppUserInfo,
    },
    methods: {},
    beforeMount() {
      this.$store.dispatch(GET_USER, this.$route.params._id)
        .then(() => {
          this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'user', id: this.currentUser._id}}});
        });
    },
    computed: {
      ...mapGetters(['posts', 'user', 'currentUser']),
    },
    watch: {
      '$route'(val) {
        this.$store.dispatch(GET_USER, val.params._id)
          .then(() => {
            this.$store.dispatch(GET_POSTS, {filter: {parent: {type: 'user', id: this.currentUser._id}}});
          });
      }
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