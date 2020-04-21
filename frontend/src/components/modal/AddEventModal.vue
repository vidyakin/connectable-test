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
      <h3>{{ event == undefined ? "Новое событие" : "Изменение события" }}</h3>
    </div>
    <a-form-model ref="eventForm" :model="theform" 
      :rules="rules"
      layout="vertical"
    >
      <div class="form-row">
        <div class="row">
          <div class="col-sm-12">
            <a-form-model-item prop="name">
              <app-input v-model="theform.name" placeholder="Название" label="Название" class="secondary form-input" />
            </a-form-model-item>
          </div>
          <div class="col-sm-5">
            <div class="label">Дата события</div>
            <a-form-model-item prop="dateEvent">
              <a-date-picker v-model="theform.dateEvent" :locale="locale" placeholder="Дата" format="D MMMM YYYY г."/>
            </a-form-model-item>
          </div>
          <div class="col-sm-5">
            <div class="label">Начало в:</div>
            <a-form-model-item prop="timeEvent">
              <!-- TODO: если так, то ошибка будет появляться только когда закончится ввод времени 
              но при валидации формы надо самому повторно перепроверять. Подумать, надо ли
              <a-form-model-item :validate-status="timeError" :help="timeErrorHelp" @changeOpen="changeTime"-->
              <a-time-picker v-model="theform.timeEvent" format="HH:mm" :minuteStep="10" :locale="locale" placeholder="Время" />
            </a-form-model-item>
          </div>
          
          <div class="col-sm-12">
            <div class="label">Пригласить участников</div>
            <a-form-model-item>
              <a-select v-model="theform.members"
                labelInValue
                mode="multiple"
                placeholder="Выберите пользователей"
                style="width: 100%"
                :filterOption="false"
                @search="search"
                @change="onMembersTextChange"
                :notFoundContent="'Пользователь не найден'"
              >
                <a-select-option v-for="d in usersData" :key="d._id">{{d.firstName + ' ' + d.lastName}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="col-sm-12">
            <a-form-model-item class="no-margin">
              <app-input v-model="theform.comment"
                placeholder="Дополнительная информация" label="Комментарий"
                class="secondary form-input"
              ></app-input>
            </a-form-model-item>
          </div>
          <div class="col-sm-12">
            <div class="event-color">
              <label>Цвет</label>
              <svg viewBox="0 0 20 20" height="30px" width="30px" v-for="color in colors" @click="setCurrentColor(color)" :key="color.color">
                <circle cx="10" cy="10" r="10" :fill="color.color">
                </circle>
                <circle cx="10" cy="10" r="7" :fill="theform.color.color === color.color ? color.color : 'white'">
                </circle>
              </svg>
            </div>
          </div>
        </div>
        <a-form-model-item>
          <div class="action">
            <a-button @click="createEvent">{{!event ? "Создать событие" : "Сохранить изменения" }}</a-button>
          </div>
        </a-form-model-item>
      </div>
      <!-- <div>
        {{ JSON.stringify(this.theform, null, 3)}}
      </div> -->
    </a-form-model>




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
                @change="onMembersTextChange"
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
    props: {
      visible: Boolean,
      close: Function,
      day: Object,
      event: Object
    },
    components: {
      AppInput,
    },
    
    data() {
      return {
        theform: {
          name: "",
          dateEvent: moment(),
          timeEvent: moment(),
          members: [],
          comment: "",
          color: '#ff0000'
        },
        isEdit: false,
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
        // currentColor: {
        //   color: '#ff0000',
        // },
        usersData: [],
        selectedItems: [],
        date: moment(),
        locale,
        statusEmailSend: false,
        timeError: '',
        timeErrorHelp: '',
        rules: {
          name: [
            { required: true, message: 'Название не может быть пустым!', transform: this.tr, trigger: 'blur' },
            { max: 100, message: 'Максимальная длина заголовка - 100 символов', transform: this.tr, trigger: 'blur' },
            { min: 5, message: 'Слишком короткое название, введите больше 5 символов', transform: this.tr, trigger: 'blur' }
          ],
          dateEvent: [
            { required: true, message: 'Нужно указать дату', trigger: 'blur'}, 
            { validator: this.validDate }
          ],
          timeEvent: [
            { required: true, message: 'Нужно указать время', trigger: 'blur'},
            { validator: this.validTime }
          ],
          members: [
            { required: true, message: 'Нужно выбрать участников', trigger: 'blur' }
          ]
        },
        //userInfo: (store.getters.userData ? store.getters.userData : store.getters.user),
      };
    },
    /**
     * МЕТОДЫ КОМПОНЕНТА
     */
    methods: {
      setCurrentColor(color) {
        this.theform.color = { color };
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
        if (d.isBefore(moment().startOf('day'))) {
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
      // не нужно для FormModel
      // getDecoratorData(n) {
      //   const options = { rules: this.rules[n] }
      //   const result = [ n, options ];
      //   return result;
      // },

      /**
       * Создание события по кнопке "Создать"
       */
      async createEvent(e) {

        e.preventDefault();
        const usersData = this.usersData; // чтоб не потерять this
        const blancDate = moment().hours(12).minutes(0).seconds(0)

        let start = this.theform.dateEvent //this.form.getFieldValue("dateEvent");
        // const t = this.theform.timeEvent; // время не используем, оно в дате
        // start.hour(t.hour()).minute(t.minute()).seconds(0).utcOffset(3); // set H&m&s from time field to date field
        start.seconds(0).utcOffset(3); // добавляем часовой пояс и убираем секунды
        console.log(`event starts at: ${start.format()}`)
        
        this.$refs.eventForm.validate(async valid => {
          if (!valid) {
            console.log(`Form not valid`);
            return;
          }
          const keys = this.selectedItems.map(e => e.key)
          // Выбираем емейлы указанных в списке лиц
          const attendees = usersData.filter(ud => keys.includes(ud._id)).map(e => ({email: e.email}))
          //this.createButtonSpinning = true;
          const event = {
            name: this.theform.name, 
            date: start, 
            comment: this.theform.comment, 
            color: this.theform.color,
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
      onMembersTextChange(value) {
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
    /**
     * ВЫЧИСЛЯЕМЫЕ СВОЙСТВА
     */
    computed: {
      ...mapGetters(['user', 'userData', 'users', 'notification']),
      userInfo() {
        return this.userData ? this.userData : this.user;
      }
    },
    /**
     * ХУКИ ЖИЗНЕННОГО ЦИКЛА
     */
    beforeCreate() {
      //this.form = this.$form.createForm(this, { name: 'eventCreatingForm' });
    },
    created() {
      if (this.userData && this.userData.result) {
        this.$store.dispatch(GET_NOTIFICATION, this.userData.result._id);
        console.log(`created: ${this.notification}`);
      } else {
        console.log(`AddEventModal.vue->created(): No userData.result here`);
      }
      
    },
    watch: {
      notification(notification) {
        this.statusEmailSend = (notification && notification.userId == store.getters.userData.result._id 
          ? notification.publications
          : false);
      },
      visible() {
        if (this.visible) {
          console.log(`Форма открылась`);
          if (!!this.event) {
            const emails = this.event.attendees.map(att => att.email)
            this.theform = { 
              name: this.event.name,
              dateEvent: moment(this.event.date),
              timeEvent: moment(this.event.date),
              color: { color: this.event.color },
              members: this.users.filter(u => emails.includes(u.email)).map(e => ({key:e._id, label:`${e.firstName} ${e.lastName}`})),
              comment: this.event.comment
            }
            this.selectedItems = this.theform.members
          } else {
            this.day.hours(12).minutes(0);
            this.theform.dateEvent = this.day;
            this.theform.timeEvent = this.day;
          }
        }
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