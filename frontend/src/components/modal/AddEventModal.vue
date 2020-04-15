<template>
  <a-modal
    closable
    destroyOnClose
    wrapClassName="add-event-modal"
    :visible="visible"
    :footer="null"
    @cancel="close"
    :bodyStyle="{height:'auto', padding:'0'}"
  >
    <div slot="title">
      <h3>Новое событие</h3>
    </div>
    <a-form :form="form" layout="vertical"  @submit="createEvent">
      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <a-form-item>
              <app-input
                placeholder="Название" label="Название"
                v-decorator="getDecoratorData('name')"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>
          <div class="col-sm-6">
            <div class="label">Дата</div>
            <a-form-item>
              <a-date-picker v-decorator="getDecoratorData('dateEvent')" :locale="locale" placeholder="Дата"/>
            </a-form-item>
          </div>
          <div class="col-sm-6">
            <div class="label">Время</div>
            <a-form-item>
              <!-- TODO: если так, то ошибка будет появляться только когда закончится ввод времени 
              но при валидации формы надо самому повторно перепроверять. Подумать, надо ли
              <a-form-item :validate-status="timeError" :help="timeErrorHelp" @changeOpen="changeTime"-->
              <a-time-picker 
                format="HH:mm" 
                :minuteStep="10" 
                v-decorator="getDecoratorData('timeEvent')" :locale="locale" placeholder="Время"  
              />
            </a-form-item>
          </div>

          <div class="col-sm-12">
            <div class="label">Пригласить участников</div>
            <a-form-item>
              <a-select v-decorator="getDecoratorData('members')"
                labelInValue
                mode="multiple"
                placeholder="Выберите пользователей"
                style="width: 100%"
                :filterOption="false"
                @search="search"
                @change="handleChange"
                :notFoundContent="'Пользователя не найдено'"
              >
                <a-select-option v-for="d in usersData" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="col-sm-12">
            <a-form-item class="no-margin">
              <app-input
                placeholder="Дополнительная информация" label="Комментарий"
                class="secondary form-input"
              ></app-input>
            </a-form-item>
          </div>
          <div class="col-sm-12">
            <div class="event-color">
              <label>
                Цвет
              </label>
              <svg viewBox="0 0 20 20" height="30px" width="30px" v-for="color in colors" @click="setCurrentColor(color)" :key="color.color">
                <circle cx="10" cy="10" r="10" :fill="color.color">
                </circle>
                <circle cx="10" cy="10" r="7" :fill="currentColor.color === color.color ? color.color : 'white'">
                </circle>
              </svg>
            </div>
          </div>
        </div>
        <a-form-item>
          <div class="action">
            <a-button @click="createEvent">Создать событие</a-button>
          </div>
        </a-form-item>
      </div>
    </a-form>




    <!-- <div class="event-name form-line">
      <label>Название</label>
      <a-input v-model="name"></a-input>
    </div>
    <div class="event-date-time form-line">
      <div class="event-date">
        <label>Дата</label>
        <div>
          <a-date-picker v-model="date" :locale="locale"></a-date-picker>
        </div>
      </div>
      <div class="event-time">
        <label>Время</label>
        <div>
          <a-time-picker format="HH:mm" @change="changeTime" placeholder="Время"></a-time-picker>
        </div>
      </div>
    </div>
    <div class="event-name form-line">
      <label>Пригласить участника</label>
      <a-select v-decorator="['members']"
                labelInValue
                mode="multiple"
                placeholder="Выберите пользователей"
                style="width: 100%"
                :filterOption="false"
                :value="selectedItems"
                @search="search"
                @change="handleChange"
                :notFoundContent="'Пользователя не найдено'"
      >
        <a-select-option v-for="d in usersData" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
      </a-select>
    </div>
    < !--<div class="event-name">
      <label>Продолжительность</label>

      <a-date-picker v-model="duration"></a-date-picker>
    </div>- ->
    <div class="event-name form-line">
      <label>Комментарий</label>
      <a-input v-model="comment"></a-input>
    </div>
    <div class="event-color">
      <label>
        Цвет
      </label>
      <svg viewBox="0 0 20 20" height="30px" width="30px" v-for="color in colors" @click="setCurrentColor(color)" :key="color.color">
        <circle cx="10" cy="10" r="10" :fill="color.color">
        </circle>
        <circle cx="10" cy="10" r="7" :fill="currentColor.color === color.color ? color.color : 'white'">
        </circle>
      </svg>
    </div>
    <div class="action">
      <a-button @click="createEvent">Создать событие</a-button>
    </div> -->
  </a-modal>
</template>

<script>
  import {mapGetters} from 'vuex';
  import AppInput from '../common/Input';
  import moment from 'moment';
  import locale from 'ant-design-vue/es/date-picker/locale/ru_RU';
  
  import {CREATE_EVENT, UPDATE_USER_INFO, GET_USERS} from '../../store/user/actions.type';
  import store from '../../store';
  import {GET_NOTIFICATION} from '../../store/notification/actions.type';
  
  export default {
    data() {
      return {
        modalStyle: {
          height: "auto",
          padding: "5px"
        },
        colors: [
          {color: '#ff0000'},
          {color: '#ffaa00'},
          {color: '#e6d700'},
          {color: '#00d43f'},
          {color: '#00dfc9'},
          {color: '#3b86ff'},
          {color: '#8e55d9'},
        ],
        currentColor: {
          color: '#ff0000',
        },
        //name: '',
        usersData: [],
        selectedItems: [],
        //selectVal: '',
        date: moment(),
        //time: moment.relTime,
        //comment: '',
        locale,
        statusEmailSend: false,
        timeError: '',
        timeErrorHelp: '',
        rules: {
          name: [
            { required: true, message: 'Название не может быть пустым!', transform: this.tr },
            { max:100, message: 'Максимальная длина заголовка - 100 символов', transform: this.tr }
          ],
          dateEvent: [
            { required: true, message: 'Нужно указать дату'}, 
            { validator: this.validDate }
          ],
          timeEvent: [
            { required: true, message: 'Нужно указать время'},
            { validator: this.validTime }
          ],
          members: [
            { required: true, message: 'Нужно выбрать участников' }
          ]
        },
        //userInfo: (store.getters.userData ? store.getters.userData : store.getters.user),
      };
    },
    methods: {
      setCurrentColor(color) {
        this.currentColor = color;
      },
      tr(v) {
        return v === undefined ? '' : v.trim()
      },
      changeTime(opened) {
        if (!opened) {
          const time = this.form.getFieldValue("timeEvent");
          if (time !== null) {
            const hour = time.hour();
            if (hour > 19 || hour < 8) { // TODO: сделать настройку в компании "Рабочие часы" и определять по ней
              this.timeError = 'error'
              this.timeErrorHelp = 'Выберите рабочие часы'
            } else {
              this.timeError = ''
              this.timeErrorHelp = ''
            }
          }
        }
      },
      validDate(rule, d, callback) {
        const diffWithToday = this.date.diff(d,'days');
        if (diffWithToday > 0) {
          callback('Дата не может быть в прошлом');
        } else {
          callback();
        }
      },
      validTime(rule, t, callback) {
        if (t) {
          const hour = t.hour();
          if (hour > 19 || hour < 8) { // TODO: сделать настройку в компании "Рабочие часы" и определять по ней
            callback(new Error('Выберите рабочие часы'))
          } else {
            callback();
          }
        } else {
          callback()
        }
      },
      getDecoratorData(n) {
        const options = { rules: this.rules[n] }
        const result = [ n, options ];
        return result;
      },
      async createEvent(e) {

        e.preventDefault();
        const usersData = this.usersData; // чтоб не потерять this
        const blancDate = moment().hours(12).minutes(0).seconds(0)

        let start = this.form.getFieldValue("dateEvent");
        const t = this.form.getFieldValue("timeEvent");
        start.hour(t.hour()).minute(t.minute()).seconds(0).utcOffset(3); // set H&m&s from time field to date field
        console.log(`event starts at: ${start.format()}`)
        
        this.form.validateFields(async (err, formFields) => {
          if (err) {
            console.log(`${err}`);
            return;
          }
          const keys = this.selectedItems.map(e => e.key)
          const attendees = usersData.filter(ud => keys.includes(ud._id)).map(e => ({email: e.email}))
          //this.createButtonSpinning = true;
          const event = {
            name: formFields.name, 
            date: start, 
            comment: formFields.comment, 
            color: this.currentColor.color,
            userId: this.userInfo.result._id,
            userEmail: this.userInfo.result.email,
            emailSend: this.statusEmailSend,
            attendees: (this.selectedItems ? attendees : '')
          };
          console.log(`event is ${JSON.stringify(event,null,3)}`);
          //const calendar = google.calendar({version: 'v3', auth:""});
          await this.$store.dispatch(CREATE_EVENT, event)
          //.finally(() => {
            // this.form.setFieldsValue({
            //   name: '',
            //   dateEvent: blancDate,
            //   timeEvent: blancDate,
            //   comment: ''
            // });
          this.close();
          //});
        });
      },
      handleChange(value) {
        this.selectedItems = value
        // Object.assign(this, {
        //   value,
        //   data: [],
        // });
        // this.selectVal = value;
      },
      search(text) {
        text = text.toLowerCase();
        this.usersData = this.users.filter(el => {
          return (
                  el.firstName.toLowerCase().indexOf(text) !== -1 ||
                  el.lastName.toLowerCase().indexOf(text) !== -1 ||
                  (el.firstName + ' ' + el.lastName).toLowerCase().indexOf(text) !==
                  -1 ||
                  (el.lastName + ' ' + el.firstName).toLowerCase().indexOf(text) !== -1
          );
        });
      },
    },
    components: {
      AppInput,
    },
    computed: {
      ...mapGetters(['user', 'userData', 'users', 'notification']),
      userInfo() {
        return this.userData ? this.userData : this.user;
      }
    },
    props: {
      visible: Boolean,
      close: Function,
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'eventCreatingForm' });
    },
    created() {
      if (this.userData && this.userData.result) {
        this.$store.dispatch(GET_NOTIFICATION, this.userData.result._id);
      } else {
        console.log(`AddEventModal.vue->created(): No userData.result here`);
      }
    },
    watch: {
      notification(notification) {
        this.statusEmailSend = (notification && notification.userId == store.getters.userData.result._id 
          ? notification.publications
          : false);
      }
    },
    async mounted() {
      await this.$store.dispatch(GET_USERS);
      this.usersData = this.users
      //console.log('userData: ',JSON.stringify(this.usersData,null,2))
    },
  };
</script>

<style lang="scss">

  .add-event-modal {
    .ant-modal-content {
      padding: 2.5rem;
      width: 33.75rem;
      height: 35rem;
    }

    .ant-modal-header {
      border: 0;
    }

    h3 {
      font-weight: bold;
      text-align: center;
    }

    label {
      font-weight: bold;
    }

    .action {
      margin-top: 1rem;
      text-align: center;

      .ant-btn {
        border-radius: 4px;
        background-color: #3b86ff;
        color: #ffffff;
      }

    }
    .ant-modal-content {
      padding: 2rem;
      width: 30rem;
      height: auto;
    }
  }

  .ant-form-item.no-margin {
    margin-bottom: 0;
  }

  .no-bottom-margin {
    margin-bottom: 5px;
  }

  .event-date-time {
    display: flex;

    .event-date {
      flex: 3;
      padding-right: 2rem;

      span {
        width: 100% !important;
      }

    }

    .event-time {
      flex: 1;
    }

  }

  .event-color {
    display: flex;
    margin-top: 1rem;
    line-height: 26px;
    height: 26px;

    label {
      margin-right: 2rem;
    }

    svg {
      cursor: pointer;
      margin-right: 0.5rem;
    }
  }
  .add-event-modal .ant-modal-content {
    max-width: 100%;
  }

  .form-line {
    margin-top: .6rem;
  }

</style>