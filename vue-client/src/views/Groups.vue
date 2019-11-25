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
      <div class="groups-header-search">
        <a-button type="primary" @click="openCreate" >Создать группу</a-button>
      </div>
    </div>
    <div class="groups-body">
      <app-group v-for="(group, index) in this.filterData" :group="group" :key="index" ></app-group>
    </div>
  </div>
</template>
<script>
import AppGroupCreateDrawer from '../components/drawers/GroupCreateDrawer';
//import AppSearchForm from '../components/common/SearchForm';

import { mapGetters } from 'vuex';
import { GET_GROUPS } from '../store/group/actions.type';
import AppGroup from '../components/common/Group';
import store from '../store';
export default {
  components: {
    AppGroupCreateDrawer,
    AppGroup,
  },
  data() {
    return {
      createVisible: false,
      groupsData: [],
      searchText: '',
      filterData: [],
      datauser: (store.getters.userData ? store.getters.userData.result : store.getters.user )
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
    ...mapGetters(['groups', 'userData']),
  },
  beforeCreate() {
    this.$store.dispatch(GET_GROUPS);
  },
  beforeMount() {
    this.$store.dispatch(GET_GROUPS);
  },
  watch: {
    groups(groups) {
      this.filterData = groups;
      this.fullData = [...this.filterData];
    },
    searchText(text) {
      this.filterData = this.fullData.filter(el => {
        return (
        el.name.toLowerCase().indexOf(text) !== -1
        );
      });

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
.is-hide-img-header{
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
    .group {
      margin-right: 0;
    }
    .groups-body {
      margin: 1.5rem 1rem 1rem 1rem;
    }
  }
  .groups-body {

    margin: 2rem 0 2rem 0;
  }
  .group:last-child {
    margin-right: 0;
  }
  .group {
    height: auto;
  }
  @media (min-width: 1280px) {
    .groups-body {
      flex-wrap: nowrap;
    }
  }

</style>