<template>
  <div class="flex flex-col h-screen justify-center bg-primary">
    <!-- Icon -->
    <div class="flex items-center justify-center p-8 text-primary-darker">
      <svgicon :fill="true" color="#2f365f white" name="messenger" width="130" height="130"></svgicon>
    </div>
    <!-- Input -->
    <div class="p-8 flex flex-col justify-center">
      <input
        type="text"
        class="p-4 mb-4 text-center bg-primary-lightest"
        placeholder="Enter a username"
        v-model="userName"
      >
      <button
        class="p-4 shadow bg-primary-darker uppercase font-bold tracking-wide rounded text-white"
        @click="register"
      >Register</button>
    </div>

    <!-- Button -->
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const UserStore = namespace("user");

@Component
export default class RegisterPage extends Vue {
  @UserStore.Action
  registerUser;

  userName = null;

  register() {
    if (!this.userName) {
      return;
    }

    this.registerUser(this.userName);
  }
}
</script>
