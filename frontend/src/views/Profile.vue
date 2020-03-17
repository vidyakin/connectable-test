<template>
  <div id="profile" class="profile">
    <app-user-info></app-user-info>
    <app-comment-input :parent="{type: 'user', id: datauser && datauser._id}" v-if="datauser._id == $route.params._id" />

    <app-post v-for="(post, index) in posts" v-if="(post && post.author._id == $route.params._id)" :post="post" :key="index" />

  </div>
</template>

<script>
import Vue from 'vue';
import AppCommentInput from '../components/common/CommentInput';
import AppPost from '../components/common/Post';
import AppUserInfo from '../components/common/UserInfo';
import { GET_POSTS } from '../store/post/actions.type';
import { mapGetters } from 'vuex';
import { GET_USER } from '../store/user/actions.type';
import store from '../store';
export default Vue.extend({
  name: 'AppCompany',
  data() {
    return {
      content: '',
      datauser: (store.getters.userData ? store.getters.userData.result : store.getters.user ),
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    AppUserInfo,
  },
  methods: {},
  beforeMount() {
    this.$store.dispatch(GET_USER, this.$route.params._id).then(() => {
      this.$store.dispatch(GET_POSTS, {
        filter: {
          parent: {
            type: 'user',
            id: this.$route.params._id,
          },
        },
      });
    });
  },
  computed: {
    ...mapGetters(['posts', 'user', 'currentUser', 'userData']),
  },
  watch: {
    $route(val) {
      this.$store.dispatch(GET_USER, val.params._id).then(() => {
        this.$store.dispatch(GET_POSTS, {
          filter: {
            parent: {
              type: 'user',
              id: this.$route.params._id,
            },
          },
        });
      });
    },
  },
});
</script>

<style lang="scss">
.is-hide-img-header{
  .profile {
    height: calc(100vh - 50px);
  }
}
.profile {
  padding: 30px;
  background-color: #f0f0f7;
  height: calc(100vh - 210px);
  overflow: auto;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }
}
</style>