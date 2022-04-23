<script setup>
import AppBar from "./components/AppBar.vue";
import AppFooter from "./components/AppFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <app-bar />
    <div class="flex flex-1 items-stretch">
      <router-view></router-view>
    </div>
    <app-footer />
  </div>
</template>
