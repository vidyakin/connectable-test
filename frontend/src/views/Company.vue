<template>
  <div id="profile" class="company">
    <a-tabs default-active-key="1" @change="tabPageChange">
      <!-- Новости от администрации компании -->
      <a-tab-pane key="1" tab="Компания">
        <app-comment-input
          v-model="content"
          @pressEnter="sendMessage"
          :parent="{type: 'company', id: '0'}"
          v-if="userIsAdmin"
        />
        <div class="company-name">Новости компании {{userIsSuperAdmin ? '(Вы суперадмин)' : ''}}</div>
        <app-post v-for="(post, index) in sortedPosts" :post="post" :key="index" />
      </a-tab-pane>
      <!-- Оповещения системы -->
      <a-tab-pane key="2" force-render>
        <span slot="tab">
          <a-badge
            :count="notifCount"
            title="Есть непрочитанные сообщения"
          >Мои новости&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <NotificationList @count="setNtfCounter" />
      </a-tab-pane>
      <!-- Подписки на блоги пользователей -->
      <a-tab-pane key="3" force-render>
        <span slot="tab">
          <a-badge
            :count="subsrcCount"
            title="Есть непрочитанные сообщения"
          >Подписки&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <SubscriptionList @count="setSubscrCounter" :user="userData.result._id" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { GET_POSTS } from "@/store/post/actions.type";
import AppCommentInput from "@/components/common/CommentInput";
import NotificationList from "@/components/common/NotificationList";
import SubscriptionList from "@/components/common/SubscriptionList";
import AppPost from "@/components/common/Post";

export default Vue.extend({
  name: "AppCompany",
  data() {
    return {
      content: "",
      arrPosts: [],
      notifCount: 0,
      subsrcCount: 0
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    NotificationList,
    SubscriptionList
  },
  computed: {
    ...mapGetters([
      "userData",
      "posts",
      "messages",
      "currentClient",
      "userIsAdmin",
      "userIsSuperAdmin"
    ]),
    sortedPosts() {
      function compare(a, b) {
        if (a.created < b.created) return 1;
        if (a.created > b.created) return -1;
        return 0;
      }
      return this.posts.sort(compare);
    }
  },
  methods: {
    sendMessage() {
      console.log(this.newPostMessage);
    },
    tabPageChange(key) {
      console.log("Panel key is", key);
    },
    // установка счетчика сообщений из дочернего компонента
    setNtfCounter(n) {
      this.notifCount = n;
    },
    setSubscrCounter(n) {
      this.subsrcCount = n;
    }
  },
  beforeMount() {
    this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "company",
          id: "0"
        },
        client_id: this.currentClient && this.currentClient.workspace
      }
    });
  },
  watch: {
    // posts(val) {
    //   if (!val || !val.length) return;
    //   // 1. Посты админа
    //   this.arrPosts = val.filter(
    //     e => e.author.roles && e.author.roles.includes("admin")
    //   );
    //   // 2. посты с другими условиями
    // }
  }
});
</script>

<style lang="scss">
.is-hide-img-header {
  .company {
    height: calc(100vh - 50px);
  }
}
.company {
  padding: 0 30px;
  background-color: #f0f0f7;
  height: calc(100vh - 210px);
  overflow: auto;
  width: 100%;
  // position: fixed;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-name {
    font-size: 1.5rem;
    line-height: 32px;
    color: #43425d;
    text-align: left;
    margin: 0 30px;
  }
}
</style>