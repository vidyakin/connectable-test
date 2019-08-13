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
        :value="value"
        placeholder="Select users"
        style="width: 100%"
        :filterOption="false"
        @search="search"
        @change="handleChange"
        :notFoundContent="'Пользователя не найдено'"
      >
        <a-select-option v-for="d in data" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
      </a-select>
      <a-spiner :spinning="buttonSpinning">
        <a-button type="primary" @click="sendInvite">Пригласить</a-button>
      </a-spiner>
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
        value: [],
      };
    },
    components: {},
    computed: {
      ...mapGetters(['user', 'currentGroup', 'users']),
    },
    methods: {
      onClose() {
        this.close();
      },

      search(text) {
        text = text.toLowerCase();
        this.data = this.users.filter(el => {
          return el.firstName.toLowerCase().indexOf(text) !== -1
            || el.lastName.toLowerCase().indexOf(text) !== -1
            || (el.firstName + ' ' + el.lastName).toLowerCase().indexOf(text) !== -1
            || (el.lastName + ' ' + el.firstName).toLowerCase().indexOf(text) !== -1;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          value,
          data: [],
        });
      },
      sendInvite() {
        this.buttonSpinning = true;
        Promise.all(this.value.map(userId => {
            this.$store.dispatch(CREATE_INVITE, {userId: userId.key, groupId: this.currentGroup._id});
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
    mounted() {
      this.$store.dispatch(GET_USERS);
    },
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