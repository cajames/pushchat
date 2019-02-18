import axios from "axios";
import router from "../router";
import get from "lodash/get";

const state = () => ({
  currentUser: null,
  allUsers: [],
  chatMessages: [],
  pollingInterval: null
});

const getters = {
  activeChats(state) {
    const currentUser = get(state, "currentUser.id", null);
    if (!currentUser) {
      return [];
    }

    if (!state.chatMessages) {
      return [];
    }

    const chatKeys = state.chatMessages.reduce((keys, item) => {
      const otherUserKey = item.to === currentUser ? "from" : "to";
      const otherUser = item[otherUserKey];
      // If not there, add
      if (!keys[otherUser] || keys[otherUser].createdAt < item.createdAt) {
        return {
          ...keys,
          [otherUser]: {
            user: otherUser,
            id: item.id,
            text: `${item.from}: ${item.text}`,
            createdAt: item.createdAt
          }
        };
      }

      return keys;
    }, {});
    return Object.values(chatKeys).sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  },
  otherMembers(state) {
    const currentMemberId = get(state, "currentUser.id");
    return state.allUsers.filter(user => user.id !== currentMemberId);
  }
};

const mutations = {
  saveCurrentUser(state, payload) {
    state.currentUser = payload;
    localStorage.setItem("currentUser", JSON.stringify(payload));
  },
  saveAllUsers(state, payload) {
    state.allUsers = payload;
  },
  saveAllMessages(state, payload) {
    state.chatMessages = payload;
  },
  savePollingInterval(state, interval = null) {
    state.pollingInterval = interval;
  }
};

const actions = {
  // Logout User
  logout({ commit }) {
    router.push("/register");
    commit("saveCurrentUser", null);
  },

  // Register User
  async registerUser({ commit }, name) {
    const { data: entry } = await axios.post("/api/users", {
      id: name
    });
    commit("saveCurrentUser", entry);
    router.push("/");
  },

  // Startup user from localStorage
  async getCurrentUserFromLocal({ commit, dispatch }) {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        return;
      }
      commit("saveCurrentUser", user);
      await dispatch("checkCurrentUserExists", { id: user.id });
    } catch (error) {
      console.error(error);
    }
  },

  // Check if user exists on startup
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

  // Get all users
  async getAllUsers({ commit }) {
    const { data: users } = await axios.get("/api/users");
    commit("saveAllUsers", users);
  },

  // Get all chats for user
  async getAllUserChats({ state, commit }) {
    const currentUser = state.currentUser;
    const p1 = axios.get(
      `/api/messages?from=${currentUser.id}&_sort=createdAt&_order=desc`
    );
    const p2 = axios.get(
      `/api/messages?to=${currentUser.id}&_sort=createdAt&_order=desc`
    );
    const [{ data: fromMessages }, { data: toMessages }] = await Promise.all([
      p1,
      p2
    ]);
    commit("saveAllMessages", [...fromMessages, ...toMessages]);
  },

  // Get
  startPollingUser({ commit, dispatch }) {
    const interval = setInterval(() => {
      dispatch("getAllUserChats");
      dispatch("getAllUsers");
    }, 3000);
    commit("savePollingInterval", interval);
  },
  endPollingUser({ commit, state }) {
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
