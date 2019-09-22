<template>
  <div class="setting">
    <div class="setting-name">Настройки нотификаций</div>
    <form class="u-form" @submit.prevent="handleSubmit">
        <div class="content-wrap">
            <div class="custom-control custom-checkbox mb-3">
              <input type="checkbox" v-model="settings.addUser" class="custom-control-input" id="addUser" name="addUser" >
              <label class="custom-control-label" for="addUser">При добавлении юзера</label>
            </div>

            <div class="custom-control custom-checkbox mb-3">
              <input type="checkbox" v-model="settings.publications" class="custom-control-input" id="publications" name="publications">
              <label class="custom-control-label" for="publications">При публикации в разделе компания, в группах, в которых состоит юзер, у
                пользователей, на которых он подписан</label>
            </div>

            <div class="custom-control custom-checkbox mb-3">
              <input type="checkbox" v-model="settings.eventComment" class="custom-control-input" id="eventComment" name="eventComment" value="">
              <label class="custom-control-label" for="eventComment">во всех публикациях и комментариях, где юзера тегнули через @</label>
            </div>

            <div class="custom-control custom-checkbox mb-3">
              <input type="checkbox" v-model="settings.eventCalendar" class="custom-control-input" id="eventCalendar" name="eventCalendar">
              <label class="custom-control-label" for="eventCalendar">при добавлении события в Календарь</label>
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Сохранить</button>
            </div>
        </div>
    </form>
  </div>
</template>
<script>
    import Vue from 'vue';
    import { INSERT_USER_INFO } from '../store/user/actions.type';
    import store from '../store';
    export default Vue.extend({
        data () {
            return {
                settings: {
                    addUser: '',
                    publications: '',
                    eventComment: '',
                    eventCalendar: ''
                },
                submitted: false,
                error: false
            }
        },
        methods: {
            handleSubmit(e) {
                const { addUser, publications, eventComment, eventCalendar } = this.settings;
                console.log(this.settings.addUser);
                /*if (firstName && lastName && email && password) {
                    this.$store
                        .dispatch(INSERT_USER_INFO, {
                            firstName:this.user.firstName,

                        }).finally(() => {

                    });
                }*/
            }
        },
    });
</script>
<style lang="scss">
  .is-hide-img-header{
    .setting {
      height: calc(100vh - 50px);
    }
  }
  .setting {
    padding: 30px;
    background-color: #f0f0f7;
    height: calc(100vh - 210px);
    overflow: auto;

    @media (max-width: 767px) {
      padding: 20px 15px;
    }
    &-name {
      font-size: 1.5rem;
      line-height: 32px;
      color: #43425d;
      text-align: left;
      margin-bottom: 30px;
    }
    .row {
      background: none;
    }
    .content-wrap {
      text-align: left;

      ul {
        list-style: none;
        padding: 0 0 0;
      }

    }
  }

</style>
