import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import user from "./store/user";
import chat from "./store/chat";
import sw from "./store/sw";

export default new Vuex.Store({
  modules: {
    user,
    chat,
    sw
  }
});
