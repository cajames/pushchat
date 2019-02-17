import axios from "axios";
import get from "lodash/get";

const state = () => ({
    chatUser: null,
    messages: []
});

const getters = {
    chatMessages(state) {
        const chatUserId = get(state, "chatUser.id");
        return state.messages
            .map(item => {
                if (item.from !== chatUserId) {
                    return {
                        ...item,
                        isSelf: true
                    };
                }
                return item;
            })
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }
};

const mutations = {
    saveCurrentChatUser(state, user) {
        state.chatUser = user;
    },
    saveCurrentChatMessages(state, messages) {
        state.messages = messages;
    }
};

const actions = {
    async getChatUser({ commit }, userId) {
        const { data: user } = await axios.get(`/api/users/${userId}`);
        commit("saveCurrentChatUser", user);
    },
    async getChatMessages({ commit, rootState }, userId) {
        const currentUserId = get(rootState, "user.currentUser.id", null);
        if (!currentUserId || !userId) {
            return;
        }
        const p1 = axios.get(
            `/api/messages?to=${currentUserId}&from=${userId}`
        );
        const p2 = axios.get(
            `/api/messages?to=${userId}&from=${currentUserId}`
        );
        const [
            { data: toMessages },
            { data: fromMessages }
        ] = await Promise.all([p1, p2]);
        const messages = [...fromMessages, ...toMessages];
        commit("saveCurrentChatMessages", messages);
    },
    clearChatUser({ commit }) {
        commit("saveCurrentChatMessages", []);
        commit("saveCurrentChatUser", null);
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};
