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
      <h2 class="text-lg tracking-wide text-center mb-6">Thank you for being a Judge for the Spring 2022 FYIC Client Challenge!</h2>
      <form @submit.prevent="() => auth.selectTeam(selTeam)" class="space-y-6">
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
  <main v-else-if="auth.judging" class="w-screen flex flex-col items-center justify-center px-2">
    <div class="text-center mb-4">
      <h1 class="text-md font-medium">Juding Team: {{ selTeam }}</h1>
      <p class="text-xs">{{ auth.team.members.join(", ") }}</p>
    </div>
    <form @submit.prevent="() => auth.submitTeamFeedback()" class="space-y-4">
      <div class="flex flex-row flex-wrap gap-4">
        <div class="max-w-sm">
          <p class="font-medium">Addressed the challenge</p>
          <p class="text-xs italic">If Key clients were to self-service more in digital channels (vs. calling or going to branches to conduct banking activity), how might this impact NPS and what might we do differently to drive the highest levels of NPS across all channels?</p>
        </div>
        <div class="grid grid-cols-5 rounded-full ml-auto">
          <button v-for="n in 5" @click="() => auth.judging.q1 = n" type="button" class="block cursor-pointer select-none rounded-xl text-center w-10 h-10" :class="auth.judging.q1 == n ? 'bg-blue-500 font-bold text-white' : ''">
            {{ n }}
          </button>
        </div>
      </div>

      <div class="flex flex-row flex-wrap gap-4">
        <div class="max-w-sm">
          <p class="font-medium">Developed a Compelling Argument</p>
          <p class="text-xs italic">Did the team provide a convincing argument?<br />Did the team provide evidence to support and build their argument?</p>
        </div>
        <div class="grid grid-cols-5 rounded-full ml-auto">
          <button v-for="n in 5" @click="() => auth.judging.q2 = n" type="button" class="block cursor-pointer select-none rounded-xl text-center w-10 h-10" :class="auth.judging.q2 == n ? 'bg-blue-500 font-bold text-white' : ''">
            {{ n }}
          </button>
        </div>
      </div>

      <div class="flex flex-row flex-wrap gap-4 w-full">
        <div class="max-w-sm">
          <p class="font-medium">Delivered a Professional Presentation</p>
          <p class="text-xs italic">Did the team engage the audience?<br />Did the team deliver a professional presentation?<br />Did the team develop a compelling slide design?</p>
        </div>
        <div class="grid grid-cols-5 rounded-full ml-auto">
          <button v-for="n in 5" @click="() => auth.judging.q3 = n" type="button" class="block cursor-pointer select-none rounded-xl text-center w-10 h-10" :class="auth.judging.q3 == n ? 'bg-blue-500 font-bold text-white' : ''">
            {{ n }}
          </button>
        </div>
      </div>

      <div class="flex flex-row flex-wrap gap-4">
        <div class="max-w-sm">
          <p class="font-medium">Compelling Solution / Idea</p>
          <p class="text-xs italic">How well did the team excite / move / convince you of their problem and solution? <br />New insights (based on what we saw last semester) <br />Did the team develop a solution with a “wow-factor”?  <br />Is there a novelty aspect to the team's idea? <br />What is the likelihood that KeyBank will find financial value from the proposed solution? <br />Did the team address feasibility in a way that shows potential? <br />Is this a team KeyBank would like to see present their solution?</p>
        </div>
        <div class="grid grid-cols-5 rounded-full ml-auto">
          <button v-for="n in 5" @click="() => auth.judging.q4 = n" type="button" class="block cursor-pointer select-none rounded-xl text-center w-10 h-10" :class="auth.judging.q4 == n ? 'bg-blue-500 font-bold text-white' : ''">
            {{ n }}
          </button>
        </div>
      </div>

      <div>
        <label for="comments" class="text-xs tracking-wide text-gray-600">Comments for the team</label>
        <textarea v-model="auth.judging.comments" name="comments" id="comments" rows="6" class="w-full resize-none rounded-xl"></textarea>
      </div>

      <button :disabled="auth.loading" type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base rounded-2xl py-2 w-full transition duration-150 ease-in" :class="auth.loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'">
        <span class="mr-2 uppercase">Submit Feedback</span>
        <span>
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </button>
    </form>
  </main>
</template>