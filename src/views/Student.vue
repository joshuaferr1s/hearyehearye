<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>

<template>
  Student
  <button @click="() => auth.logout()">log out</button>
</template>
