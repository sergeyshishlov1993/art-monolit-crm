import axios from "axios";
import { usePermissionStore } from "@/stores/PermissionStore";

export async function login(name, password) {
  try {
    const response = await axios.post("http://localhost:8000/auth/login", {
      name,
      password,
    });

    const { accessToken, permissions, refreshToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("permissions", JSON.stringify(permissions));
    localStorage.setItem("isOwner", user.isOwner);

    const permissionStore = usePermissionStore();
    permissionStore.setPermissions(permissions);
    permissionStore.isOwner = user.isOwner;

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Функція для отримання токену
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

// Функція для виходу
export async function logout() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  try {
    const response = await axios.post("http://localhost:8000/auth/logout", {
      accessToken,
      refreshToken,
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken", refreshToken);
    localStorage.removeItem("permissions");
    localStorage.removeItem("isOwner");
  } catch (error) {
    console.error("ERROR LOGOUT", error);
  }
}

// Функція для оновлення токену
export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post("/api/refresh", { refreshToken });
    const { accessToken } = response.data;

    // Оновлюємо токен у LocalStorage
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}
