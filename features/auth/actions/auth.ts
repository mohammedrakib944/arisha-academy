import axios from "axios";
import type {
  SignupFormData,
  LoginFormData,
} from "@/features/auth/validations/auth";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signup(data: SignupFormData) {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      // Handle structured error response
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Return first validation error message
        const firstError = errorData.errors[0];
        return {
          success: false,
          error: firstError?.message || errorData.message || "Signup failed",
          errors: errorData.errors,
        };
      }
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          error.message ||
          "Signup failed",
        code: errorData?.code,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Signup failed",
    };
  }
}

export async function login(data: LoginFormData) {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      // Handle structured error response
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Return first validation error message
        const firstError = errorData.errors[0];
        return {
          success: false,
          error: firstError?.message || errorData.message || "Login failed",
          errors: errorData.errors,
        };
      }
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          error.message ||
          "Login failed",
        code: errorData?.code,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function logout() {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Logout failed",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}
