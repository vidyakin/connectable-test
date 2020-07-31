<template>
  <div>
    <app-post v-for="(post, index) in sortedPosts" :post="post" :key="index" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { GET_POSTS_OF_FLWS } from "@/store/post/actions.type";

import AppPost from "@/components/common/Post";

const compare = (a, b) => {
  if (a.created < b.created) return 1;
  if (a.created > b.created) return -1;
  return 0;
};

export default {
  props: ["user"],
  components: {
    AppPost,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["posts_of_follows"]),
    sortedPosts() {
      this.$emit("count", this.posts_of_follows.length);
      return this.posts_of_follows.sort(compare);
    },
  },
  methods: {
    // fillSubscriptionPosts() {
    //   this.$emit("count", this.posts_of_follows.length);
    //   //this.sortedPosts = this.posts_of_follows.sort(compare);
    // },
  },
  watch: {
    posts_of_follows(old, val) {
      console.log(`posts_of_follows watched!`);
      if (val & (val.length != old.length)) {
        //this.sortedPosts = val.sort(compare);
      }
    },
  },
  async beforeMount() {
    await this.$store.dispatch(GET_POSTS_OF_FLWS, this.user);
    this.$emit("count", this.posts_of_follows.length);
  },
};
</script>

<style>
</style>