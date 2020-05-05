<template>
  <a-modal
    :visible="visible"
    title="Выберите сотрудников подразделения"
    okText="Создать"
    cancelText="Отменить"
    @cancel="() => { visible = false }"
    @ok="() => { $emit('create') }"
  >
    <div class="demo-infinite-container">
      <a-list :data-source="dataList" size="small">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta :description="item.email">
            <a-checkbox @change="onChange(item)" />
            <a slot="title" :href="item.href">{{ item.name.last }}</a>
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </a-list-item-meta>
          <div>
            <a-icon type="form" @click.stop="setAsLeader(item.name)" />
            <a-icon type="delete" @click.stop="startDelete"></a-icon>
          </div>
        </a-list-item>
        <div v-if="loading && !busy" class="demo-loading-container">
          <a-spin />
        </div>
      </a-list>
    </div>
  </a-modal>
</template>

<script>
const fakeDataUrl =
  "https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo";
import Vue from "vue";

export default {
  props: {
    visible: Boolean,
    deptId: String,
    editMode: Boolean
  },
  data() {
    return {
      dataList: [],
      loading: false,
      busy: false
    };
  },
  beforeCreate() {
    Vue.axios.get(fakeDataUrl).then(res => {
      this.dataList = res.data.results;
    });
  },
  methods: {
    onChange(item) {
      console.log(item);
    }
  }
};
</script>

<style>
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
</style>