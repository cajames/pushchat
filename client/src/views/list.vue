<template>
  <div class="h-screen w-screen flex flex-col">
    <!-- SideNav -->
    <div
      class="sideNav z-10 shadow-md flex flex-col justify-start absolute text-white h-screen bg-primary-light w-64"
      :class="{ showNav: showNav }"
    >
      <!-- sidenav Nav -->
      <div class="flex justify-between items-center shadow bg-primary-dark p-4">
        <span>{{ currentUser.id }}</span>
        <button class="text-white" @click="setNav(false)">
          <svgicon name="x" width="25" height="25"></svgicon>
        </button>
      </div>

      <!-- No other users -->
      <div v-if="noOtherUsers" class="flex-1 flex flex-col justify-center items-center">
        <svgicon name="users" height="100" width="100" class="mb-4"></svgicon>
        <span>No active users...</span>
      </div>

      <!-- Other users -->
      <div v-else class="flex-1 flex flex-col items-stretch">
        <!-- Users -->
        <router-link
          :to="`/chat/${member.id}`"
          :key="member.id"
          v-for="member in otherMembers"
          class="p-4 no-underline border-b text-white flex items-center"
        >
          <!-- Logo -->
          <div
            class="mr-4 flex-none flex items-center justify-center bg-primary text-white text-center chatimage"
          >
            <span class="uppercase text-xl">{{member.id.slice(0,1)}}</span>
          </div>
          <!-- Name -->
          <span class="font-bold truncate">{{member.id}}</span>
        </router-link>
      </div>
    </div>

    <!-- Nav -->
    <div class="bg-primary absolute w-full p-4 text-white flex items-center justify-between shadow">
      <div class="flex items-center">
        <button class="text-white mr-2" @click="setNav(true)">
          <svgicon name="menu" width="25" height="25"></svgicon>
        </button>
        <span>Pushchat</span>
      </div>
      <button class="text-white" @click="logout">
        <svgicon name="log-out" width="25" height="25"></svgicon>
      </button>
    </div>

    <!-- v-if: Empty List -->
    <div v-if="noChats" class="pt-16 flex-1 flex flex-col justify-center items-center text-grey">
      <svgicon name="box" class="mb-4" height="100" width="100"></svgicon>
      <span>No active chats</span>
    </div>

    <!-- v-else: Items List -->
    <div v-else class="flex-1 flex pt-16 flex-col justify-start items-stretch">
      <!-- Chat Item -->
      <router-link
        :to="`/chat/${chat.user}`"
        :key="chat.user"
        v-for="chat in activeChats"
        class="p-4 no-underline border-b flex items-center"
      >
        <!-- Logo -->
        <div
          class="mr-4 flex-none flex items-center justify-center bg-primary text-white text-center chatimage"
        >
          <span class="uppercase text-xl">{{chat.user.slice(0, 1)}}</span>
        </div>
        <!-- Name and text -->
        <div class="flex flex-col text-left w-64">
          <span class="font-bold text-black mb-1">{{chat.user}}</span>
          <span
            class="text-grey-dark truncate"
          >{{chat.text}}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const UserStore = namespace("user");

@Component
export default class ListPage extends Vue {
  @UserStore.Action
  getAllUsers;
  @UserStore.Action
  getAllUserChats;
  @UserStore.Action
  logout;
  @UserStore.Action
  startPollingUser;
  @UserStore.Action
  endPollingUser;
  @UserStore.Getter
  otherMembers;
  @UserStore.Getter
  activeChats;
  @UserStore.State
  currentUser;

  showNav = false;

  async created() {
    await this.getAllUsers()
    await this.getAllUserChats()
    this.startPollingUser()
  }

  beforeDestroy() {
    this.endPollingUser()
  }

  setNav(show = false) {
    this.showNav = show;
  }

  get noChats() {
    return this.activeChats.length === 0;
  }

  get noOtherUsers() {
    return this.otherMembers.length === 0;
  }
}
</script>

<style scoped>
.chatimage {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.sideNav {
  transition: 200ms transform cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);
}
.showNav {
  transform: translateX(0);
}
</style>
