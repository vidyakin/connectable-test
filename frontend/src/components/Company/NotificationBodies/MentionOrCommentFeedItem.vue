<template>
  <div class="comment">
    <template v-if="isMention">
      <div
        v-if="['post.feed','comment.feed','post.company','comment.company'].includes(item.type)"
        class="comment-type mention-feed"
      >Упоминание в новостях</div>
      <div
        v-else-if="['post.group','comment.group'].includes(item.type)"
        class="comment-type mention-group"
      >
        Упоминание в
        <router-link :to="'/group/'+item.link">группе</router-link>
      </div>
      <div
        v-else-if="['post.user','comment.user'].includes(item.type)"
        class="comment-type mention-blog"
      >
        Упоминание в
        <router-link :to="'/profile/'+item.link">блоге</router-link>
      </div>
      <div class="comment-type" v-else>Другое упоминание</div>
      <div class="comment-head">
        <b>{{ item.created | asDate }}</b>
        <br />
        {{ getFIO(item) }} в {{ item.created | asTime }} упомянул вас в сообщении:
      </div>
    </template>
    <!-- КОММЕНТАРИИ -->
    <template v-else>
      <div v-if="item.type == 'GROUPS.NEW_USER'" class="comment-type new-user">Я - новый сотрудник</div>
      <div v-else-if="item.type == 'USER.BLOG'" class="comment-type user-blog">Запись в блоге</div>
      <div v-else-if="item.type == 'USER.FEED'" class="comment-type user-feed">Запись на стене</div>
      <div v-else-if="item.type == 'USER.GROUP'" class="comment-type user-group">Запись в группе</div>
      <div v-else>Тип записи с комментарием не определен</div>
      <div class="comment-head">
        <span class="comment-head-name">{{getFIO(item)}}</span>&nbsp;добавил комментарий:
      </div>
    </template>
    <!-- ТЕЛО КОММЕНТАРИЯ ИЛИ УПОМИНАНИЯ -->
    <div class="comment-body">{{item.message}}</div>
  </div>
</template>

<script>
export default {
  props: ["item", "isMention"],
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
    getFIO(m) {
      if (m.author == undefined) {
        console.log(`У комментария нет поля author`);
        return;
      }
      const author = m.author ? m.author : m.author_ref;
      return author.firstName + " " + author.lastName;
    },
  },
};
</script>

<style lang="scss">
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

// .mention {
//   border: 1px solid grey;
//   margin-bottom: 5px;
//   padding: 10px;

//   &-head {
//   }
//   &-message {
//   }
// }
</style>