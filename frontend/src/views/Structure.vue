<template>
  <div class="structure">
    <app-create-project :visible="createVisible" :close="closeCreate"/>
    <app-create-department :visible="departmentVisible" :close="closeDepartment"/>
    <app-edit-department :visible="depEditVisible" :close="closeDepEdit" :curentData="dataDep" />
    <div class="structure-header">
      <div class="structure-header-name">
        Структура
      </div>
      <div class="structure-header-search" v-if="userCanRead">
        <a-button type="primary" v-if="test" @click="openDepartment">Добавить разделы</a-button>
        <a-button type="primary" v-else @click="openCreate">Создать проект</a-button>
      </div>
    </div>

    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="Структура" key="1">
        <div class="c-structure" v-if="departments">

          <!-- <div class="c-structure__head" v-for="(dep, index) in departments" v-if="(dep.level == 1)" :key="index" > -->
          <div class="c-structure__head" v-for="(dep, index) in departments.filter(e => e.level === 1)" :key="index" >
            <div class="structure-el">

            <a-popover placement="bottom" trigger="click" >
              <template slot="content" >
                <a-table
                        v-if="dep.name"
                        :columns="columns"
                        :dataSource="userDataFunc(dep)"
                        :pagination="false"

                >
                  <div slot="name" slot-scope="text" class="table-row-name" @click="goTo(text.id)">
                    <a-avatar :src="(text.googleImage ? text.googleImage : require('../assets/no_image.png'))"></a-avatar>
                    {{text.firstName}} {{text.lastName}}
                  </div>

                </a-table>
                <!-- <div class="count" v-if="Object.size(dep.users)">{{Object.size(dep.users)}} - {{endingWords(Object.size(dep.users))}} </div> -->
                <div class="count" v-if="len(dep.users)">{{countString(dep.users)}} </div>
              </template>
              <div class="c-structure__link" @click="currentLenth">{{dep.name}}

              </div>

            </a-popover>

            <a-popconfirm
                    title="Подтверите удаление"
                    okText="Подтверждаю"
                    cancelText="Отмена"
                    @confirm="deleteBlock(dep._id)" v-if="userCanRead"
            >

              <a-tooltip title="Удалить">
                <a-button class="delete-department" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
              <a-tooltip title="Редактировать" v-if="userCanRead">
                <a-button class="delete-department edit" icon="edit" @click="openDepEdit(dep.name, dep.users, dep._id)"></a-button>
              </a-tooltip>
            </div>
          </div>

          <div class="c-structure__row" >

            <div class="c-structure__item" v-for="(dep_2, index) in departments.filter(e => e.level > 1 && e.level < 3)" :key="index">

              <div class="c-structure__article" v-if="(dep_2.level == 2)">
                <a-popover placement="bottom" trigger="click" >
                  <template slot="content" >
                    <a-table
                            v-if="dep_2.name"
                            :columns="columns"
                            :dataSource="userDataFunc(dep_2)"
                            :pagination="false"

                    >
                      <div slot="name" slot-scope="text" class="table-row-name" @click="goTo(text.id)">
                        <a-avatar :src="(text.googleImage ? text.googleImage : require('../assets/no_image.png'))"></a-avatar>
                        {{text.firstName}} {{text.lastName}}
                      </div>

                    </a-table>
                    <div class="count" v-if="len(dep_2.users)">{{ countString(dep_2.users) }} </div>
                  </template>
                  <div class="c-structure__link" @click="currentLenth">{{dep_2.name}}

                  </div>
                </a-popover>
                <a-popconfirm
                        title="Подтверите удаление"
                        okText="Подтверждаю"
                        cancelText="Отмена"
                        @confirm="deleteBlock(dep_2._id)" v-if="userCanRead"
                >
                  <a-tooltip title="Удалить">
                    <a-button class="delete-department" icon="delete"></a-button>
                  </a-tooltip>

                </a-popconfirm>
                <a-tooltip title="Редактировать" v-if="userCanRead">
                  <a-button class="delete-department edit" icon="edit" @click="openDepEdit(dep_2.name, dep_2.users, dep_2._id)"></a-button>
                </a-tooltip>
              </div>

              <div class="c-structure__child__row ">

                <!-- <div class="c-structure__child__item" v-for="(dep_3, index) in departments" v-if="(dep_3.level == 3 && dep_3.parent.label == dep_2.name)" :key="index"> -->
                <div class="c-structure__child__item" v-for="(dep_3, index) in departments.filter(e => e.level == 3 && e.parent.label == dep_2.name)" :key="index">

                  <div class="c-structure__child__article">
                    <a-popover placement="bottom" trigger="click">
                      <template slot="content">
                        <a-table
                                v-if="dep_3.name"
                                :columns="columns"
                                :dataSource="userDataFunc(dep_3)"
                                :pagination="false"

                        >
                          <div slot="name" slot-scope="text"  @click="goTo(text.id)">
                            <a-avatar :src="(text.googleImage ? text.googleImage : require('../assets/no_image.png'))"></a-avatar>
                            {{text.firstName}} {{text.lastName}}
                          </div>

                        </a-table>
                        <div class="count" v-if="len(dep_3.users)">{{ countString(dep_3.users) }} </div>
                      </template>
                      <div class="c-structure__link" @click="currentLenth">{{dep_3.name}}

                      </div>
                    </a-popover>
                    <a-popconfirm
                            title="Подтверите удаление"
                            okText="Подтверждаю"
                            cancelText="Отмена"
                            @confirm="deleteBlock(dep_3._id)" v-if="userCanRead"
                    >
                      <a-tooltip title="Удалить">
                        <a-button class="delete-department" icon="delete"></a-button>
                      </a-tooltip>

                    </a-popconfirm>
                    <a-tooltip title="Редактировать" v-if="userCanRead">
                      <a-button class="delete-department edit" icon="edit" @click="openDepEdit(dep_3.name, dep_3.users, dep_3._id)"></a-button>
                    </a-tooltip>
                  </div>
                  <!-- было v-if="(dep_4.level == 4 && dep_4.parent.label == dep_3.name)" -->
                  <div class="c-structure__detail__row" v-for="(dep_4, index) in departments.filter(e => e.level === 4 && e.parent.label === dep_3.name)" :key="index">

                    <div class="c-structure__detail__item">

                      <div class="c-structure__detail__article">
                        <a-popover placement="bottom" trigger="click">
                          <template slot="content">
                            <a-table
                                    v-if="dep_4.name"
                                    :columns="columns"
                                    :dataSource="userDataFunc(dep_4)"
                                    :pagination="false"

                            >
                              <div slot="name" slot-scope="text"  @click="goTo(text.id)">
                                <a-avatar :src="(text.googleImage ? text.googleImage : require('../assets/no_image.png'))"></a-avatar>
                                {{text.firstName}} {{text.lastName}}
                              </div>

                            </a-table>
                            <div class="count" v-if="len(dep_4.users)">{{ countString(dep_4.users) }} </div>
                          </template>
                          <div class="c-structure__link" @click="currentLenth">{{dep_4.name}}

                          </div>
                        </a-popover>
                        <a-popconfirm
                                title="Подтверите удаление"
                                okText="Подтверждаю"
                                cancelText="Отмена"
                                @confirm="deleteBlock(dep_4._id)" v-if="userCanRead"
                        >
                          <a-tooltip title="Удалить">
                            <a-button class="delete-department" icon="delete"></a-button>
                          </a-tooltip>

                        </a-popconfirm>
                        <a-tooltip title="Редактировать" v-if="userCanRead">
                          <a-button class="delete-department edit" icon="edit" @click="openDepEdit(dep_4.name, dep_4.users, dep_4._id)"></a-button>
                        </a-tooltip>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
          <!--<AppDepantaments />-->
      </a-tab-pane>
      <a-tab-pane tab="Проекты" key="2">
        <app-projects/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>

  import AppCreateProject from '../components/drawers/CreateProject';
  import AppCreateDepartment from '../components/drawers/CreateDepartment';
  import AppEditDepartment from '../components/drawers/EditDepartment';
  import {mapGetters} from 'vuex';
  import {GET_DEP, DELETE_DEP} from '../store/structure/actions.type';
  import AppProjects from '../views/Projects';
  import AppDepantaments from '../components/common/Departaments';
  import store from '../store';
  const columns = [
    {
      title: '',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },

  ];
  const rows = [
    {
      title: '',
      dataIndex: 'name',
      scopedSlots: { customRender: 'name' },
    },

  ];
  // Может вызывать ошибку при передаче необъявленной переменной
  // Object.size = (obj) => {
  //   let size = 0;
  //   for (key in obj) {
  //     if (obj.hasOwnProperty(key)) size++;
  //   }
  //   return size;
  // };
  export default {
    components: {
      AppCreateProject,
      AppProjects,
      AppDepantaments,
      AppCreateDepartment,
      AppEditDepartment,
    },
    data() {
      return {
        createVisible: false,
        departmentVisible : false,
        depEditVisible : false,
        test: true,
        data: [],
        dep_arr: [],
        res_data: [],
        columns,
        userLength: '',
        output: '',
        dataDep: {},
        datauser: (store.getters.userData.result ? store.getters.userData.result : store.getters.user )
      };
    },
    methods: {
      goTo(id) {
        this.$router.push({ name: 'profile', params: { _id: id } });
      },
      userDataFunc(param) {
        const resData = [];
        const usersLen = Object.keys(param.users || {}).length;
        if ( usersLen ) {
          for (let i = 0; i < usersLen; i++) {
            for (let j = 0; j < Object.keys(this.data || {}).length; j++) {

              if (param.users[i].key === this.data[j].key) {
                resData[i] = this.data[j];
              }
            }
          }
          return resData;
        }
      },
      currentLenth() {
        this.userLength = this.users.length;
        // console.log(this.userLength);
      },
      // Количество полей в объекте 
      len(arr) {
        return Object.keys(arr || {}).length
      },
      // Строка с количеством сотрудников в отделе
      countString(arr) {
        const len = Object.keys(arr || {}).length;
        const descr = this.endingWords(len);
        return `${len} - ${descr}`;
      },
      callback(key) {
        if (key === '2') {
          this.test = false;
        } else if (key === '1') {
          this.test = true;
        }
      },
      closeCreate() {
        this.createVisible = false;
      },
      openCreate() {
        this.createVisible = true;
      },
      closeDepartment() {
        this.departmentVisible = false;
      },
      closeDepEdit() {
        this.depEditVisible = false;
      },
      openDepartment() {
        this.departmentVisible = true;
      },
      openDepEdit(name, listOfUsers, id) {
        this.depEditVisible = true;
        this.dataDep.depName = name;
        const arrUsers = [];
        if (listOfUsers) {
          for (const [key, value] of Object.entries(listOfUsers)) {
            arrUsers.push(value.key);
          }
        }

        this.dataDep.users = arrUsers;
        this.dataDep.id = id;
      },
      deleteBlock(id) {
        this.$store
                .dispatch(DELETE_DEP, id)
                .finally(() => {
                  this.$store.dispatch(GET_DEP);
                });
      },
      endingWords(count) {
        let outputVal = '';
        if (count === 0) {
          outputVal = 'нет участников';
        } else if (count === 1) {
          outputVal = ' участник';
        } else if ((count > 20) && ((count % 10) === 1)) {
          outputVal = ' участник';
        } else if (((count >= 2) && (count <= 4)) || (((count % 10) >= 2) && ((count % 10) <= 4)) && (count > 20)) {
          outputVal = ' участника';
        } else {
          outputVal = ' участников';
        }
        return this.output = outputVal;
      },
    },
    beforeCreate() {
      this.$store.dispatch(GET_DEP);
    },
    computed: {
      ...mapGetters(['departments', 'users', 'userData']),
      userCanRead() {
        const val = Boolean(this.datauser) && this.$can('read', {accessEmail: this.datauser.email, __type: 'User'});
        console.log(`userCanRead: datauser=${JSON.stringify(this.datauser)} val=${val}`);
        return val;
      }
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

      departments(departments) {
        if (!departments) {
          this.dep_arr = [];
          return;
        }
        const row = [];
        this.dep_arr = departments.map(e => {
          // if (e.users && Object.size(e.users)) {
          const usersLen = Object.keys(e.users || {}).length
          if (e.users && usersLen) {
            for (let i = 0; i < usersLen; i++) {
              row[i] = e.users[i].key;
            }
            return row;
          }
        });
        this.dep_arr = this.dep_arr.filter(e => {
          // TODO: потом надо понять почему тут массив с элементом равным undef
          e !== undefined && e.level === 3 && e.parent.label === e.name
        })
      },
    },

  };
</script>

<style lang="scss">
  .delete-department.edit {
    margin-right: 0;
  }
  .delete-department {
    background: transparent;
    position: absolute;
    right: 0;
    margin-right: 28px;
    top: 0;
    border: none;
    z-index: 1;
    padding: 0 8px;
    height: auto;

    i {
      font-size: 12px;
      vertical-align: top;
      line-height: 23px !important;
    }
  }
  .structure-el {
    position: relative;
    min-width: 200px;
    display: inline-block;
    max-width: 100%;
    .delete-department {
      right: 0;
    }
  }
  .c-structure__detail__item .delete-department, .c-structure__child__item .delete-department{
    right: 0;
  }
  .is-hide-img-header{
    .structure {
      height: calc(100vh - 50px);
    }
  }
  .ant-tabs-tabpane {
    overflow: auto;
  }
  .structure {
    padding: 30px;

    height: calc(100vh - 210px);
    overflow: auto;
    background-color: #f0f0f7;

    @media (max-width: 767px) {
      padding: 20px 15px;
    }

    &-header {
      display: flex;
      margin: 0 0 30px;
      justify-content: space-between;

      @media (max-width: 567px) {
        flex-wrap: wrap;
      }

      &-name {
        font-size: 24px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 32px;
        letter-spacing: normal;
        text-align: left;
        color: #43425d;

        @media (max-width: 567px) {
          flex: 1 0 100%;
          margin-bottom: 15px;
        }
      }
    }

    .ant-tabs {
      background-color: white;
      height: calc(100vh - 350px);
      // margin: 30px 0; // из-за этого полосы прокрутки при 100% высоте

      .ant-tabs-nav-scroll {
        text-align: left;
      }
    }
  }

  .c-structure{
    min-width: 980px;
    overflow-x: visible;
  }

  .c-structure__head{
    margin-bottom: 20px;

    .c-structure__link{
      min-width: 200px;
      color: #000000;
      background-color: #d4d6dc;
    }
  }

      .c-structure__row{
        position: relative;
        font-size: 0;

        &:before{
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          margin-left: -1px;
          width: 2px;
          height: 20px;
          border: 1px solid #949494;
        }
      }

        .c-structure__item{
          min-width: 33.33%;
          position: relative;
          padding: 20px 15px;
          display: inline-block;
          vertical-align: top;
          text-align: center;

          &:first-child{
            &:before{
              content: none;
            }
          }

          &:before{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            margin-left: -50%;
            width: 100%;
            border: 1px solid #949494;
          }
          .c-structure__child__row:empty {
            display: none;
          }
        }

          .c-structure__article{
            position: relative;
            display: inline-block;
            margin-bottom: 40px;
            padding: 0;
            &:before{
              content: '';
              position: absolute;
              top: -20px;
              left: 50%;
              margin-left: -1px;
              width: 2px;
              height: 100%;
              border: 1px solid #949494;
            }

            .c-structure__link{
              min-width: 200px;
            }
          }

            .c-structure__link{
              position: relative;
              display: inline-block;
              max-width: 100%;
              padding: 15px 15px;
              font-size: 16px;
              line-height: 1.5;
              font-weight: 700;
              color: #949494;
              box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
              background-color: #ffffff;
              cursor: pointer;
              z-index: 1;
              transition: .3s ease;

              &:hover{
                color: #3b86ff;

              }
            }

        .c-structure__child__row{
          position: relative;
          display: block;
          width: 100%;
          font-size: 0;

          &:before{
            content: '';
            position: absolute;
            top: -60px;
            left: 50%;
            margin-left: -1px;
            width: 2px;
            height: 40px;
            border: 1px solid #949494;
          }
        }

          .c-structure__child__item{
            width: 50%;
            position: relative;
            padding: 0 5px;
            display: inline-block;
            vertical-align: top;

            &:first-child{
              &:before{
                content: none;
              }
            }

            &:before{
              content: '';
              position: absolute;
              top: -20px;
              left: 0;
              margin-left: -50%;
              width: 100%;
              border: 1px solid #949494;
            }
          }

            .c-structure__child__article{
              position: relative;
              display: block;
              margin-bottom: 40px;

              &:before{
                content: '';
                position: absolute;
                top: -20px;
                left: 50%;
                margin-left: -1px;
                width: 2px;
                height: 100%;
                border: 1px solid #949494;
              }

              .c-structure__link{
                display: block;
              }
            }

              .c-structure__detail__row{
                position: relative;
                padding-left: 20px;

                &:before{
                  content: '';
                  position: absolute;
                  top: -60px;
                  left: 10px;
                  width: 1px;
                  bottom: 26px;
                  border: 1px solid #949494;
                }
              }

                .c-structure__detail__item{
                  position: relative;
                  margin-bottom: 15px;

                  &:before{
                    content: '';
                    position: absolute;
                    margin-top: -1px;
                    left: -10px;
                    bottom: 26px;
                    width: 100%;
                    border: 1px solid #949494;
                  }
                }

                  .c-structure__detail__article{

                    .c-structure__link{
                      display: block;
                      background-color: #007bff;
                      color: #ffffff;
                    }
                  }
.ant-popover-inner-content:empty {
  display: none;
}
</style>