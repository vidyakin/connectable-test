<template>
  <div class="departaments">
    <div class="row content-center">
      <div class="seo">CEO</div>
    </div>
    <div class="row content-center">
      <div class="seo seo-1">Департамент маркетинга</div>
      <div class="seo seo-1">Департамент HR</div>
      <a-popover placement="bottom" trigger="click">
        <template slot="content">
          <a-table
          v-if="users"
          :columns="columns"
          :dataSource="data"
          @change="onChange"
          :pagination="false"
      >
        <div slot="name" slot-scope="text" class="table-row-name" @click="goTo(text.id)">
          <a-avatar :src="text.googleImage"></a-avatar>
          {{text.firstName}} {{text.lastName}}
        </div>
        
      </a-table>
      {{userLength}} - {{endingWords(userLength)}}
        </template>
        <div class="seo seo-1" @click="currentLenth">Департамент IT</div>
      </a-popover>
    </div>
    <div class="row content-center">
      <div class="seo">Отдел оффлайн маркетинга</div>
      <div class="seo">Отдел онлайн маркетинга</div>
    </div>
    <div class="row content-center">
      <div class="seo">Группа PPC</div>
      <div class="seo">Группа CEO</div>
      <div class="seo">Граппа Facebook</div>
    </div>
  </div>
</template>
<script>
import { GET_USERS } from '@/store/user/actions.type';
import { mapGetters } from 'vuex';

const columns = [
  {
    title: '',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}

export default {
  data() {
    return {
      data: [],
      columns,
      userLength: '',
      output: '',
    };
  },
  methods: {
    onChange,
    goTo(id) {
      this.$router.push({ name: 'profile', params: { _id: id } });
    },
    currentLenth() {
      this.userLength = this.users.length;
    },
    endingWords(count) {
      if (count == 0) {
        this.output = 'нет участников';
      } else if (count == 1) {
        this.output = ' участник';
      } else if ((count > 20) && ((count % 10) == 1)) {
        this.output = ' участник';
      } else if (((count >= 2) && (count <= 4)) || (((count % 10) >= 2) && ((count % 10) <= 4)) && (count > 20)) {
        this.output = ' участника';
      } else {
        this.output = ' участников';
      }
      return this.output;
    },
  },
  computed: {
    ...mapGetters(['users']),
  },
  beforeMount() {
    this.$store.dispatch(GET_USERS);
  },
  watch: {
    users(users) {
      this.data = users.map(e => {
        const { googleImage, firstName, lastName, positions, phone, email } = e;
        const row = {};
        row.name = { googleImage, firstName, lastName, id: e._id };
        row.positions = positions.join(', ');
        row.phone = phone;
        row.email = email;
        row.key = e._id;
        return row;
      });
      this.fullData = [...this.data];
    },
  },
};
</script>

<style lang="scss" >
.ant-table-small {
  border: none;
}

.ant-table-tbody > tr > td {
  border-bottom: none;
}
.ant-avatar {
  margin-right: 20px;

  @media (max-width: 767px) {
    margin-right: 0;
  }
}
.row {
  display: flex;
  align-items: center;
  height: 130px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
  justify-content: center;
  &:nth-child(odd) {
    background-color: #f6f6fa;
  }
  &:nth-child(even) {
    background-color: #dce4f7;
  }
  &:nth-child(1) {
    justify-content: center;
  }
  &:nth-child(2) {
    justify-content: space-evenly;
  }
  .seo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 55px;
    border-radius: 4px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #ffffff;
    font-family: SourceSansPro;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #949494;
    padding: 0 10px;
    margin: 0 18px;
    cursor: pointer;
    &:hover {
      color: #3b86ff;
    }
  }
}
</style>