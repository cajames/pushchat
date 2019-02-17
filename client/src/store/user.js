import axios from "axios";
import router from "../router";

const state = () => ({
    currentUser: null
});

const mutations = {
    saveCurrentUser(state, payload) {
        state.currentUser = payload;
        localStorage.setItem("currentUser", JSON.stringify(payload));
    }
};

const actions = {
    async registerUser({ commit }, name) {
        const { data: entry } = await axios.post("/api/users", {
            id: name
        });
        commit("saveCurrentUser", entry);
        router.push("/");
    },
    async getCurrentUserFromLocal({ commit, dispatch }) {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) {
          return
        }

        commit("saveCurrentUser", user);
        await dispatch("checkCurrentUserExists", { id: user.id });
    },
    async checkCurrentUserExists({ commit }, { id }) {
        try {
            const user = await axios.get(`/api/users/${id}`);
            if (!user) {
                throw "No user";
            }
        } catch (e) {
            localStorage.clear();
            commit("saveCurrentUser", null);
            router.push("/register");
        }
    },
    registerNotification({}, payload) {},
    getAllOtherUsers({ commit }) {},
    getAllUserChats({ commit }) {}
};

export default {
    state,
    mutations,
    actions,
    namespaced: true
};
