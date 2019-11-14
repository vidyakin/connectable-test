<template>
  <div class="navbar">
    <a-menu
      style="width: 12.5rem; height: 100%"
      mode="inline"
      :theme="'dark'"
      :selectedKeys="[2,3]"
      @click="goToPage"
      v-if="$mq==='desktop'"
    >
      <a-menu-item key="/" class="header">connectable</a-menu-item>
      <a-menu-item key="/company" :class="{active:isActive == 'company'}">
        <img src="@/assets/Icons/company.svg" alt />
        Компания
      </a-menu-item>
      <a-menu-item key="/addressBook" :class="{active:isActive == 'addressBook'}">
        <img src="@/assets/Icons/Adress book.svg" alt />
        Адресная книга
      </a-menu-item>
      <a-menu-item :key="this.datauser && `/profile/${this.datauser.result._id}`" :class="{active:isActive == 'profile'}">
        <img src="@/assets/Icons/user.svg" alt />
        Пользователь
      </a-menu-item>
      <a-menu-item key="/groups" :class="{active:isActive == 'groups'}">
        <img src="@/assets/Icons/Groups.svg" alt />
        Группы
      </a-menu-item>
      <a-menu-item key="/calendar" :class="{active:isActive == 'calendar'}">
        <img src="@/assets/Icons/calendar.svg" alt />
        Календарь
      </a-menu-item>
      <a-menu-item key="/structure" :class="{active:isActive == 'structure'}">
        <img src="@/assets/Icons/Structure.svg" alt />
        Структура
      </a-menu-item>
      <a-menu-item key="/settings" class="footer" v-if="$can('read', {'accessEmail': datauser.result.email, '__type': 'User'})" :class="{active:isActive == 'settings'}" >
        <img src="@/assets/Icons/setting.svg" alt />
        Настройки
      </a-menu-item>
    </a-menu>

    <a-menu
      style="width: 4rem; height: 100%"
      mode="inline"
      :theme="'dark'"
      :selectedKeys="[this.$route.path]"
      @click="goToPage"
      v-if="$mq==='tablet'"
    >
      <a-menu-item key="/" class="header">logo</a-menu-item>
      <a-menu-item key="/company">
        <img src="@/assets/Icons/company.svg" alt />
      </a-menu-item>
      <a-menu-item key="/addressBook">
        <img src="@/assets/Icons/Adress book.svg" alt />
      </a-menu-item>
      <a-menu-item :key="this.datauser && `/profile/${this.datauser.result._id}`">
        <img src="@/assets/Icons/user.svg" alt />
      </a-menu-item>
      <a-menu-item key="/groups">
        <img src="@/assets/Icons/Groups.svg" alt />
      </a-menu-item>
      <a-menu-item key="/calendar">
        <img src="@/assets/Icons/calendar.svg" alt />
      </a-menu-item>
      <a-menu-item key="/structure">
        <img src="@/assets/Icons/Structure.svg" alt />
      </a-menu-item>
      <a-menu-item key="/settings" class="footer"  >
        <img src="@/assets/Icons/setting.svg" alt />
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from '../../store';
export default {
  name: 'Navbar',
  data() {
    return {
      current: 1,
      datauser: (store.getters.user ? store.getters.user : store.getters.userData),
      isActive: this.$route.path.split('/')[1],
    };
  },
  methods: {
    goToPage(e) {
      if(this.$route.path != e.key) {
        this.$router.push({ path: e.key });
      }
      this.isActive = e.key.split('/')[1];
    },

  },
  computed: {
    ...mapGetters(['user','userData']),
  },
};
</script>

<style lang="scss">
.navbar {
  padding: 0;
  height: 100%;
  width: 12.5rem !important;
  @media (max-width: 1023px) {
    width: 4rem !important;
  }

  .ant-menu {
    background: #43425d !important;
    .ant-menu-item.active {
      background-color: transparent;
      color: #fff;
    }
    .ant-menu-item {
      height: 2.5rem;
      font-size: 1rem;
      text-align: left;
      padding-left: 1.5rem;

      @media (max-width: 1024px) {
        padding-left: 10px!important;
        padding-right: 10px;
        text-align: center;
        border-left: 5px solid transparent !important;
      }
      img {
        margin-right: 0.5rem;
      }
    }
    .ant-menu-item-selected {
      background-color: rgba(0, 0, 0, 0.1) !important;
      border-left: 5px solid #a3a0fb !important;
    }

    .footer {
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