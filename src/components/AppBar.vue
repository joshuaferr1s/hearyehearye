<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>

<template>
  <nav class="px-4 py-2 flex justify-between items-center mb-6">
    <div>
      <h1 class="text-xl sm:text-3xl text-gray-800">Hear<span class="text-emerald-400">Ye</span>Hear<span class="text-emerald-400">Ye</span></h1>
    </div>
    <div v-if="auth.user">
      <button @click="() => auth.logout()" class="focus:outline-none text-red-600 text-sm py-2 px-5 rounded-full border border-red-600 hover:bg-red-50">Log Out</button>
    </div>
  </nav>
</template>
