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
      <a-menu-item key="/" class="header">
        <img src="@/assets/logo.svg" class="logo" alt />
        <span class="logo-mob circle-1"></span>
        <span class="logo-mob circle-2"></span>
        <span class="logo-mob circle-3"></span>
      </a-menu-item>
      <a-menu-item v-if="client_defined" key="/company" :class="{active:isActive == 'company'}">
        <img src="@/assets/Icons/company.svg" alt />Стена
      </a-menu-item>
      <a-menu-item
        v-if="client_defined"
        key="/addressBook"
        :class="{active:isActive == 'addressBook'}"
      >
        <img src="@/assets/Icons/Adress book.svg" alt />
        Адресная книга
      </a-menu-item>
      <a-menu-item :key="this.userKey" :class="{active:isActive == 'profile'}">
        <img src="@/assets/Icons/user.svg" alt />
        Пользователь
      </a-menu-item>
      <a-menu-item key="/groups" :class="{active:isActive == 'groups'}" v-if="client_defined">
        <img src="@/assets/Icons/Groups.svg" alt />
        Группы
      </a-menu-item>
      <a-menu-item key="/calendar" :class="{active:isActive == 'calendar'}" v-if="client_defined">
        <img src="@/assets/Icons/calendar.svg" alt />
        Календарь
      </a-menu-item>
      <!-- <a-menu-item key="/structure" :class="{active:isActive == 'structure'}">
        <img src="@/assets/Icons/Structure.svg" alt />
        Структура
      </a-menu-item>-->
      <a-menu-item
        key="/structure_new"
        :class="{active:isActive == 'structure_new'}"
        v-if="userIsAdmin"
      >
        <img src="@/assets/Icons/Structure.svg" alt />
        Структура (нов.)
      </a-menu-item>
      <!-- для сотрудников заменить на userIsAdmin когда будут заданы роли пользователей -->
      <a-menu-item
        key="/employees"
        :class="{active:isActive == 'employees'}"
        v-if="client_defined && userIsAdmin"
      >
        <a-icon type="idcard" style="color: #A5A4BF; font-size: 16px" />Сотрудники
      </a-menu-item>
      <a-menu-item key="/clients" :class="{active:isActive == 'clients'}" v-if="userIsSuperAdmin">
        <a-icon type="solution" style="color: #A5A4BF; font-size: 16px" />Клиенты
      </a-menu-item>

      <!--v-if="$can('read', {'accessEmail': datauser.result.email, '__type': 'Admin'})"-->
      <a-menu-item key="/settings" class="footer" :class="{active:isActive == 'settings'}">
        <img src="@/assets/Icons/setting.svg" alt />
        Настройки
      </a-menu-item>
      <a-menu-item key="/about" :class="{active:isActive == 'about'}">
        <img src="@/assets/Icons/Structure.svg" alt />
        О нас
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
      <a-menu-item key="/" class="header">
        <img src="@/assets/logo.svg" class="logo" alt />
        <span class="logo-mob circle-1"></span>
        <span class="logo-mob circle-2"></span>
        <span class="logo-mob circle-3"></span>
      </a-menu-item>
      <a-menu-item key="/company" v-if="client_defined">
        <img src="@/assets/Icons/company.svg" alt />
      </a-menu-item>
      <a-menu-item key="/addressBook" v-if="client_defined">
        <img src="@/assets/Icons/Adress book.svg" alt />
      </a-menu-item>
      <a-menu-item :key="this.userKey">
        <img src="@/assets/Icons/user.svg" alt />
      </a-menu-item>
      <a-menu-item key="/groups" v-if="client_defined">
        <img src="@/assets/Icons/Groups.svg" alt />
      </a-menu-item>
      <a-menu-item key="/calendar" v-if="client_defined">
        <img src="@/assets/Icons/calendar.svg" alt />
      </a-menu-item>
      <!-- <a-menu-item key="/structure">
        <img src="@/assets/Icons/Structure.svg" alt />
      </a-menu-item>-->
      <a-menu-item key="/structure_new" v-if="userIsAdmin">
        <img src="@/assets/Icons/Structure.svg" alt />
      </a-menu-item>
      <!-- для сотрудников заменить на userIsAdmin когда будут заданы роли пользователей -->
      <a-menu-item key="/employees" v-if="userIsAdmin">
        <img src="@/assets/Icons/calendar.svg" alt />
      </a-menu-item>
      <a-menu-item key="/clients" v-if="userIsSuperAdmin">
        <img src="@/assets/Icons/setting.svg" alt />
      </a-menu-item>
      <a-menu-item key="/settings" class="footer">
        <img src="@/assets/Icons/setting.svg" alt />
      </a-menu-item>
      <a-menu-item key="/about">
        <img src="@/assets/Icons/Structure.svg" alt />
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "../../store";
export default {
  name: "Navbar",
  mounted() {
    //console.log(`datauser: ${JSON.stringify(this.datauser)}`);
  },
  data() {
    return {
      current: 1,
      // datauser: store.getters.user
      //   ? store.getters.user
      //   : store.getters.userData,
      isActive: this.$route.path.split("/")[1]
    };
  },
  methods: {
    goToPage(e) {
      if (this.$route.path != e.key) {
        this.$router.push({ path: e.key });
      }
      this.isActive = e.key.split("/")[1];
    }
  },
  computed: {
    ...mapGetters([
      "user",
      "userData",
      "currentClient",
      "userIsSuperAdmin",
      "userIsAdmin"
    ]),
    /**
     * Определяет видимость клиенто-зависимых разделов типа сотрудников или адресной книги
     */
    client_defined() {
      return (
        !this.userIsSuperAdmin || (this.userIsSuperAdmin && this.currentClient)
      );
    },
    // userIsAdmin() {
    //   const ability = this.$can("manage", this.userData.result);
    //   console.log(`Admin ability: ${ability}`);
    //   return ability;
    // },
    // userIsSuperAdmin() {
    //   return false;
    //   // if (!this.userData) return false;
    //   // //console.log("userData in NavBar: ", this.userData.result);

    //   // return this.$can("manage", {
    //   //   email: this.userData.result.email,
    //   //   __type: "Client"
    //   // });
    // },
    getClientInfo() {
      return this.client_defined() ? this.currentClient.name : "";
    },
    userKey: function() {
      return (
        (this.userData &&
          this.userData.result &&
          `/profile/${this.userData.result._id}`) ||
        "nouser"
      );
    }
  }
};
</script>

<style lang="scss">
.logo-mob {
  display: none;
  width: 6.3px;
  height: 6.3px;
  border-radius: 50%;
  margin-right: 2px;

  @media (max-width: 1023px) {
    display: inline-block;
  }
}
.circle-1 {
  background-color: #ff1d25;
}
.circle-2 {
  background-color: #7ac943;
}
.circle-3 {
  background-color: #3fa9f5;
}
.navbar .ant-menu .ant-menu-item img.logo {
  width: 94px;
  max-width: 100%;
  height: 20.5px;
  object-fit: contain;
  display: block;
  margin-right: 0;
  margin: 14px auto;

  @media (max-width: 1023px) {
    display: none;
  }
}
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
      text-align: left;

      @media (max-width: 1023px) {
        padding-left: 10px !important;
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
      border-left: 0 !important;
      width: 100%;
      height: 3.125rem;
      opacity: 1;
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.05);
      font-size: 1rem;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      letter-spacing: normal;
      color: #abaac5;
    }
    .header:after {
      width: 100%;
      height: 100%;
      transform: scaleY(1);
      background: #000000;
      z-index: 1;
      opacity: 0.3;
    }
  }
}
</style>