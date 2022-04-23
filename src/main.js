import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "./firebase";
import "./index.css";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(Toast);

const auth = useAuthStore();

auth.initializeAuthListener().then(() => {
  app.use(router).mount("#app");
});
