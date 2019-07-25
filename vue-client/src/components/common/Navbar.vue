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
        <img src="@/assets/Icons/company.svg" alt="">
        Компания
      </a-menu-item>
      <a-menu-item key="/addressBook">
        <img src="@/assets/Icons/Adress book.svg" alt="">
        Адресная книга
      </a-menu-item>
      <a-menu-item :key="user && `/profile/${user._id}`" >
        <img src="@/assets/Icons/user.svg" alt="">
        Пользователь
      </a-menu-item>
      <a-menu-item key="/groups">
        <img src="@/assets/Icons/Groups.svg" alt="">
        Группы
      </a-menu-item>
      <a-menu-item key="/calendar">
        <img src="@/assets/Icons/calendar.svg" alt="">
        Календарь
      </a-menu-item>
      <a-menu-item key="6" disabled>
        <img src="@/assets/Icons/Structure.svg" alt="">
        Структура
      </a-menu-item>

      <a-menu-item key="7" class="footer" disabled>
        <img src="@/assets/Icons/setting.svg" alt="">
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
    width: 12.5rem!important;


    .ant-menu {
      background: #43425d !important;

      .ant-menu-item {
        height: 2.5rem;
        font-size: 1rem;
        text-align: left;
        padding-left: 1.5rem;
        img {
          margin-right: 0.5rem;
        }

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