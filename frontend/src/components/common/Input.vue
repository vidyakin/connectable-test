<template>
  <div>
    <div class="input-label">{{ label }}</div>
    <!-- Модификация v-on не описана в справке, нашел на гитхабе -->
    <a-input
      v-if="!readOnly"
      v-bind="$attrs"
      v-on="{
          ...$listeners,
          input: event => $emit('input', event.target.value)
        }"
      class="basic-input"
    />
    <div class="readonly-field" v-else>{{$attrs.value}}</div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "AppInput",
  props: {
    label: String,
    readOnly: Boolean
  },
  mounted() {
    console.log("input mounted");
  }
});
</script>

<style scoped lang="scss">
.input-label {
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
}
.basic-input {
  // height: 2.5rem;
  // border-radius: 0;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.08);
  // line-height: 2.5rem;
  // width: 100%;
}
.readonly-field {
  font-size: 12pt;
  font-weight: bold;
}
</style>