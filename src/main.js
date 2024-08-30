import { createApp } from "vue";
import { router } from "./routes/routes.js";
import { createPinia } from "pinia";
import axios from "axios";
import App from "./App.vue";
import FloatingVue from 'floating-vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'floating-vue/dist/style.css';


axios.defaults.baseURL = 'https://backend-sistema-referidos.onrender.com/api/'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


const myApp = createApp(App);

myApp.use(pinia);
myApp.use(router);
myApp.use(FloatingVue);

myApp.mount("#app");
