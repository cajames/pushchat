<template>
  <div class="h-screen w-screen flex flex-col">
    <!-- SideNav -->
    <div
      class="sideNav shadow-md flex flex-col justify-start absolute text-white h-screen bg-primary-light w-64"
      :class="{ showNav: showNav }"
    >
      <!-- Nav -->
      <div class="flex justify-between items-center shadow bg-primary-dark p-4">
        <span>Your name</span>
        <button class="text-white" @click="setNav(false)">
          <svgicon name="x" width="25" height="25"></svgicon>
        </button>
      </div>

      <!-- No other users -->
      <div v-if="noUsers" class="flex-1 flex flex-col justify-center items-center">
        <svgicon name="users" height="100" width="100" class="mb-4"></svgicon>
        <span>No active users...</span>
      </div>

      <!-- Other users -->
      <div v-else class="flex-1 flex flex-col items-stretch">
        <!-- Users -->
        <button v-for="user in otherUsers" class="p-4 border-b text-white flex items-center">
          <!-- Logo -->
          <div
            class="mr-4 flex-none flex items-center justify-center bg-primary text-white text-center chatimage"
          >
            <span class="uppercase text-xl">A</span>
          </div>
          <!-- Name -->
          <span class="font-bold truncate">Some Other user</span>
        </button>
      </div>
    </div>

    <!-- Nav -->
    <div class="bg-primary p-4 text-white flex items-center shadow">
      <button class="text-white mr-2" @click="setNav(true)">
        <svgicon name="menu" width="25" height="25"></svgicon>
      </button>
      <span>Pushchat</span>
    </div>

    <!-- v-if: Empty List -->
    <div v-if="noChats" class="flex-1 flex flex-col justify-center items-center text-grey">
      <svgicon name="box" class="mb-4" height="100" width="100"></svgicon>
      <span>No active chats</span>
    </div>

    <!-- v-else: Items List -->
    <div v-else class="flex-1 flex flex-col justify-start items-stretch">
      <!-- Chat Item -->
      <button v-for="item in activeChats" class="p-4 border-b flex items-center">
        <!-- Logo -->
        <div
          class="mr-4 flex-none flex items-center justify-center bg-primary text-white text-center chatimage"
        >
          <span class="uppercase text-xl">A</span>
        </div>
        <!-- Name and text -->
        <div class="flex flex-col text-left w-64">
          <span class="font-bold mb-1">Alexader Smith</span>
          <span
            class="text-grey-dark truncate"
          >Here is some text which is going to be quite long and could me much longer</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ListPage extends Vue {
  activeChats = new Array(3);
  otherUsers = new Array(4);

  showNav = true;

  setNav(show = false) {
    this.showNav = show
  }

  get noChats() {
    return this.activeChats.length === 0;
  }

  get noUsers() {
    return this.otherUsers.length === 0;
  }
}
</script>

<style>
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
