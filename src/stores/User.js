import { defineStore } from "pinia";
import { ref, onMounted } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  function loadUserFromStorage() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error("Ошибка при загрузке пользователя:", error);
      }
    }
  }

  onMounted(() => {
    loadUserFromStorage();
  });

  return { user, loadUserFromStorage };
});
