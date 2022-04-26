<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const selTeam = ref("");
const teams = [
  "A1", "A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10", "A11",
  "B1", "B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10", "B11",
  "C1", "C2", "C3", "C4", "C5", "C7", "C8", "C9", "C10", "C11",
  "D1", "D2", "D3", "D4", "D5", "D7", "D8", "D9", "D10", "D11",
  "E1", "E2", "E3", "E4", "E5", "E7", "E8", "E9", "E10", "E11",
  "F1", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "F10", "F11",
  "G1", "G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10", "G11",
  "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11",
  "I1", "I2", "I3", "I4", "I5", "I7", "I8", "I9", "I10", "I11",
  "J1", "J2", "J3", "J4", "J5", "J7", "J8", "J9", "J10", "J11",
  "K1", "K2", "K3", "K4", "K5", "K7", "K8", "K9", "K10", "K11",
];
</script>

<template>
  <main v-if="!auth.team" class="w-screen flex flex-col items-center justify-center">
    <!-- Select which team to judge -->
    <div class="bg-white shadow-md mx-2 px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-sm">
      <h2 class="text-lg tracking-wide text-center mb-6">Thank you for being an Instructor for the Spring 2022 Semester!</h2>
      <form @submit.prevent="() => auth.getTeamFeedback(selTeam)" class="space-y-6">
        <div>
          <label for="team" class="block text-sm font-medium text-gray-700">Team</label>
          <div class="mt-1">
            <select v-model="selTeam" name="team" id="team" required class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" :disabled="auth.loading">
              <option value="">Please select</option>
              <option v-for="t in teams" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>
        <button :disabled="auth.loading" type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150 ease-in" :class="auth.loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'">
          <span class="mr-2 uppercase">Select Team</span>
          <span>
            <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  </main>
  <main v-else-if="auth.feedback" class="w-screen flex flex-col items-center justify-center px-2">
    <div class="text-center mb-4">
      <h1 class="text-md font-medium">Team: {{ selTeam }}</h1>
      <p class="text-xs">{{ auth.team.members.join(", ") }}</p>
    </div>
    <table class="mb-4 table-auto">
      <thead class="border-b">
        <tr>
          <td></td>
          <td class="px-2 font-medium" v-for="fb in auth.feedback">{{ fb.judge }}</td>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <td class="font-medium border-r py-1 px-2">Addressed the challenge</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q1 }}</td>
        </tr>
        <tr class="border-b">
          <td class="font-medium border-r py-1 px-2">Developed a Compelling Argument</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q2 }}</td>
        </tr>
        <tr class="border-b">
          <td class="font-medium border-r py-1 px-2">Delivered a Professional Presentation</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q3 }}</td>
        </tr>
        <tr>
          <td class="font-medium border-r py-1 px-2">Compelling Solution / Idea</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q4 }}</td>
        </tr>
      </tbody>
    </table>

    <div class="w-full lg:max-w-lg">
      <hr class="my-2">
      <h2 class="text-xl mb-2">Comments</h2>
      <div v-for="fb in auth.feedback" class="mb-4">
        <blockquote v-if="fb.comments != ''" class="relative p-4 text-lg italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote">
          <p className="mb-4">"{{ fb.comments }}"</p>
          <cite className="flex items-center">
            <div className="flex flex-col items-start">
              <span className="mb-1 text-sm italic font-bold">{{ fb.judge }}</span>
            </div>
          </cite>
        </blockquote>
      </div>
    </div>
    <button @click="() => auth.resetSelection()" :disabled="auth.loading" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full max-w-sm transition duration-150 ease-in uppercase" :class="auth.loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'">
      Select Another Team
    </button>
  </main>
  <main v-else class="w-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl">👀 Nothing here yet for team {{ auth.user.team }}</h1>
    <button @click="() => auth.resetSelection()" :disabled="auth.loading" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150 ease-in uppercase" :class="auth.loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'">
      Select Another Team
    </button>
  </main>
</template>
