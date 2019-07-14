<template>
  <div class="navbar">
    <a-menu
      style="width: 12.5rem; height: 100%"
      mode="inline"
      :theme="'dark'"
      :selectedKeys="[2,3]"
      @click="goToPage"
    >
      <a-menu-item key="" class="header">
        connectable
      </a-menu-item>
      <a-menu-item key="/company">
        <a-icon type="home"/>
        Компания
      </a-menu-item>
      <a-menu-item key="/addressBook">
        Адресная книга
      </a-menu-item>
      <a-menu-item :key="user && `/profile/${user._id}`" >
        Пользователь
      </a-menu-item>
      <a-menu-item key="4" disabled>
        Группы
      </a-menu-item>
      <a-menu-item key="/calendar">
        Календарь
      </a-menu-item>
      <a-menu-item key="6" disabled>
        Структура
      </a-menu-item>

      <a-menu-item key="7" class="footer" disabled>
        <a-icon type="setting"/>
        Настройки
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Navbar",
    data() {
      return {
        current: 1,
      }
    },
    methods: {
      goToPage(e) {
        this.$router.push({path: e.key});
      },
    },
    computed: {
      ...mapGetters(['user',]),
    },
  }
</script>

<style lang="scss">

  .navbar {

    height: 100%;


    .ant-menu {
      background: #43425d !important;

      .ant-menu-item {
        height: 2.5rem;
        font-size: 1rem;
        text-align: left;
        padding-left: 0.3rem;
      }

      .footer{
        margin-top: 2rem;
      }

      .header {
        margin-top: 0;
        width: 12.5rem;
        height: 3.125rem;
        opacity: 0.3;
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.05);
        background-color: #000000;

        font-size: 1rem;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        letter-spacing: normal;
        color: #abaac5;

      }

    }

  }

</style>