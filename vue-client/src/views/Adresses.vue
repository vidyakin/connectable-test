<template>
  <div class="address">
    <div class="address-header">
      <div class="address-header-name">
        Адресная книга
      </div>
      <div class="address-header-search">
        <a-input  v-model="searchText">
          <a-icon type="search" slot="prefix"></a-icon>
        </a-input>
      </div>
    </div>
    <div class="address-body">
      <a-table v-if="users" :columns="columns" :dataSource="data" @change="onChange" :pagination="false" size="small">
        <div slot="name" slot-scope="text" class="table-row-name">
          <a-avatar :src="text.googleImage"></a-avatar>
          {{text.firstName}} {{text.lastName}}
        </div>
      </a-table>
    </div>
  </div>
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
        searchText: '',
      }
    },
    methods: {
      onChange,
      pressEnter() {
        console.log(this.searchText);
      }
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
        this.fullData = [...this.data]
      },
      searchText(text) {
        this.data = this.fullData.filter(el => {
          return el.name.firstName.indexOf(text) !== -1
            || el.name.lastName.indexOf(text) !== -1
            || (el.name.firstName + ' ' + el.name.lastName).indexOf(text) !== -1
            || (el.name.lastName + ' ' + el.name.firstName).indexOf(text) !== -1;
        })
      },
    }
  }
</script>

<style lang="scss">

  .address {
    height: calc(100vh - 3.125rem);
    overflow: auto;
    background-color: #f0f0f7;

    &-header {
      display: flex;
      margin: 1.5rem 3.125rem 1rem 3.125rem;
      justify-content: space-between;

      &-name {
        height: 31px;
        font-size: 24px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: left;
        color: #43425d;
      }

      .ant-input {
        background-color: #f0f0f7!important;
        border-radius: 5rem;
      }

    }

    &-body {
      margin: 1.5rem 3.125rem 1rem 3.125rem;
      background-color: white;
    }

  }

  .table-row-name {
    font-size: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.85;
    letter-spacing: normal;
    text-align: left;
    color: #4d565c;

    .ant-avatar {
      margin-right: 0.5rem;
    }

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