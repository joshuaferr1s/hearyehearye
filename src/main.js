import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import "./firebase";
import "./index.css";

const app = createApp(App);

app.use(createPinia());

const auth = useAuthStore();

auth.initializeAuthListener().then(() => {
  app.use(router).mount("#app");
});
