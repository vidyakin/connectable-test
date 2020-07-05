<template>
  <component v-bind:is="transformed"></component>
</template>

<script>
export default {
  props: ["text", "mentions"],
  methods: {
    convertMentionsToLinks: function(str, mentions) {
      const spanned = `<div>${str}</div>`;
      const MSG = mentions.reduce((msg, m) => {
        let tag = "@" + m.firstName + " " + m.lastName;
        let link = `<router-link to='/profile/${m._id}'>${tag}</router-link>`;
        return msg ? msg.replace(tag, link) : "";
      }, spanned);
      return MSG;
    }
  },
  computed: {
    /**
     * Magic that create component's template, created from text and objects
     */
    transformed() {
      const template = this.convertMentionsToLinks(this.text, this.mentions);
      console.log("DYN.LINK:", template);

      return {
        template
      };
    }
  },
  created() {
    console.log("created: ", this.text);
  }
};
</script>