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
        <div slot="description" class="notif-description" v-html="item.html"></div>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_MESSAGES } from "@/store/notification/actions.type";

export default {
  data() {
    return {
      notifs: [],
      // Количество сообщений - для надписи на бейджике. Возможно не нужно отдельную переменную
      msgCount: 0
    };
  },
  computed: {
    ...mapGetters(["messages"])
  },
  methods: {
    fillNotificationFeed() {
      this.notifs = this.messages.map(msg => ({
        title: "Новая группа", // TODO: подстроить под разные типы сообщений
        html: msg.text
      }));
    }
  },
  async created() {
    //console.log(`LoginBar: userdata is ${JSON.stringify(this.datauser,null,3)}`);
    await this.$store.dispatch(GET_MESSAGES); // TODO: доработать для получения только персональных и только НЕпрочитанных сообщений
    // динамическая подписка на событие сокета, на всякий случай
    // this.$socket.$subscribe('socketMessage', payload => {
    //   console.log(`socketMessage fired!`)
    // });
    this.fillNotificationFeed();
    this.$emit("count", this.messages.length);
  },
  watch: {
    messages(val) {
      this.$emit("count", val.length);
    }
  }
};
</script>

<style lang="scss">
// .list-container {
//   height: 400px;
//   overflow: auto;
// }

.notif {
  &-item {
    width: 350px;
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