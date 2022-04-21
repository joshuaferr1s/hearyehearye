import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: () => import("../views/Login.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/student",
      name: "Student",
      component: () => import("../views/Student.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: () => import("../views/Unauthorized.vue"),
      meta: {
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach((to, _) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    return { name: "Login" };
  } else if (!to.meta.requiresAuth && auth.user) {
    if (auth.user.type == "student") {
      return { name: "Student" };
    } else if (auth.user.type == "instructor") {
      return { name: "Instructor" };
    } else {
      return { name: "Judge" };
    }
  } else if (to.requiresAuth && to.name != "Unauthorized" && auth.unauthorized) {
    return { name: "Unauthorized" };
  }
});

export default router;
