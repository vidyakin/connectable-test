<template>
  <div class="groups">
    <div class="address-header align-right">
      <div class="address-header-search">
        <a-input v-model="searchText">
          <a-icon type="search" slot="prefix"></a-icon>
        </a-input>
      </div>
    </div>
    <app-group-create-drawer :visible="createVisible" :close="closeCreate" />
    <div class="groups-header">
      <div class="groups-header-name">Группы</div>
      <!-- <div v-if="userIsAdmin">Я Админ</div>
      <div v-else>Я не Админ</div>-->
      <div class="groups-header-search">
        <a-button type="primary" @click="openCreate">Создать группу</a-button>
      </div>
    </div>
    <div class="groups-body" v-if="isLoaded">
      <app-group v-for="(group, index) in sortedGroup" :group="group" :key="index"></app-group>
    </div>
    <!-- SPINNER while loading -->
    <a-spin size="large" v-else />
    <!-- Оповещение об отсутствии групп -->
    <a-empty description="Пока еще нет ни одной группы" v-if="groups.length == 0" />
    <!-- Оповещение о пустом поиске -->
    <a-empty description="Группы не найдены" v-if="groups.length != 0 && sortedGroup.length==0" />
  </div>
</template>
<script>
import store from "../store";
import { mapGetters } from "vuex";
import { GET_GROUPS, GET_GROUPS_BY_CLIENT } from "../store/group/actions.type";

// import AppSearchForm from '../components/common/SearchForm';
import AppGroup from "../components/common/Group";
import AppGroupCreateDrawer from "../components/groups/GroupCreateDrawer";

export default {
  components: {
    AppGroupCreateDrawer,
    AppGroup,
  },
  data() {
    return {
      createVisible: false,
      isLoaded: false,
      groupsData: [],
      searchText: "",
      filterData: [],
    };
  },
  methods: {
    closeCreate() {
      this.createVisible = false;
    },
    openCreate() {
      this.createVisible = true;
    },
  },

  computed: {
    sortedGroup() {
      function compare(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
      return this.filterData.sort(compare);
    },
    user_id() {
      return this.userData.result._id;
    },
    ...mapGetters(["groups", "userData", "currentClient", "userIsAdmin"]),
  },
  async beforeMount() {
    try {
      this.isLoaded = true;
      if (this.userIsAdmin) {
        await this.$store.dispatch(
          GET_GROUPS_BY_CLIENT,
          this.currentClient.workspace
        );
      } else await this.$store.dispatch(GET_GROUPS, this.user_id);
      //console.log(`Число групп: ${this.groups.length}`);
    } catch (e) {
      console.log(`Ошибка при получении групп: ${e}`);
    }
  },
  sockets: {
    async socketMessage(payload) {
      if (payload.area == "NEW_GROUP" || payload.area == "GROUP_DELETED") {
        //this.isLoaded = true;
        if (this.userIsAdmin) {
          await this.$store.dispatch(
            GET_GROUPS_BY_CLIENT,
            this.currentClient.workspace
          );
        } else {
          await this.$store.dispatch(GET_GROUPS, this.user_id);
        }
        //this.isLoaded = false;
      }
    },
  },
  watch: {
    groups(groups) {
      this.filterData = groups;
      this.fullData = [...this.filterData];
    },
    searchText(text) {
      this.filterData = this.fullData.filter(
        (el) => el.name.toLowerCase().indexOf(text.toLowerCase().trim()) !== -1
      );
    },
  },
};
</script>

<style lang="scss">
.address-header.align-right {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 30px;
  justify-content: flex-end;
  text-align: right;
}
.address-header .ant-input {
  background-color: #f0f0f7 !important;
  border-radius: 5rem;
}
.is-hide-img-header {
  .groups {
    height: calc(100vh - 50px);
  }
}
.groups {
  padding: 30px;
  height: calc(100vh - 210px);
  overflow: auto;
  background-color: #f0f0f7;

  @media (max-width: 767px) {
    padding: 20px 15px;
  }

  &-header {
    display: flex;
    margin: 0 0 30px;
    justify-content: space-between;

    @media (max-width: 567px) {
      flex-wrap: wrap;
    }

    &-name {
      font-size: 24px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 32px;
      letter-spacing: normal;
      text-align: left;
      color: #43425d;

      @media (max-width: 567px) {
        flex: 1 0 100%;
        margin-bottom: 15px;
      }
    }

    &-search {
      @media (max-width: 567px) {
        flex: 1 0 100%;
        text-align: left;
      }
    }
  }

  &-body {
    margin: 1.5rem 3.125rem 1rem 3.125rem;
    display: flex;
    flex-wrap: wrap;
  }
}
@media (max-width: 480px) {
  /*.group {
      margin-right: 0;
    }*/
  .groups-body {
    margin: 1.5rem 1rem 1rem 1rem;
  }
}
.groups-body {
  justify-content: center;
  margin: 2rem 0 2rem 0;
}
/* .group:last-child {
    margin-right: 0;
  }*/
.group {
  height: auto;
  margin-right: 1rem;
  margin-left: 1rem;
}
@media (min-width: 1280px) {
  /*.groups-body {
      flex-wrap: nowrap;
    }*/
}
</style>