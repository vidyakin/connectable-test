<template>
  <div class="forgot-password">
    <div>
      <!-- Блок формы -->
      <a-row>
        <a-col :span="6" :offset="9">
          <a-form-model ref="forgotForm" :model="theform" :rules="rules">
            <legend>Восстановление пароля fix #4</legend>
            <a-form-model-item prop="email">
              <app-input v-model="theform.email" placeholder="Введите e-mail" label="E-mail" />
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                type="primary"
                :disabled="disabled && theform.email.trim() != ''"
                @click="handleSubmit"
              >Отправить</a-button>
              <a-button type="link" @click="$router.go(-1)">Вернуться</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
      <!-- Блок инфо-сообщений -->
      <a-row>
        <a-col :span="6" :offset="9" v-if="forgotInfo && forgotInfo.status == 200">
          <a-alert :description="forgotInfo.message" type="success" />
        </a-col>
        <a-col :span="6" :offset="9" v-else-if="forgotInfo && forgotInfo.status == 404">
          <a-alert :description="forgotInfo.message" type="error" />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "../store";
import { mapGetters } from "vuex";

import { FORGOT_PASSWORD } from "../store/user/actions.type";
import AppInput from "@/components/common/Input";

export default {
  components: { AppInput },
  data() {
    return {
      theform: {
        email: ""
      },
      disabled: false,
      error: {
        email: false
      },
      rules: {
        email: [
          {
            required: true,
            message: "Это поле обязательно",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["forgotInfo", "userData"])
  },
  methods: {
    async handleSubmit(e) {
      console.log("submit forgeting:", this.theform);
      try {
        this.disabled = true;
        const valid = await this.$refs.forgotForm.validate();
        await this.$store.dispatch(FORGOT_PASSWORD, {
          email: this.theform.email
        });
      } catch (error) {
        console.log("submit error:", error);
      } finally {
        this.disabled = false;
        if (this.forgotInfo && this.forgotInfo.status !== 404)
          this.theform.email = "";
      }
    }
  }
};
</script>

<style lang="scss">
.forgot-password {
  padding-top: 5%;
}
</style>