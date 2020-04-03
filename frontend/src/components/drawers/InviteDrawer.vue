<template>
  <a-drawer
    title="Пригласить пользователя"
    :closable="true"
    @close="onClose"
    destroyOnClose
    :visible="visible"
    wrapClassName="create-group-drawer"
  >
    <div class="invite-wrapper">
      <a-select
        labelInValue
        mode="multiple"
        :value="selectedItems"
        placeholder="Выберите пользователей"
        style="width: 100%"
        :filterOption="false"
        @change="handleChange"
        @search="search"
        :notFoundContent="'Пользователя не найдено'"
      >
        <!-- если поставить filteredData вместо data, выбранные позиции будут пропадать из списка выбора  -->
        <a-select-option v-for="d in data" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
      </a-select>
      <a-spin :spinning="buttonSpinning">
        <a-button type="primary" @click="sendInvite">Пригласить</a-button>
      </a-spin>
    </div>
  </a-drawer>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {GET_USERS} from '../../store/user/actions.type';
  import {APPROVE_PARTICIPANTS_REQUEST, CREATE_INVITE} from '../../store/group/actions.type';

  export default {
    name: 'AppInviteDrawer',
    data() {
      return {
        current: '',
        buttonSpinning: false,
        type: 1,
        data: [],
        selectedItems: [],
      };
    },
    components: {},
    computed: {
      ...mapGetters(['user', 'currentGroup', 'users']),
      filteredData() {
        return !this.data ? [] : this.data.filter(user => !this.selectedItems.map(s => s.key).includes(user._id))
      }
    },
    methods: {
      onClose() {
        this.close();
      },
      search(text) {
        const searchText = text.toLowerCase().trim()
        // функция, превращающая юзера в строку из сочетаний имени и фамилии
        const allStr = e => []
          .concat(e.firstName, e.lastName, e.firstName + ' ' + e.lastName, e.lastName + ' ' + e.firstName)
          .join('$')
          .toLowerCase()
        this.data = searchText === '' ? this.users : this.users.filter(user => allStr(user).indexOf(searchText) !== -1)
      },
      handleChange(value) {
        this.selectedItems = value
      },
      sendInvite() {
        this.buttonSpinning = true;
        Promise.all(this.selectedItems.map(userId => {
            this.$store.dispatch(CREATE_INVITE, {userId: userId.key, groupId: this.currentGroup._id, groupType:this.currentGroup.type});
          },
        ))
          .finally(() => {
            this.buttonSpinning = false;
            this.onClose();
          });
      },
    },
    props: {
      close: Function,
      visible: Boolean,
    },
    async mounted() {
      await this.$store.dispatch(GET_USERS)
      this.data = this.users;
    }
  };
</script>

<style lang="scss">
  .invite-wrapper {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
</style>