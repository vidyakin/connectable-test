<template>
  <div class="home">
    <app-navbar/>
    <div class="content">
      <div class="header">
        <app-header/>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import AppNavbar from '../components/common/Navbar.vue'
import AppHeader from '../components/common/Header.vue'
import {GET_INFO_ABOUT_USER} from "@/store/user/actions.type";
import moment from "moment";

function num2str(n, text_forms) {
  n = Math.abs(n) % 100; var n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    AppNavbar,
    AppHeader
  },
  methods: {
    getDays(a) {
      console.log(a);
      return "day";
    }
  }
  ,
  beforeMount() {
    if (localStorage.getItem('token')) {
      this.$store.dispatch(GET_INFO_ABOUT_USER);
    }
    moment.updateLocale('ru', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few sec',
        ss: '%ds',
        m: 'a min',
        mm: '%d min',
        h: '1 час',
        hh: '%dчасов',
        d: 'день',
        dd:`%d дня`,
        M: 'месяц',
        MM: '%d месяцев',
        y: 'год',
        yy: '%dлет',
      },
    });
  },
});
</script>

<style lang="scss">
  .open-action-button {
    background-color: transparent!important;
    border: 0!important;
  }

  .action-popup-content{
    .anticon {
      margin: 0 1rem!important;
      cursor: pointer!important;
    }
  }

  .home {
    display: flex;
    justify-content: flex-end;
    height: 100vh;

    .content {
      width: calc(100vw - 12.5rem);
    }

  }
</style>