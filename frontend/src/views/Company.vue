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
        <div v-for="event in eventsWithMe" :key="event._id" class="event-block">
          <div class="title">{{event.name}}</div>
          <div>Описание: {{event.description}}</div>
          <div>Дата начала: {{(new Date(event.date)).toLocaleString()}}</div>
          <div>Окончание: {{(new Date(event.end)).toLocaleString()}}</div>
          <div>Создал: {{eventAuthorName(event)}}</div>
          <router-link to="/calendar">Перейти в календарь</router-link>
        </div>
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
        <div v-for="req in group_requests" :key="req.userId+req.groupId" class="post-wrapper">
          <div class="post-wrapper-body">
            <div class="post-wrapper-header">
              <div class="post-wrapper-header-photo">
                <a-avatar
                  :src="(req.googleImage ? req.googleImage : require('../assets/no_image.png'))"
                />
              </div>
              <div>
                <div class="post-wrapper-header-author">Заявка на вступление в группу</div>
                <div class="post-wrapper-header-time">{{req.created | asDateTime}}</div>
              </div>
            </div>
            <div class="post-wrapper-content">
              <div style="padding: 10px">
                <router-link :to="'/profile/'+req.userId">{{req.userName}}</router-link>&nbsp;подал заявку на вступление в группу
                <router-link :to="'/group/'+req.groupId">{{req.groupName}}</router-link>
              </div>
              <div class="req-buttons" style="padding: 0 10px">
                <a-button
                  type="primary"
                  icon="check"
                  @click="approve(req.groupId, req.userId)"
                  style="margin-right: 10px;"
                >Одобрить</a-button>
                <a-button
                  type="danger"
                  icon="close"
                  @click="deleteParticipant(req.groupId, req.userId)"
                >Отклонить</a-button>
              </div>
            </div>
          </div>
        </div>
        <!-- <SubscriptionList @count="setSubscrCounter" :user="user_id" /> -->
      </a-tab-pane>
      <a-tab-pane key="8" force-render>
        <span slot="tab">
          <a-badge
            :count="comments_feed.length"
            title="Есть непросмотренные комментарии"
          >Комментарии&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <div v-for="comment in comments_feed" :key="comment._id" class="comment">
          <div
            v-if="comment.type == 'GROUPS.NEW_USER'"
            class="comment-type new-user"
          >Я - новый сотрудник</div>
          <div v-else-if="comment.type == 'USER.BLOG'" class="comment-type user-blog">Запись в блоге</div>
          <div
            v-else-if="comment.type == 'USER.FEED'"
            class="comment-type user-feed"
          >Запись на стене</div>
          <div
            v-else-if="comment.type == 'USER.GROUP'"
            class="comment-type user-group"
          >Запись в группе</div>
          <div v-else>Тип записи с комментарием не определен</div>
          <div class="comment-head">
            <span class="comment-head-name">{{getFIO(comment)}}</span>&nbsp;добавил комментарий:
          </div>
          <div class="comment-body">{{comment.message}}</div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="9" force-render>
        <span slot="tab">
          <a-badge
            :count="mentions_feed.length"
            title="Есть непросмотренные упоминания"
          >Упоминания&nbsp;&nbsp;&nbsp;&nbsp;</a-badge>
        </span>
        <div class="comment" v-for="mention in mentions_feed" :key="mention._id">
          <div
            v-if="['post.feed','comment.feed','post.company','comment.company'].includes(mention.type)"
            class="comment-type mention-feed"
          >Упоминание в новостях</div>
          <div
            v-else-if="['post.group','comment.group'].includes(mention.type)"
            class="comment-type mention-group"
          >
            Упоминание в
            <router-link :to="'/group/'+mention.link">группе</router-link>
          </div>
          <div
            v-else-if="['post.user','comment.user'].includes(mention.type)"
            class="comment-type mention-blog"
          >
            Упоминание в
            <router-link :to="'/profile/'+mention.link">блоге</router-link>
          </div>
          <div class="comment-type" v-else>Упоминание</div>
          <div class="comment-head">
            <b>{{ mention.created | asDate }}</b>
            <br />
            {{ getFIO(mention) }} в {{ mention.created | asTime }} упомянул вас в сообщении:
          </div>
          <div class="comment-body">{{mention.message}}</div>
        </div>
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
  APPROVE_PARTICIPANTS_REQUEST,
  DELETE_PARTICIPANT,
} from "@/store/group/actions.type";
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
  },
  computed: {
    ...mapGetters([
      "userData",
      "users",
      "posts_company",
      "posts_of_groups",
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
      return this.posts_of_groups.sort(compare);
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
  filters: {
    asDate(d) {
      return new Date(d).toLocaleDateString();
    },
    asTime(d) {
      return new Date(d).toLocaleTimeString();
    },
    asDateTime(d) {
      return new Date(d).toLocaleString();
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
    eventAuthorName(event) {
      const user = this.users.find((u) => u._id == event.userId);
      return user == undefined
        ? "Пользователь не найден"
        : user.firstName + " " + user.lastName;
    },
    getFIO(m) {
      if (m.author == undefined) {
        console.log(`У комментария нет поля author`);
        return;
      }
      const author = m.author ? m.author : m.author_ref;
      return author.firstName + " " + author.lastName;
    },
    // для заявок
    approve(groupId, participantId) {
      this.$store
        .dispatch(APPROVE_PARTICIPANTS_REQUEST, {
          groupId,
          participantId,
        })
        .then(() =>
          this.$notification["success"]({
            placement: "topRight",
            message: "Запрос одобрен",
            description: "Вступление в группу одобрено",
          })
        )
        .then(() => this.checkParticipants());
    },
    deleteParticipant(groupId, participantId) {
      this.$store
        .dispatch(DELETE_PARTICIPANT, {
          groupId,
          participantId,
        })
        .then(() =>
          this.$notification["info"]({
            placement: "topRight",
            message: "Запрос отклонен",
            description: "Вступление в группу отклонено",
          })
        )
        .then(() => this.checkParticipants());
    },
    checkParticipants() {
      if (this.userData) {
        this.$store.dispatch(GET_REQUESTS_TO_MY_GROUPS, this.user_id);
      }
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
            await this.$store.dispatch(GET_POSTS, { filter });
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

.comment {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: white;
  &-type {
    font-size: 9pt;
    font-weight: bold;
    padding-left: 10px;
    &.new-user {
      background-color: lavender;
    }
    &.user-blog,
    &.mention-blog {
      background-color: lightpink;
    }
    &.user-feed,
    &.mention-feed {
      background-color: lightskyblue;
    }
    &.user-group,
    &.mention-group {
      background-color: lightgreen;
    }
  }
  &-head {
    margin: 5px 10px;

    &-name {
      font-weight: bold;
    }
  }
  &-body {
    font-size: 10pt;
    font-style: italic;
    margin: 5px 10px;
    padding-bottom: 10px;
  }
}

.mention {
  border: 1px solid grey;
  margin-bottom: 5px;
  padding: 10px;

  &-head {
  }
  &-message {
  }
}
</style>