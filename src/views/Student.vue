<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

onMounted(async () => {
  await auth.getTeamFeedback(auth.user.team);
});
</script>

<template>
  <main v-if="auth.loading" class="w-screen flex flex-col items-center justify-center">

  </main>
  <main v-else-if="!auth.feedback || auth.feedback.length == 0" class="w-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl">👀 Nothing here yet {{ auth.user.team }}</h1>
    <p class="text-sm">Check back after your presentation</p>
  </main>
  <main v-else class="w-screen flex flex-col items-center justify-center px-4 overflow-x-scroll">
    <div class="text-center mb-4">
      <h1 class="text-md font-medium">Here is your feedback team {{ auth.user.team }}</h1>
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
          <td class="font-medium border-r py-1 px-2">Question 1</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q1 }}</td>
        </tr>
        <tr class="border-b">
          <td class="font-medium border-r py-1 px-2">Question 2</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q2 }}</td>
        </tr>
        <tr class="border-b">
          <td class="font-medium border-r py-1 px-2">Question 3</td>
          <td class="text-center" v-for="fb in auth.feedback">{{ fb.q3 }}</td>
        </tr>
        <tr>
          <td class="font-medium border-r py-1 px-2">Question 4</td>
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
  </main>
</template>
