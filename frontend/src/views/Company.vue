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
      <!-- Сообщения в группах -->
      <a-tab-pane key="4" force-render>
        <span slot="tab">
          <a-badge
            :count="sortedGroupsPosts.length"
            title="Есть непрочитанные сообщения"
          >Сообщения в группах&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <app-post v-for="(post, index) in sortedGroupsPosts" :post="post" :key="index" />
        <!-- <SubscriptionList @count="setSubscrCounter" :user="userData.result._id" /> -->
      </a-tab-pane>
      <!-- Список событий -->
      <a-tab-pane key="5" force-render>
        <span slot="tab">
          <a-badge
            :count="eventsWithMe.length"
            title="Есть непросмотренные события"
          >События&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <div v-for="event in eventsWithMe" :key="event._id" class="event-block">
          <div class="title">{{event.name}}</div>
          <div>Описание: {{event.description}}</div>
          <div>Дата начала: {{(new Date(event.date)).toLocaleString()}}</div>
          <div>Окончание: {{(new Date(event.end)).toLocaleString()}}</div>
          <div>Создал: {{eventAuthorName(event)}}</div>
          <router-link to="/calendar">Перейти в календарь</router-link>
        </div>
        <!-- <SubscriptionList @count="setSubscrCounter" :user="userData.result._id" /> -->
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { GET_POSTS, GET_POSTS_OF_GROUPS } from "@/store/post/actions.type";
import { GET_EVENTS, GET_USERS } from "@/store/user/actions.type";
import AppCommentInput from "@/components/common/CommentInput";
import NotificationList from "@/components/Company/NotificationList";
import SubscriptionList from "@/components/Company/SubscriptionList";
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
      content: "",
      arrPosts: [],
      notifCount: 0,
      subsrcCount: 0,
      groupMsgCount: 0,
      eventsCount: 0
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
      "users",
      "posts",
      "posts_of_groups",
      "messages",
      "events",
      "currentClient",
      "userIsAdmin",
      "userIsSuperAdmin"
    ]),
    sortedPosts() {
      return this.posts.sort(compare);
    },
    sortedGroupsPosts() {
      return this.posts_of_groups.sort(compare);
    },
    eventsWithMe() {
      const user = this.userData.result;
      return this.events.filter(
        ev =>
          ev.userId != user._id &&
          ev.attendees.filter(att => att.email == user.email).length > 0
      );
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
    },
    eventAuthorName(event) {
      const user = this.users.find(u => u._id == event.userId);
      return user == undefined
        ? "Пользователь не найден"
        : user.firstName + " " + user.lastName;
    }
  },
  beforeMount() {
    const user = this.userData.result;
    this.$store.dispatch(GET_USERS, user.client_id);
    this.$store.dispatch(GET_POSTS, {
      filter: {
        parent: {
          type: "company",
          id: "0"
        },
        client_id: user.client_id
      }
    });
    this.$store.dispatch(GET_POSTS_OF_GROUPS, user._id);
    this.$store.dispatch(GET_EVENTS, user.email);
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

.event-block {
  border: 1px solid darkgrey;
  border-radius: 6px;
  padding: 10px;
  width: 400px;
  .title {
    font-size: 14pt;
    font-weight: bold;
  }
}
</style>