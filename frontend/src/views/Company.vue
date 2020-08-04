<template>
  <div id="profile" class="company">
    <a-tabs default-active-key="1" @change="tabPageChange" size="small" :tabBarGutter="tabGutter">
      <!-- Новости от администрации компании -->
      <a-tab-pane key="1" tab="Новости компании">
        <app-comment-input
          v-model="content"
          @pressEnter="sendCompanyMessage"
          :parent="{type: 'company', id: '0'}"
          v-if="userIsAdmin"
        />
        <div class="company-name">Новости компании {{userIsSuperAdmin ? '(Вы суперадмин)' : ''}}</div>
        <app-post v-for="(post, index) in sortedPosts" :post="post" :key="index" />
      </a-tab-pane>
      <!-- Общая лента -->
      <a-tab-pane key="6" tab="Мои новости" force-render>
        <app-comment-input
          v-model="feed_message"
          @pressEnter="sendFeedMessage"
          :parent="{type: 'feed', id: '0'}"
        />
        <app-post v-for="(post, index) in sortedFeed" :post="post" :key="index" />
      </a-tab-pane>
      <!-- Оповещения системы -->
      <a-tab-pane key="2" force-render>
        <span slot="tab">
          <a-badge
            :count="notifCount"
            title="Есть непрочитанные сообщения"
          >Оповещения&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <NotificationList @count="setNtfCounter" />
      </a-tab-pane>
      <!-- Подписки на блоги пользователей -->
      <a-tab-pane key="3" force-render>
        <span slot="tab">
          <a-badge
            :count="subsrcCount"
            title="Есть непрочитанные сообщения"
          >Блоги&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <SubscriptionList @count="setSubscrCounter" :user="user_id" />
      </a-tab-pane>
      <!-- Сообщения в группах -->
      <a-tab-pane key="4" force-render>
        <span slot="tab">
          <a-badge
            :count="sortedGroupsPosts.length"
            title="Есть непрочитанные сообщения"
          >Сообщения в группах&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <app-post v-for="(post, index) in sortedGroupsPosts" :post="post" :key="index" />
        <!-- <SubscriptionList @count="setSubscrCounter" :user="user_id" /> -->
      </a-tab-pane>
      <!-- Список событий -->
      <a-tab-pane key="5" force-render>
        <span slot="tab">
          <a-badge
            :count="eventsWithMe.length"
            title="Есть непросмотренные события"
          >События календаря&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <EventNotification v-for="event in eventsWithMe" :key="event._id" :event="event" />
        <!-- <SubscriptionList @count="setSubscrCounter" :user="user_id" /> -->
      </a-tab-pane>
      <!-- Заявки на вступление в группы -->
      <a-tab-pane key="7" force-render>
        <span slot="tab">
          <a-badge
            :count="group_requests.length"
            title="Есть непросмотренные заявки"
          >Заявки в группы&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <RequestToGroup v-for="req in group_requests" :key="req.userId+req.groupId" :req="req" />
        <!-- <SubscriptionList @count="setSubscrCounter" :user="user_id" /> -->
      </a-tab-pane>
      <a-tab-pane key="8" force-render>
        <span slot="tab">
          <a-badge
            :count="comments_feed.length"
            title="Есть непросмотренные комментарии"
          >Комментарии&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <MentionOrCommentFeedItem
          v-for="comment in comments_feed"
          :key="comment._id"
          :item="comment"
        />
      </a-tab-pane>
      <a-tab-pane key="9" force-render>
        <span slot="tab">
          <a-badge
            :count="mentions_feed.length"
            title="Есть непросмотренные упоминания"
          >Упоминания&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <MentionOrCommentFeedItem
          v-for="mention in mentions_feed"
          :key="mention._id"
          :item="mention"
          :isMention="true"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import {
  GET_POSTS,
  GET_POSTS_OF_GROUPS,
  GET_COMMENTS,
  GET_MENTIONS,
  GET_POSTS_OF_FLWS,
} from "@/store/post/actions.type";
import { GET_EVENTS, GET_USERS } from "@/store/user/actions.type";
import {
  GET_REQUESTS_TO_MY_GROUPS,
  GET_GROUPS_USER_CAN_READ,
} from "@/store/group/actions.type";
import AppCommentInput from "@/components/common/CommentInput";
import NotificationList from "@/components/Company/NotificationList";
import SubscriptionList from "@/components/Company/SubscriptionList";
import EventNotification from "@/components/Company/NotificationBodies/EventNotification";
import MentionOrCommentFeedItem from "@/components/Company/NotificationBodies/MentionOrCommentFeedItem";
import RequestToGroup from "@/components/Company/RequestToGroup";
import AppPost from "@/components/common/Post";

function compare(a, b) {
  if (a.created < b.created) return 1;
  if (a.created > b.created) return -1;
  return 0;
}

export default Vue.extend({
  name: "AppCompany",
  data() {
    return {
      tabGutter: 1,
      content: "",
      feed_message: "",
      arrPosts: [],
      notifCount: 0,
      subsrcCount: 0,
      groupMsgCount: 0,
      eventsCount: 0,
    };
  },
  components: {
    AppCommentInput,
    AppPost,
    NotificationList,
    SubscriptionList,
    RequestToGroup,
    EventNotification,
    MentionOrCommentFeedItem,
  },
  computed: {
    ...mapGetters([
      "userData",
      "users",
      "posts_company",
      "posts_of_groups",
      "groups_available",
      "posts_of_feed",
      "posts_of_system",
      "comments_feed",
      "mentions_feed",
      "messages",
      "events",
      "group_requests",
      "currentClient",
      "userIsAdmin",
      "userIsSuperAdmin",
    ]),
    user_id() {
      return this.userData.result._id;
    },
    wsp() {
      return this.userIsSuperAdmin
        ? this.currentClient.workspace
        : this.userData.result.client_id;
    },
    sortedPosts() {
      // посты компании создаются в
      return this.posts_company.sort(compare);
    },
    sortedGroupsPosts() {
      return this.posts_of_groups
        .filter((p) => this.groups_available.some((g) => g._id == p.parent._id))
        .sort(compare);
    },
    sortedFeed() {
      return this.posts_of_feed.concat(this.posts_of_system).sort(compare);
    },
    eventsWithMe() {
      const user = this.userData.result;
      return this.events.filter(
        (ev) =>
          ev.userId != user._id &&
          ev.attendees.filter((att) => att.email == user.email).length > 0
      );
    },
  },
  methods: {
    sendCompanyMessage() {
      //console.log(this.newPostMessage);
    },
    sendFeedMessage() {
      console.log(this.feed_message);
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
    },
  },
  sockets: {
    async socketMessage(payload) {
      const filter = { client_id: this.wsp };
      const d = {
        sid: this.$socket.client.id,
        str_pl: JSON.stringify(payload, null, 3),
      };
      console.log(`Company socket msg 1: ${d.sid}: ${d.str_pl}`);
      if (payload.area == "POSTS") {
        try {
          // посты компании и блогов
          if (payload.parent.type == "user") {
            await this.$store.dispatch(GET_POSTS_OF_FLWS, this.user_id);
          }
          // посты компании и блогов
          if (payload.parent.type == "company") {
            await this.$store.dispatch(GET_POSTS, { filter });
          }
          // посты в группах
          if (payload.parent.type == "group") {
            // надо выяснить можно ли для этой группы показывать сообщения или нет
            await this.$store.dispatch(GET_GROUPS_USER_CAN_READ, this.user_id);
            needShow = this.groupsUserCanRead.some(
              (g) => g._id == payload.parent.id
            );
            if (needShow) {
              await this.$store.dispatch(GET_POSTS, { filter });
            }
          }
        } catch (error) {
          console.log(`Ошибка при получении постов: ${error}`);
        }
      } else if (payload.area == "EVENTS") {
        try {
          // события
          this.$store.dispatch(GET_EVENTS, this.userData.result.email);
        } catch (error) {
          console.log(`Ошибка при получении постов: ${error}`);
        }
      } else if (payload.area == "COMMENTS") {
        try {
          // события
          this.$store.dispatch(GET_COMMENTS, this.user_id);
        } catch (error) {
          console.log(`Ошибка при получении комментариев: ${error}`);
        }
      } else if (payload.area == "MENTIONS") {
        try {
          // события
          this.$store.dispatch(GET_MENTIONS, this.user_id);
        } catch (error) {
          console.log(`Ошибка при получении комментариев: ${error}`);
        }
      } else if (payload.area === "NEW_REQUEST_TO_GROUP") {
        try {
          // события
          this.$store.dispatch(GET_REQUESTS_TO_MY_GROUPS, this.user_id);
        } catch (error) {
          console.log(`Ошибка при получении заявок: ${error}`);
        }
      }
    },
  },
  beforeMount() {
    const user = this.userData.result;
    Promise.all([
      this.$store.dispatch(GET_USERS, this.wsp),
      this.$store.dispatch(GET_POSTS, {
        filter: {
          // parent: {
          //   type: "company",
          //   id: "0"
          // },
          client_id: this.wsp,
        },
      }),
      // this.$store.dispatch(GET_POSTS_OF_GROUPS, user._id).then(d => {
      //   console.log("DISP: Post of groups");
      // }),
      this.$store.dispatch(GET_EVENTS, user.email),
      this.$store.dispatch(GET_REQUESTS_TO_MY_GROUPS, user._id),
      this.$store.dispatch(GET_COMMENTS, user._id),
      this.$store.dispatch(GET_MENTIONS, user._id),
    ]).finally((_) => {
      console.log("All dispatch ended");
    });
  },
  mounted() {
    // this.$socket.client.on("socketMessage", async (payload) => {
    // });
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
  },
});
</script>

<style lang="scss">
.is-hide-img-header {
  .company {
    height: calc(100vh - 50px);
  }
}
.ant-tabs-tab {
  margin: 0 10px 0 0 !important;
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