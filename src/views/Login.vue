<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

const email = ref(null);
const password = ref(null);
</script>

<template>
  <main class="min-h-full w-screen flex flex-col items-center justify-center bg-gray-100 py-6">
    <div class="flex flex-col bg-white shadow-md mx-2 sm:mx-0 px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-sm">

      <button @click="() => auth.loginG()" :disabled="auth.authenticating" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150 ease-in" :class="auth.authenticating ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'">
        <span class="mr-2 uppercase">Miami Log In</span>
        <span>
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </button>

      <div class="relative flex py-5 items-center">
        <div class="flex-grow border-t border-gray-400"></div>
        <span class="flex-shrink mx-4 text-gray-400">Guest Login</span>
        <div class="flex-grow border-t border-gray-400"></div>
      </div>

      <form @submit.prevent="() => auth.loginEP(email, password)">
        <!-- Email -->
        <label for="email" class="mb-1 text-xs tracking-wide text-gray-600">Email Address</label>
        <div class="relative">
          <div class=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input v-model="email" required type="email" autocomplete="email" id="email" name="email" placeholder="Enter your email" class=" text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400">
        </div>
        <!-- Password -->
        <label for="password" class="mb-1 text-xs tracking-wide text-gray-600">Password</label>
        <div class="relative">
          <div class=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="password" required type="password" autocomplete="current-password" id="password" name="password" placeholder="Enter your password" class=" text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400">
        </div>
        <!-- Log In Button -->
        <div class="mt-3 flex w-full">
          <button :disabled="auth.authenticating" type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150 ease-in" :class="auth.authenticating ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'">
            <span class="mr-2 uppercase">Guest Log In</span>
            <span>
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
