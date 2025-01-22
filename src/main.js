import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar, Notify } from "quasar";

import "quasar/src/css/index.sass";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons-round/material-icons-round.css";
import "@quasar/extras/material-icons-sharp/material-icons-sharp.css";
import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";
import "@quasar/extras/material-symbols-rounded/material-symbols-rounded.css";
import "@quasar/extras/material-symbols-sharp/material-symbols-sharp.css";
import "@quasar/extras/fontawesome-v5/fontawesome-v5.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import "@quasar/extras/ionicons-v4/ionicons-v4.css";
import "@quasar/extras/eva-icons/eva-icons.css";
import "@quasar/extras/bootstrap-icons/bootstrap-icons.css";

import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/css/main.css";
import langRu from "quasar/lang/ru";

import BootstrapVue3 from "bootstrap-vue-3";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
  },
  lang: langRu,
});

const pinia = createPinia();
app.use(pinia);

import { usePermissionStore } from "@/stores/PermissionStore";
const permissionStore = usePermissionStore();
permissionStore.initializeStore();

app.use(BootstrapVue3).use(router).mount("#app");
