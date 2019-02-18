import axios from "axios";
import get from "lodash/get";

const state = () => ({
  chatUser: null,
  messages: [],
  pollingInterval: null
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
  },
  savePollingInterval(state, interval = null) {
    state.pollingInterval = interval;
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
    const p1 = axios.get(`/api/messages?to=${currentUserId}&from=${userId}`);
    const p2 = axios.get(`/api/messages?to=${userId}&from=${currentUserId}`);
    const [{ data: toMessages }, { data: fromMessages }] = await Promise.all([
      p1,
      p2
    ]);
    const messages = [...fromMessages, ...toMessages];
    commit("saveCurrentChatMessages", messages);
  },
  async sendNewMessage({ state, rootState, dispatch }, text) {
    const currentUserId = get(rootState, "user.currentUser.id", null);
    const toUserId = get(state, "chatUser.id", null);

    if (!(currentUserId && toUserId && text.trim())) {
      return;
    }

    await axios.post(`/api/messages`, {
      to: toUserId,
      from: currentUserId,
      text
    });
    await dispatch("getChatMessages", toUserId);
  },
  clearChatUser({ commit }) {
    commit("saveCurrentChatMessages", []);
    commit("saveCurrentChatUser", null);
  },
  startPollingMessages({ commit, state, dispatch }) {
    const toUser = get(state, "chatUser.id");
    if (!toUser) {
      return;
    }
    const interval = setInterval(() => {
      dispatch("getChatMessages", toUser);
    }, 3000);
    commit("savePollingInterval", interval);
  },
  endPollingMessages({ commit, state }) {
    const interval = get(state, "pollingInterval");
    if (interval) {
      clearInterval(interval);
    }
    commit("savePollingInterval", null);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};
