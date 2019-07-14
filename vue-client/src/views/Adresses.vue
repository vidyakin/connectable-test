<template>
  <a-table v-if="users" :columns="columns" :dataSource="data" @change="onChange" :pagination="false">
    <div slot="name" slot-scope="text" class="table-row-name">
      <a-avatar :src="text.googleImage"></a-avatar>
      {{text.firstName}} {{text.lastName}}
    </div>
  </a-table>
</template>
<script>
  import {GET_USERS} from "../store/user/actions.type";
  import {mapGetters} from "vuex";

  const columns = [{
    title: 'Сотрудник',
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'}
  }, {
    title: 'Должность',
    dataIndex: 'positions',
    filters: [{
      text: 'Менеджер',
      value: 'Менеджер',
    }, {
      text: 'Лидер отдела продаж',
      value: 'Лидер отдела продаж',
    }],
    filterMultiple: true,
    onFilter: (value, record) => record.positions.indexOf(value) !== -1,
  }, {
    title: 'Телефон',
    dataIndex: 'phone',
  }, {
    title: 'Почта',
    dataIndex: 'email',
  }
  ];

  const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }, {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  }];

  function onChange(pagination, filters, sorter) {
    console.log('params', pagination, filters, sorter);
  }


  export default {
    name: 'AppAddress',
    data() {
      return {
        data: [],
        columns,
      }
    },
    methods: {
      onChange,
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
          const {googleImage, firstName, lastName, positions, phone, email} = e;
          const row = {};
          row.name = {googleImage, firstName, lastName};
          row.positions = positions.join(', ');
          row.phone = phone;
          row.email = email;
          row.key = e._id;
          return row;
        });
        console.log(this.data);
      }
    }
  }
</script>

<style lang="scss">
  .table-row-name {
    font-size: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.85;
    letter-spacing: normal;
    text-align: left;
    color: #4d565c;
  }

  .ant-dropdown-menu-item-selected {

    background-color: white!important;
    span {
      color: #43425d;
      background-color: white;
    }

    .ant-checkbox-checked {

      .ant-checkbox-inner {
        background-color: white;
        border-color: #a3a0fb;

        &:focus {
          box-shadow: 0px;
        }

        &:after {
          border-color: #a3a0fb;
        }
      }

    }



  }

</style>