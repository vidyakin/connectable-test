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
      <a-list :data-source="dataList" size="small" v-if="dataList.length">
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
      <a-empty v-else>
        <div slot="description">Нет сотрудников для замены</div>
      </a-empty>
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
  CHANGE_GROUP_OWNER,
} from "../../store/group/actions.type";
import { CHANGE_POST } from "../../store/post/mutations.type";

export default {
  props: {
    visible: Boolean,
    group: Object,
  },
  data() {
    return {
      a: [],
    };
  },
  computed: {
    ...mapGetters(["users"]),
    dataList() {
      if (!this.users || !this.group) return [];
      const creator = this.group.creator;
      return this.users.filter((u) => !u.deletion_mark && u._id != creator);
    },
  },
  methods: {
    async selectOwner(_id) {
      try {
        await this.$store.dispatch(CHANGE_GROUP_OWNER, {
          groupId: this.group._id,
          newOwner: _id,
        });
        const creator = this.currentGroup.participants_ref.find(
          (p) => (p.user_ref = this.currentGroup.creator)
        );
        this.$success({
          title: "Владелец группы изменен",
          content:
            "Новый владелец группы: " +
            creator.firstName +
            " " +
            creator.lastName,
        });
      } catch (error) {
        this.$error({
          title: "Ошибка при установке владельца группы",
          content: error.message,
        });
      } finally {
        this.$emit("close");
      }
    },
  },
};
</script>

<style lang="scss">
</style>