<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="notifs"
    :locale="{emptyText:'Нет событий'}"
    class="list-container"
  >
    <a-list-item
      class="notif-item"
      slot="renderItem"
      slot-scope="item, index"
      :v-for="(item,index) in notifs"
      :key="index"
    >
      <a-list-item-meta>
        <a slot="title" class="notif-title">
          <b>{{item.title}}</b>
        </a>
        <a-avatar
          class="notif-avatar"
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <!-- <div slot="description" class="notif-description"><b>{{item.userFrom}}</b> {{item.text}} <i>{{item.subj}}</i></div> -->
        <div slot="description" class="notif-description">
          <MsgEmplBody v-if="item.type == 'NEW_EMPL'" :id="item.id" :name="item.text" />
          <MsgGroupBody
            v-else-if="item.type == 'NEW_GROUP'"
            :id="item.id"
            :creator="item.creator"
            :name="item.text"
          />
          <div v-else>Тип сообщения не опознан</div>
        </div>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template> 

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { GET_MESSAGES } from "@/store/notification/actions.type";

import MessageEmployeeBody from "./NotificationBodies/MessageEmployeeBody";
import MessageGroupBody from "./NotificationBodies/MessageGroupBody";

const msgTitles = {
  NEW_GROUP: "Новая группа",
  NEW_EMPL: "Новый сотрудник"
};

export default {
  data() {
    return {
      notifs: []
    };
  },
  components: {
    MsgEmplBody: MessageEmployeeBody,
    MsgGroupBody: MessageGroupBody
  },
  computed: {
    ...mapGetters(["users", "messages", "currentClient"])
  },
  methods: {
    fillNotificationFeed() {
      this.$emit("count", this.messages.length);
      const getCreatorName = msg => {
        const user = this.users.find(u => u._id == msg.senderId);
        return user ? user.firstName + " " + user.lastName : "not found";
      };
      this.notifs = this.messages.map(msg => ({
        type: msg.msgType,
        creator: getCreatorName(msg),
        title: msgTitles[msg.msgType], // TODO: подстроить под разные типы сообщений
        text: msg.text,
        id: msg.linkedObjId
      }));
    }
  },
  async beforeMount() {
    //console.log(`LoginBar: userdata is ${JSON.stringify(this.datauser,null,3)}`);
    // динамическая подписка на событие сокета, на всякий случай
    // this.$socket.$subscribe('socketMessage', payload => {
    //   console.log(`socketMessage fired!`)
    // });
    this.fillNotificationFeed();
  },
  watch: {
    messages(val) {
      this.fillNotificationFeed();
    },
    async currentClient(val) {
      if (val) {
        await this.$store.dispatch(GET_MESSAGES, {
          filter: {
            client_id: val.workspace
          }
        }); // TODO: доработать для получения только персональных и только НЕпрочитанных сообщений
      }
    }
  }
};
</script>

<style lang="scss">
.list-container {
  overflow-y: scroll;
  max-height: calc(100vh - 20rem);
}

.notif {
  &-item {
    width: 600px;
    padding: 5px 0 !important;
  }
  &-title {
    margin-bottom: 0;
    font-size: 1rem;
  }
  &-description {
    font-size: 0.9rem;
    color: rgba(17, 12, 62, 0.6);
  }
  &-avatar {
    margin-right: 5px;
  }
}
</style>