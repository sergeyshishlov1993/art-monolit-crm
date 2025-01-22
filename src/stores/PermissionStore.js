import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePermissionStore = defineStore("permissions", () => {
  const permissions = ref([]);
  const isOwner = ref(false);

  function initializeStore() {
    const storedPermissions = localStorage.getItem("permissions");
    const storedIsOwner = localStorage.getItem("isOwner");

    if (storedPermissions) {
      permissions.value = JSON.parse(storedPermissions);
    }

    if (storedIsOwner) {
      isOwner.value = localStorage.getItem("isOwner");
    }
  }

  function setPermissions(newPermissions) {
    permissions.value = newPermissions;
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
  }

  function clearPermissions() {
    permissions.value = [];
    localStorage.removeItem("permissions");
  }

  const hasPermission = computed(
    () => (permission) => permissions.value.includes(permission)
  );

  return {
    permissions,
    initializeStore,
    setPermissions,
    clearPermissions,
    hasPermission,
    isOwner,
  };
});
