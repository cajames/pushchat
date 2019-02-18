import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

// Plugins
import "./plugins/svg";
import "./plugins/router";
import "./plugins/sw";

// Styles and icons
import "./assets/tailwind.css";

Vue.config.productionTip = false;

const main = async () => {
    await store.dispatch("user/getCurrentUserFromLocal", undefined, { root: true });
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount("#app");
};

main();
