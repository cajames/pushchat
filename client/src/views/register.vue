<template>
  <div class="container mx-auto flex flex-col h-screen justify-center bg-primary">
    <!-- Icon -->
    <div class="flex items-center justify-center p-8">
      <svgicon :original="true" color="indigo" name="smartphone" width="100" height="100"></svgicon>
    </div>
    <!-- Input -->
    <div class="p-8 flex flex-col justify-center">
      <input
        type="text"
        class="p-4 mb-4 text-center bg-primary-lightest"
        placeholder="Enter a username"
      >
      <button class="p-4 shadow bg-primary-dark uppercase font-bold tracking-wide rounded text-white">
        Register
      </button>
    </div>

    <!-- Button -->
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RegisterPage extends Vue {}
</script>
