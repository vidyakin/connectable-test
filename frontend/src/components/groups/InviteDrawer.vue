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
        :notFoundContent="'Пользователь не найден'"
      >
        <!-- если поставить filteredData вместо data, выбранные позиции будут пропадать из списка выбора  -->
        <a-select-option v-for="d in data" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
      </a-select>
      <a-spin :spinning="buttonSpinning">
        <a-button type="primary" @click="sendInvite" :disabled="!selectedItems.length">Пригласить</a-button>
      </a-spin>
    </div>
  </a-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_USERS } from "../../store/user/actions.type";
import {
  APPROVE_PARTICIPANTS_REQUEST,
  CREATE_INVITE,
} from "../../store/group/actions.type";

export default {
  name: "AppInviteDrawer",
  data() {
    return {
      current: "",
      buttonSpinning: false,
      type: 1,
      data: [],
      selectedItems: [],
    };
  },
  props: {
    group: Object,
    close: Function,
    visible: Boolean,
  },
  computed: {
    ...mapGetters([
      "userData",
      "user",
      "currentGroup",
      "users",
      "currentClient",
    ]),
    filteredData() {
      return !this.data
        ? []
        : this.data.filter(
            (user) => !this.selectedItems.map((s) => s.key).includes(user._id)
          );
    },
  },
  methods: {
    onClose() {
      this.close();
    },
    search(text) {
      const searchText = text.toLowerCase().trim();
      // функция, превращающая юзера в строку из сочетаний имени и фамилии
      const allStr = (e) =>
        []
          .concat(
            e.firstName,
            e.lastName,
            e.firstName + " " + e.lastName,
            e.lastName + " " + e.firstName
          )
          .join("$")
          .toLowerCase();
      this.data =
        searchText === ""
          ? this.users
          : this.users.filter(
              (user) => allStr(user).indexOf(searchText) !== -1
            );
    },
    handleChange(value) {
      this.selectedItems = value;
    },
    sendInvite() {
      this.buttonSpinning = true;
      Promise.all(
        this.selectedItems.map((userId) => {
          const inviteData = {
            client_id: this.userData.result.client_id,
            user: userId.key,
            group: this.currentGroup._id,
            groupType: this.currentGroup.type,
          };
          console.log(`Создаем инвайт: ${JSON.stringify(inviteData, null, 2)}`);
          this.$store.dispatch(CREATE_INVITE, inviteData);
        })
      ).finally((result) => {
        this.buttonSpinning = false;
        this.openNotification();
        this.onClose();
      });
    },
    openNotification() {
      this.$notification["success"]({
        message: `Приглашение отправлено`,
        description: "Пользователь получит сообщение в ленте",
        placement: "topRight",
      });
    },
  },
  async mounted() {
    await this.$store.dispatch(GET_USERS, this.currentClient.workspace);
    const group_perticipants_ids = this.group.participants_ref.map((p) =>
      p.user_ref._id.toString()
    );
    this.data = this.users.filter(
      (u) => !group_perticipants_ids.includes(u._id)
    );
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