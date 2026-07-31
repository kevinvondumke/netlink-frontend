<script setup lang="ts">
import { reactive, watch, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

// COMPONENTS
import SpriteIcon from "./SpriteIcon.vue";

// STYLES
import "../styles/login-layout.css";
import "../styles/login.css";
import "../styles/input.css";
import "../styles/validation.css";

const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
  name: "",
});

const errors = reactive({
  email: "",
  password: "",
  name: "",
  general: "",
});

const showPassword = ref(false);
function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}

// VALIDATION
const emailPattern = /^[a-zA-Z0-9._%+-]+@netlink\.local$/;
const namePattern = /^[A-Za-zÀ-ÿ ]{2,40}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// EMAIL VAL-EYE
watch(
  () => formData.email,
  (value) => {
    value = value.trim().toLowerCase();

    if (!value) {
      errors.email = "* Email is required.";
    } else if (!emailPattern.test(value)) {
      errors.email = "* Email must end with '@netlink.local'.";
    } else {
      errors.email = "";
    }
  },
);

// NAME VAL-EYE
watch(
  () => formData.name,
  (value) => {
    value = value.trim();

    if (!value) {
      errors.name = "* Name is required.";
    } else if (!namePattern.test(value)) {
      errors.name = "* Name must be between 2 and 40 characters long.";
    } else {
      errors.name = "";
    }
  },
);

// PASSWORD VAL-EYE
watch(
  () => formData.password,
  (value) => {
    value = value.trim();

    if (!value) {
      errors.password = "* Password is required.";
    } else if (!passwordPattern.test(value)) {
      errors.password =
        "* Password must include uppercase, lowercase, number, special character";
    } else {
      errors.password = "";
    }
  },
);

async function onSubmit() {
  errors.general = "";

  if (errors.email || errors.password || errors.name) {
    errors.general = "Please fix the errors above before submitting.";
    return;
  }

  try {
    await authStore.register(
      formData.email.trim().toLowerCase(),
      formData.name
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      formData.password.trim(),
    );
    router.push("/login");
  } catch (error) {
    errors.general = "Registration failed. Please try again.";
  }
}
</script>

<template>
  <div class="login-layout">
    <div class="ntl-group">
      <img src="../assets/logos/logo-02.png" alt="Netlink Logo" height="200" />
      <p>
        Sign up and join to our
        <br />
        <span style="color: #006145">networking community</span>
      </p>
    </div>
    <div class="ntl-group ntl-form-container">
      <div class="form-wrapper">
        <div class="ntl-logo">
          <img src="../assets/logos/netlink-logo-06.png" alt="Netlink Logo" height="100px">
        </div>        
        <h2>Get Started on Netlink</h2>
        <div class="form-base">
          <form @submit.prevent="onSubmit()" method="post" id="loginForm">
            <div class="formGroup">
              <input
                type="email"
                id="net-email"
                placeholder="Email"
                autocomplete="email"
                v-model="formData.email"
              />
              <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
            </div>

            <div class="formGroup">
              <input
                type="text"
                id="net-name"
                placeholder="Full Name"
                autocomplete="name"
                v-model="formData.name"
              />
              <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
            </div>

            <div class="formGroup password-field">
              <div class="passwordGroup">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="net-password"
                  placeholder="Password"
                  autocomplete="current-password"
                  v-model="formData.password"
                />
                <button
                  type="button"
                  class="icon-btn"
                  @click="toggleShowPassword"
                  :aria-pressed="showPassword"
                  aria-label="Toggle password visibility"
                >
                  <SpriteIcon
                    :name="showPassword ? 'visibility' : 'visibilityoff'"
                    size="22"
                    :title="showPassword ? 'visibilityoff' : 'visibility'"
                  />
                </button>
              </div>
              <p v-if="errors.password" class="form-error">
                {{ errors.password }}
              </p>
            </div>

            <div v-if="errors.general" class="formValidation">
              <p class="form-error">
                {{ errors.general }}
              </p>
            </div>

            <button
              type="submit"
              class="submit-btn button"
              :class="{
                disabled:
                  !formData.email.length ||
                  !formData.name.length ||
                  !formData.password.length,
                'animated-btn':
                  formData.email.length &&
                  formData.name.length &&
                  formData.password.length,
              }"
              :disabled="
                !formData.email.length ||
                !formData.name.length ||
                !formData.password.length
              "
            >
              Sign Up
            </button>
          </form>
          <router-link :to="{ name: 'login' }">
            <button
              type="button"
              class="submit-btn opt-btn button"
              id="regAccount"
            >
              Already have an account?
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#regAccount {
  margin-top: 1rem !important;
  font-family: "Montserrat Regular", sans-serif;
  border: 1px solid #ffffff;
}
</style>
