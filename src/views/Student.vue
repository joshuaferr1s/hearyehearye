<script setup>
import { useAuthStore } from "../stores/auth";
import AppBar from "../components/AppBar.vue";

const auth = useAuthStore();
</script>

<template>
  <app-bar />
  <main>
    Student
  </main>
</template>
