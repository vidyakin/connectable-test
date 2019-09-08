<template>
  <div class="groups">
    <app-group-create-drawer :visible="createVisible" :close="closeCreate" />
    <div class="groups-header">
      <div class="groups-header-name">Группы</div>
      <div class="groups-header-search">
        <a-button type="primary" @click="openCreate">Создать группу</a-button>
      </div>
    </div>
    <div class="groups-body">
      <app-group v-for="(group, index) in groups" :group="group" :key="index"></app-group>
    </div>
  </div>
</template>
<script>
import AppGroupCreateDrawer from '../components/drawers/GroupCreateDrawer';
import { mapGetters } from 'vuex';
import { GET_GROUPS } from '../store/group/actions.type';
import AppGroup from '../components/common/Group';

export default {
  components: {
    AppGroupCreateDrawer,
    AppGroup,
  },
  data() {
    return {
      createVisible: false,
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
  beforeCreate() {
    this.$store.dispatch(GET_GROUPS);
  },
  computed: {
    ...mapGetters(['groups']),
  },
};
</script>

<style lang="scss">
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
</style>