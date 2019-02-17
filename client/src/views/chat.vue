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
        v-for="message in messages"
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
import get from "lodash/get";

@Component
export default class ChatPage extends Vue {
  user = {
    id: "hello",
    name: "Some user",
    notification: false
  };

  messageData = [
    {
      id: "1",
      text: "Here is a message",
      user: "hello",
      time: 11
    },
    {
      id: "2",
      text: "Here is another message",
      user: "something",
      time: 12
    },
    {
      id: "3",
      text: "Here is another message 2",
      user: "hello",
      time: 13
    }
  ];

  get messages() {
    return this.messageData
      .sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
      .map(item => {
        // If other
        if (item.user === this.user.id) {
          item.isSelf = false;
          return item;
        } 
        // If other
        item.isSelf = true;
        return item;
      });
  }

  get userName() {
    return get(this.user, "name", "Loading...");
  }

  get hasNotification() {
    return this.user.notification ? "bell" : "bell-off";
  }

  get noMessages() {
    return this.messages.length === 0;
  }
}
</script>
