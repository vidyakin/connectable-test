<template>
  <div id="profile" class="company">
    <a-tabs default-active-key="1" @change="tabPageChange">
      <a-tab-pane key="1" tab="Компания">
        <app-comment-input
          v-model="content"
          @pressEnter="sendMessage"
          :parent="{type: 'company', id: '0'}"
        />
        <div class="company-name">Компания</div>
        <app-post v-for="(post, index) in sortedPosts" :post="post" :key="index" />
      </a-tab-pane>
      <a-tab-pane key="2" force-render>
        <span slot="tab">
          <a-badge
            :count="notifCount"
            title="Есть непрочитанные сообщения"
          >Мои новости&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <NotificationList @count="setNtfCounter" />
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
import AppPost from "@/components/common/Post";

export default Vue.extend({
  name: "AppCompany",
  data() {
    return {
      content: "",
      arrPosts: [],
      notifCount: 0
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    NotificationList
  },
  computed: {
    ...mapGetters(["userData", "posts", "messages"]),
    sortedPosts() {
      function compare(a, b) {
        if (a.created < b.created) return 1;
        if (a.created > b.created) return -1;
        return 0;
      }
      return this.arrPosts.sort(compare);
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
    }
  },
  beforeMount() {
    this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "company",
          id: "0"
        }
      }
    });
  },
  watch: {
    posts(posts) {
      this.arrPosts = posts;
    }
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

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-name {
    font-size: 1.5rem;
    line-height: 32px;
    color: #43425d;
    text-align: left;
    margin-bottom: 30px;
  }
}
</style>