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

export default Vue.extend({
  name: 'home',
  components: {
    HelloWorld,
    AppNavbar,
    AppHeader
  },
  beforeMount() {
    if (localStorage.getItem('token')) {
      this.$store.dispatch(GET_INFO_ABOUT_USER);

    }
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
      width: 100%;
    }

  }
</style>