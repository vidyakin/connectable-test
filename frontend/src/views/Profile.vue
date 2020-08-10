<template>
  <div id="profile" class="profile">
    <app-user-info v-if="isLoaded"></app-user-info>
    <!-- SPINNER while loading -->
    <a-spin size="large" v-else />

    <app-comment-input
      :parent="{type: 'user', id: userData && userData.result._id}"
      v-if="userData.result._id == $route.params._id"
    />
    <!-- убрано: v-if="(post && post.author._id == $route.params._id)" -->
    <app-post v-for="(post, index) in preparedPosts" :post="post" :key="index" />

    <pre v-if="userIsSuperAdmin">Служебная инфа: 
    $route.params._id = {{$route.params._id}}
userData: {{JSON.stringify(userData,null,2)}}
currentUser: {{JSON.stringify(currentUser,null,2)}}
{{userIsSuperAdmin ? "Есть права супер-админа" : ""}}
    </pre>
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

function compare(a, b) {
  if (a.created < b.created) return 1;
  if (a.created > b.created) return -1;
  return 0;
}
export default Vue.extend({
  name: "AppCompany",
  data() {
    return {
      content: "",
      isLoaded: false,
      // datauser: store.getters.userData
      //   ? store.getters.userData.result
      //   : store.getters.user
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    AppUserInfo,
  },
  async beforeMount() {
    await this.$store.dispatch(GET_USER, this.user_id);
    await this.$store.dispatch(GET_POSTS, this.userFilter);
    this.isLoaded = true;
  },
  mounted() {
    // console.log(
    //   `Profile mounted, userData is: ${JSON.stringify(this.userData)}`
    // );
  },
  computed: {
    ...mapGetters([
      "posts",
      "user",
      "currentUser",
      "userData",
      "userIsAdmin",
      "userIsSuperAdmin",
    ]),
    user_id() {
      return this.$route.params._id;
    },
    userFilter() {
      return {
        filter: {
          parent: {
            type: "user",
            id: this.user_id,
          },
        },
      };
    },
    preparedPosts() {
      const user_id = this.user_id;
      return this.posts.filter((p) => p.author_ref == user_id).sort(compare);
    },
  },
  methods: {},
  watch: {
    $route(val) {
      this.$store.dispatch(GET_USER, val.params._id).then(() => {
        this.$store.dispatch(GET_POSTS, this.userFilter);
      });
    },
  },
  sockets: {
    async socketMessage(payload) {
      console.log(`profile received a msg: ${payload.area}`);
      if (payload.area == "POSTS") {
        if (payload.parent.type == "user") {
          await this.$store.dispatch(GET_POSTS, this.userFilter);
          this.$notification["info"]({
            message: {
              created: "Новый пост",
              changed: "Изменение поста",
              deleted: "Пост удален",
            }[payload.action],
            description: "",
            placement: "bottomLeft",
          });
        }
      }
      // если лайкнули/дизлайкнули что-то, то проверяем что это был пост и пост именно в блоге текущего юзера
      if (payload.area == "LIKE" || payload.area == "DISLIKE") {
        const { type, id } = payload.postParent;
        if (
          payload.parent.type == "post" &&
          type == "user" &&
          id == this.user_id
        ) {
          const likeInfo =
            payload.area == "LIKE"
              ? {
                  message: "Новый лайк",
                  type: "like",
                  color: "green",
                }
              : {
                  message: "Новый дизлайк",
                  type: "dislike",
                  color: "salmon",
                };
          await this.$store.dispatch(GET_POSTS, this.userFilter);
          this.$notification["info"]({
            message: likeInfo.message,
            description: "",
            placement: "bottomLeft",
            icon: (h) =>
              h("a-icon", {
                props: {
                  type: likeInfo.type,
                  theme: "twoTone",
                  twoToneColor: likeInfo.color,
                },
              }),
          });
        }
      }
    },
  },
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