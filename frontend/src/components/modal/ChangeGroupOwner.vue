<template>
  <a-modal
    closable
    :visible="visible"
    destroyOnClose
    centered
    :footer="null"
    title="Выберите нового владельца группы"
    okText="Выбрать"
    cancelText="Отменить"
    @cancel="() => { $emit('close') }"
    @ok="() => { $emit('create', checkedEmpls) }"
  >
    <div class="group-owner-change-container">
      <a-list :data-source="dataList" size="small">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta
            :description="item.positions.length ? item.positions[0] : 'нет должности'"
          >
            <a
              slot="title"
              :href="'/profile/'+item._id"
              class="empl-title"
            >{{ item.firstName+' '+item.lastName }}</a>
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />Выбрать
          </a-list-item-meta>
          <a-button type="primary" @click="selectOwner(item._id)">Выбрать</a-button>
        </a-list-item>
        <!-- <div v-if="loading && !busy" class="demo-loading-container">
            <a-spin />
        </div>-->
      </a-list>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters } from "vuex";

// actions & mutations
import { GET_USERS } from "@/store/user/actions.type";
import {
  DELETE_PARTICIPANT,
  CREATE_PARTICIPANT,
  EDIT_GROUP
} from "../../store/group/actions.type";
import { CHANGE_POST } from "../../store/post/mutations.type";

export default {
  props: {
    visible: Boolean,
    group: Object
  },
  data() {
    return {
      a: []
    };
  },
  computed: {
    ...mapGetters(["users"]),
    dataList() {
      if (!this.users) return [];
      return this.users.filter(u => !u.deletion_mark);
    }
  },
  methods: {
    async selectOwner(_id) {
      const creator = this.group.creatorId;
      const newGroup = {
        ...this.group,
        creatorId: _id
      };
      try {
        // заменяем владельца-создателя
        await this.$store.dispatch(EDIT_GROUP, newGroup);
        // удаляем старого из участников
        await this.$store.dispatch(DELETE_PARTICIPANT, {
          groupId: this.group._id,
          participantId: creator
        });
        // добавляем нового как участника
        // TODO: добавляется неправильно в саму группу в массив participants
        await this.$store.dispatch(CREATE_PARTICIPANT, {
          participantId: _id,
          groupId: this.group._id
        });
        this.$success({
          title: "Владелец группы изменен",
          content: "Новый владелец группы: " + _id
        });
      } catch (error) {
        this.$error({
          title: "Ошибка при установке владельца группы",
          content: error.message
        });
      } finally {
        this.$emit("close");
      }
    }
  }
};
</script>

<style lang="scss">
</style>