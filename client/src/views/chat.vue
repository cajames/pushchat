<template>
  <div class="h-screen w-screen flex flex-col justify-between bg-primary-lightest">
    <!-- Nav -->
    <div class="bg-primary w-full p-4 text-white flex items-center shadow absolute">
      <router-link class="text-white mr-2" to="/">
        <svgicon name="back" width="25" height="25"></svgicon>
      </router-link>
      <span class="flex-1 mr-2">{{ userName }}</span>
      <svgicon :name="hasNotification" width="20" height="20"></svgicon>
    </div>

    <!-- No chats -->
    <div
      v-if="noMessages"
      class="flex-1 pt-16 flex flex-col justify-center items-center text-grey-dark"
    >
      <svgicon name="message-circle" height="100" width="100" class="mb-4"></svgicon>
      <span>No messages...</span>
    </div>

    <!-- Chat window -->
    <div v-else ref="chatWindow" class="flex-1 pt-16 flex flex-col mx-4 overflow-y-auto">
      <span
        :key="message.id"
        v-for="message in chatMessages"
        class="p-2 bg-grey-light self-start mb-2 rounded"
        :class="{ 'bg-primary-light': message.isSelf, 'self-end': message.isSelf }"
      >{{message.text}}</span>
    </div>

    <!-- Input -->
    <div class="p-2 bg-primary-dark flex">
      <input type="text" placeholder="Write your message..." class="flex-1 px-2 py-4">
      <button class="p-2 p-4 bg-primary-darker text-white" title="Send">
        <svgicon name="send" height="20" width="20" class></svgicon>
      </button>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import get from "lodash/get";

const UserStore = namespace("user");
const ChatStore = namespace("chat");

@Component({
  beforeRouteLeave(to, from, next) {
    this.clearChatUser();
    next();
  }
})
export default class ChatPage extends Vue {
  @UserStore.State
  currentUser;
  @ChatStore.State
  chatUser;
  @ChatStore.Action
  getChatMessages;
  @ChatStore.Action
  getChatUser;
  @ChatStore.Action
  clearChatUser;
  @ChatStore.Getter
  chatMessages;

  async created() {
    const chatId = get(this, "$route.params.id");
    await this.getChatUser(chatId);
    await this.getChatMessages(chatId);
  }

  get userName() {
    return get(this, "chatUser.id", "Loading...");
  }

  get hasNotification() {
    return get(this, "chatUser.notification") ? "bell" : "bell-off";
  }

  get noMessages() {
    return this.chatMessages.length === 0;
  }
}
</script>
