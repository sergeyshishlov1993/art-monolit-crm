<template>
  <q-page-container>
    <q-page class="row justify-center items-center">
      <q-card
        class="q-pa-md"
        style="max-width: 500px; width: 100%; height: auto"
      >
        <q-card-section>
          <div class="text-h5 text-center">Вход</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="loginUser" @reset="onReset">
            <q-input
              v-model="name"
              label="Имя пользователя"
              type="text"
              filled
              lazy-rules
              :rules="[validateUser]"
            />
            <q-input
              v-model="password"
              label="Пароль"
              type="password"
              filled
              lazy-rules
              :rules="[validatePassword]"
              class="q-mt-md"
            />
            <div class="row justify-between q-mt-md">
              <q-btn type="submit" label="Вход" color="primary" />
              <q-btn type="reset" label="Очистить" color="secondary" flat />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/authService";

const router = useRouter();
const name = ref("");
const password = ref("");

const validateUser = (val) =>
  (!!val && val.length > 2) || "Имя не может быть пустым или меньше 2 символов";

const validatePassword = (val) => !!val || "Пароль не может быть пустым";

async function loginUser() {
  try {
    await login(name.value, password.value.toString());
    router.push("/");
  } catch (error) {
    console.error("error login", error);
  }
}

const onReset = () => {
  email.value = "";
  password.value = "";
};
</script>

<style lang="scss" scoped></style>
