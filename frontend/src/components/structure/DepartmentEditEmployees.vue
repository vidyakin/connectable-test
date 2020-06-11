<template>
  <a-modal
    :visible="visible"
    centered
    :title="title"
    okText="Выбрать"
    cancelText="Отменить"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create', checkedEmpls) }"
    :ok-button-props="{ props: { disabled: mode=='chief', type: mode == 'chief' ? 'link' : 'primary' } }"
  >
    <div class="dept-empl-edit-container">
      <a-checkbox-group v-model="checkedEmpls">
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
              />
            </a-list-item-meta>
            <div class="empl-actions">
              <a-checkbox :value="item._id" v-show="mode == 'select'" />
              <a-icon
                type="crown"
                theme="filled"
                @click.stop="setAsLeader(item)"
                style="font-size:14pt; color: darkorange"
                v-show="mode == 'chief'"
              />
              <a-icon
                type="delete"
                v-show="mode == 'delete'"
                @click.stop="startDeleteEmployee({id: item._id, name: item.firstName+' '+item.lastName})"
                style="font-size:14pt"
              ></a-icon>
            </div>
          </a-list-item>
          <div v-if="loading && !busy" class="demo-loading-container">
            <a-spin />
          </div>
        </a-list>
      </a-checkbox-group>
    </div>
  </a-modal>
</template>

<script>
const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";
import Vue from "vue";
import { mapGetters } from "vuex";

import { GET_USERS } from "@/store/user/actions.type";

export default {
  props: {
    visible: Boolean,
    deptId: String,
    mode: String,
    employees: Array
  },
  data() {
    return {
      checkedEmpls: [],
      loading: false,
      busy: false
    };
  },
  computed: {
    ...mapGetters(["users", "currentClient"]),
    dataList() {
      if (!this.mode) return "";
      const empl_ids = this.employees.map(e => e._id);
      if (this.mode == "select") {
        return this.users.filter(
          u => !empl_ids.includes(u._id) && !u.deletion_mark
        );
      } else return this.users.filter(u => empl_ids.includes(u._id));
    },
    title() {
      if (this.mode == "select") return "Выберите новых сотрудников";
      if (this.mode == "delete") return "Выберите сотрудника для удаления";
      if (this.mode == "chief")
        return "Выберите начальника отдела нажатием на иконку в списке";
    }
  },
  mounted() {
    if (this.currentClient)
      this.$store.dispatch(GET_USERS, this.currentClient.workspace);
  },
  beforeCreate() {
    // в зависимости от режима надо по разному составлять список сотрудников
    // - добавление - показывать тех кто не в этом отделе (или вообще ни в каком? для перевода в другой отдел логичнее делать из карточки сотрудника)
    // - выбор лидера и удаление - тех кто в этом отделе
    // в чем смысл удаления сотрудника? увольнение? это логичнее делать из карточки. Перевод в другой отдел тоже
    // Vue.axios.get(fakeDataUrl).then(res => {
    //   this.dataList = res.data.results;
    // });
    //this.$store.dispatch(GET_USERS, this.currentClient.workspace);
  },
  methods: {
    onChange(e) {
      this.checkedEmpls = e;
      console.log(e);
    },

    startDeleteEmployee(d) {
      this.$emit("deleteEmpl", d);
    },
    setAsLeader(item) {
      const d = {
        id: item._id,
        name: item.firstName + " " + item.lastName
      };
      this.$emit("setEmplAsChief", d);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.checkedEmpls = [];
        console.log(`visible: ${newVal}`);
      }
    }
  }
};
</script>

<style lang="scss">
.dept-empl-edit-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.empl-actions {
  display: flex;
  align-items: center;

  label,
  i {
    margin-right: 2px;
  }
}
.empl-title {
  font-size: 12pt;
}
</style>