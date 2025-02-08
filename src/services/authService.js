import axios from "axios";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useUserStore } from "@/stores/User";

export async function login(name, password) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || process.env.VITE_API_URL}/auth/login`,
      {
        name,
        password,
      }
    );

    const { accessToken, permissions, refreshToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("permissions", JSON.stringify(permissions));
    localStorage.setItem("isOwner", user.isOwner);
    localStorage.setItem("user", JSON.stringify(user));

    const userStore = useUserStore();
    userStore.user = user;

    const permissionStore = usePermissionStore();
    permissionStore.setPermissions(permissions);
    permissionStore.isOwner = user.isOwner;

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export async function logout() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || process.env.VITE_API_URL}/auth/logout`,
      {
        accessToken,
        refreshToken,
      }
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken", refreshToken);
    localStorage.removeItem("permissions");
    localStorage.removeItem("isOwner");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("ERROR LOGOUT", error);
  }
}

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axios.post("/api/refresh", { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}
