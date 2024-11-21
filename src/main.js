import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar } from "quasar";

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
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "./assets/css/main.css";

import BootstrapVue3 from "bootstrap-vue-3";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia()).use(BootstrapVue3).use(Quasar).use(router).mount("#app");
