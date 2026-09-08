import { defineStore } from "pinia";
import api from "../services/api";
import { ref } from "@vue/runtime-dom";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: (() => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return null;

      try {
        return JSON.parse(rawUser) as {
          id?: number | string;
          name?: string;
          username?: string;
          avatarUrl?: string;
          email?: string;
        };
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    })(),
    isNavOpen: ref(false),
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      this.user = res.data.user;

      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    async register(email: string, name: string, password: string) {
      await api.post("/auth/register", { email, name, password });
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        console.error("Logout request failed: ", err);
      } finally {
        this.user = null;
        localStorage.removeItem("user");
      }
    },

    isAuthenticated() {
      if (this.user) {
        return true;
      } else {
        return false;
      }
    },
  },
});
