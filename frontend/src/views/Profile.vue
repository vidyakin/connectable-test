<template>
  <div id="profile" class="profile">
    <app-user-info v-if="isLoaded"></app-user-info>
    <!-- SPINNER while loading -->
    <a-spin size="large" v-else />
    <pre>Служебная инфа: 
userData: {{JSON.stringify(userData,null,2)}}
currentUser: {{JSON.stringify(currentUser,null,2)}}
{{userIsAdmin ? "Есть права администратора" : ""}}
    </pre>
    <!-- <app-comment-input :parent="{type: 'user', id: datauser && datauser._id}" v-if="datauser._id == $route.params._id" /> -->

    <!-- убрано: v-if="(post && post.author._id == $route.params._id)" -->
    <app-post
      v-for="(post, index) in posts.filter(p => p.author._id == $route.params._id)"
      :post="post"
      :key="index"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import store from "../store";

import { GET_POSTS } from "../store/post/actions.type";
import { GET_USER } from "../store/user/actions.type";

import AppCommentInput from "../components/common/CommentInput";
import AppPost from "../components/common/Post";
import AppUserInfo from "../components/common/UserInfo";

export default Vue.extend({
  name: "AppCompany",
  data() {
    return {
      content: "",
      isLoaded: false
      // datauser: store.getters.userData
      //   ? store.getters.userData.result
      //   : store.getters.user
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    AppUserInfo
  },
  async beforeMount() {
    await this.$store.dispatch(GET_USER, this.$route.params._id);
    await this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "user",
          id: this.$route.params._id
        }
      }
    });
    this.isLoaded = true;
  },
  mounted() {
    // console.log(
    //   `Profile mounted, userData is: ${JSON.stringify(this.userData)}`
    // );
  },
  computed: {
    userIsAdmin() {
      return this.$can("read", {
        accessEmail: this.userData.result.email,
        __type: "Admin"
      });
    },
    ...mapGetters(["posts", "user", "currentUser", "userData"])
  },
  methods: {},
  watch: {
    $route(val) {
      this.$store.dispatch(GET_USER, val.params._id).then(() => {
        this.$store.dispatch(GET_POSTS, {
          filter: {
            parent: {
              type: "user",
              id: this.$route.params._id
            }
          }
        });
      });
    }
  }
});
</script>

<style lang="scss">
.is-hide-img-header {
  .profile {
    height: calc(100vh - 50px);
  }
}
.profile {
  padding: 30px;
  background-color: #f0f0f7;
  height: calc(100vh - 210px);
  overflow: auto;
  text-align: left;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }
}
</style>