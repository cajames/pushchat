import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// Styles and icons
import "./assets/svg.css"
import "./assets/tailwind.css"
import "./assets/icons"

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
