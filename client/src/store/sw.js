import get from "lodash/get";

const vapidPublicKey =
  "BBU8orMQ7mdAobZYAQUgQ0mhkUiMO1KVjToepH_orj4JD2zChcoH_gedtK6Hya-QBHUQ17-_aC9DgyLMx-vcmmQ";

const state = () => ({
  installPrompt: null,
  swRegistration: null,
  subscription: null
});

const getters = {
  hasInstallPrompt(state) {
    return !!state.installPrompt;
  },
  notificationStatus(state) {
    if (!("Notification" in window && navigator.serviceWorker)) {
      return "blocked";
      // Display the UI to let the user toggle notifications
    }

    if (window.Notification.permission === "granted" && state.subscription) {
      return "granted";
    } else if (window.Notification.permission === "blocked") {
      return "blocked";
      /* the user has previously denied push. Can't reprompt. */
    } else {
      return "request";
      /* show a prompt to the user */
    }
  }
};

const mutations = {
  saveInstallPrompt(state, prompt) {
    state.installPrompt = prompt;
  },
  saveServiceWorkerRegistration(state, registration) {
    state.swRegistration = registration;
  },
  saveUserPushSubscription(state, sub) {
    state.subscription = sub;
  }
};

const actions = {
  promptAppInstall({ state }) {
    if (state.installPrompt) {
      state.installPrompt.prompt();
    }
  },
  async setUpPushNotifications({ state, commit, dispatch }) {
    if (!state.swRegistration) {
      return;
    }
    const reg = state.swRegistration;

    try {
      const sub = await reg.pushManager.getSubscription();

      // Has existing sub. Use that
      if (sub) {
        commit("saveUserPushSubscription", sub);
        console.log("subscription: ", sub);
        dispatch(
          "user/updateCurrentUser",
          { notification: sub },
          { root: true }
        );
        return;
      }
    } catch (error) {
      console.error(error);
    }
  },
  async enablePushNotifications({ state, commit, dispatch }) {
    console.log("enable notifications", state);
    if (!state.swRegistration) {
      return;
    }
    const reg = state.swRegistration;
    try {
      const sub = await reg.pushManager.getSubscription();

      // Has existing sub. Use that
      if (sub) {
        commit("saveUserPushSubscription", sub);
        dispatch(
          "user/updateCurrentUser",
          { notification: sub },
          { root: true }
        );
        console.log("subscription: ", sub);
        return;
      }

      // No existing sub, subscribe
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      if (newSub) {
        commit("saveUserPushSubscription", newSub);
        dispatch(
          "user/updateCurrentUser",
          { notification: newSub },
          { root: true }
        );
      }
    } catch (error) {
      console.error("Failed to get Push subscription: ", error);
    }
  },
  async disablePushNotifications({ state, commit }) {
    debugger;
    const sub = state.subscription;
    if (!sub) {
      return;
    }
    try {
      await sub.unsubscribe();
      commit("saveUserPushSubscription", null);
    } catch (error) {
      console.error("Failed to unsubscribe push sub", error);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
};

// Private Functions
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
