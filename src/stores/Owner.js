import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export const useOwner = defineStore("owner", () => {
  const $q = useQuasar();
  const columnsUser = ref([
    {
      name: "accountNumber",
      required: true,
      label: "Номер",
      align: "left",
      field: "accountNumber",
      sortable: true,
      style: "width: 50px",
    },
    {
      name: "name",
      align: "left",
      label: "Имя пользователя",
      field: "name",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "password",
      align: "left",
      label: "Пароль",
      field: "password",
      style: "width: 50px",
    },

    {
      name: "address",
      align: "left",
      label: "Адрес",
      field: "address",
      style: "width: 100px",
    },

    {
      name: "role",
      align: "left",
      label: "Роль",
      field: "role",
      style: "width: 100px",
    },

    {
      name: "createdAt",
      label: "Дата",
      align: "left",
      field: "createdAt",
      field: (row) => new Date(row.createdAt).getTime(),
      sortable: true,
      format: (val) => formatDate(val),
      style: "width: 100px",
    },

    {
      name: "delete",
      label: "Действия",
      align: "left",
      field: "delete",
      style: "width: 50px",
    },
  ]);
  const columnRols = ref([
    {
      name: "accountNumber",
      required: true,
      label: "Номер",
      align: "left",
      field: "accountNumber",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "name",
      align: "left",
      label: "Роль",
      field: "name",
      sortable: true,
      style: "width: 100px",
    },

    {
      name: "arrival",
      align: "left",
      label: "Приход",
      field: "arrival",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "calculation",
      align: "left",
      label: "Просчет",
      field: "calculation",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "orders",
      align: "left",
      label: "Заказы",
      field: "orders",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "can_write_orders",
      align: "left",
      label: "Может вносить заказы",
      field: "can_write_orders",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "defective",
      align: "left",
      label: "Брак",
      field: "defective",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "materials",
      align: "left",
      label: "Расходники",
      field: "materials",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "warehouse",
      align: "left",
      label: "Склад",
      field: "warehouse",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "createdAt",
      label: "Дата",
      align: "left",
      field: "createdAt",
      field: (row) => new Date(row.createdAt).getTime(),
      sortable: true,
      format: (val) => formatDate(val),
      style: "width: 100px",
    },

    {
      name: "delete",
      label: "Действия",
      align: "left",
      field: "delete",
      style: "width: 50px",
    },
  ]);
  const columnStores = ref([
    {
      name: "accountNumber",
      required: true,
      label: "Номер",
      align: "left",
      field: "accountNumber",
      sortable: true,
      style: "width: 50px",
    },
    {
      name: "name",
      align: "left",
      label: "Адрес магазина",
      field: "name",
      sortable: true,
      style: "width: 50px",
    },

    {
      name: "createdAt",
      label: "Дата",
      align: "left",
      field: "createdAt",
      field: (row) => new Date(row.createdAt).getTime(),
      sortable: true,
      format: (val) => formatDate(val),
      style: "width: 100px",
    },

    {
      name: "delete",
      label: "Действия",
      align: "left",
      field: "delete",
      style: "width: 50px",
    },
  ]);
  const rowsUser = ref([]);
  const rowsRole = ref([]);
  const rowsStores = ref([]);
  const formattedRoles = rowsRole.value.map((role) => {
    const permissions = role.permissions.reduce((acc, perm) => {
      acc[perm.key] = true;
      return acc;
    }, {});

    return {
      id: role.id,
      name: role.name,
      ...permissions,
    };
  });
  const optionsRole = ref([]);

  const storeOptions = computed(() => [
    { id: null, name: "Все магазины" },
    ...rowsStores.value.map((store) => ({
      id: store.id,
      name: store.name,
    })),
  ]);

  function addRowRole() {
    rowsRole.value.push({
      id: crypto.randomUUID(),
      accountNumber: rowsRole.value.length + 1,
      role: "",
      arrival: "",
      calculation: "",
      orders: "",
      defective: "",
      materials: "",
      warehouse: "",
      createdAt: new Date(),
      isCreated: true,
      isChanged: false,
    });
  }
  function addRowUser() {
    rowsUser.value.push({
      id: crypto.randomUUID(),
      accountNumber: rowsUser.value.length + 1,
      name: "",
      password: "",
      address: "",
      role: "",
      createdAt: new Date(),
      isCreated: true,
      isChanged: false,
    });
  }
  function addRowStores() {
    rowsStores.value.push({
      id: crypto.randomUUID(),
      accountNumber: rowsStores.value.length + 1,
      name: "",
      createdAt: new Date(),
      isCreated: true,
      isChanged: false,
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  async function createUserAssignRole(row) {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/create-user`,
        {
          name: row.name,
          password: row.password,
          roleId: row.selectedRoleId,
          address: row.address,
        }
      );

      $q.notify({
        message: "Пользователь создан !",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      const idx = rowsUser.value.findIndex((el) => el.id === row.id);
      rowsUser.value[idx].isCreated = false;
      rowsUser.value[idx].isChanged = false;

      return response.data;
    } catch (err) {
      console.error("Error creating role:", err);
      error.value = err.response?.data?.error || "Unknown error occurred";

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function createRoleWithPermissions(row, permissionIds) {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/create-role-with-permissions`,
        {
          name: row.name,
          permissionIds,
        }
      );

      $q.notify({
        message: "Роль успешно создана !",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      const idx = rowsRole.value.findIndex((el) => el.id === row.id);
      rowsRole.value[idx].isCreated = false;
      rowsRole.value[idx].isChanged = false;

      return response.data;
    } catch (err) {
      console.error("Error creating role:", err);
      error.value = err.response?.data?.error || "Unknown error occurred";

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function createStore(row) {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/create-store`,
        {
          name: row.name,
        }
      );

      $q.notify({
        message: "Магазин добавлен!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      const idx = rowsStores.value.findIndex((el) => el.id === row.id);
      rowsStores.value[idx].isCreated = false;
      rowsStores.value[idx].isChanged = false;

      return response.data;
    } catch (err) {
      console.error("Error creating role:", err);
      error.value = err.response?.data?.error || "Unknown error occurred";

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function getAllUsers() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/users`
      );

      rowsUser.value = response.data;

      $q.notify({
        message: "Пользователи получины!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("error", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  async function getAllRows() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/roles`
      );

      rowsRole.value = response.data.map((role) => {
        const permissions = role.permissions.reduce((acc, perm) => {
          acc[perm.key] = true;
          return acc;
        }, {});

        const isRoleExists = optionsRole.value.some(
          (optRole) => optRole.id === role.id
        );
        if (!isRoleExists) {
          optionsRole.value.push(role);
        }

        return {
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          ...permissions,
        };
      });

      $q.notify({
        message: "Роли получены!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("error", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  async function getAllStores() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/stores`
      );

      rowsStores.value = response.data.stores;

      console.log(rowsStores.value);

      $q.notify({
        message: "Список магазинов получины!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("error", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  async function handleCheckboxChange(permissionKey, row) {
    try {
      const value = row[permissionKey];
      if (row.isCreated) {
        console.log(`Pending: ${permissionKey} = ${value}`);
      } else {
        await axios.put(
          `${
            import.meta.env.VITE_API_URL || process.env.VITE_API_URL
          }/owner/update-role-permissions`,
          {
            roleId: row.id,
            permissionIds: permissionKey,
            value,
          }
        );

        $q.notify({
          message: "Роль успешно изменина !",
          color: "positive",
          icon: "check_circle",
          position: "top-right",
          timeout: 2500,
        });
      }
    } catch (error) {
      console.error("Error updating permission:", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function handleDeleteRole(row) {
    if (row.id && !row.isCreated) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL || process.env.VITE_API_URL
          }/owner/delete-role/${row.id}`
        );
        rowsRole.value = rowsRole.value.filter((r) => r.id !== row.id);

        $q.notify({
          message: "Удалено !",
          color: "positive",
          icon: "check_circle",
          position: "top-right",
          timeout: 2500,
        });
      } catch (error) {
        console.error("Error deleting role:", error);

        $q.notify({
          message: `Ошибка: ${error.response?.data?.message || error.message}`,
          color: "negative",
          icon: "error",
          timeout: 3000,
        });
      }
    } else {
      rowsRole.value = rowsRole.value.filter((r) => r !== row);
    }
  }
  async function handleDeleteUser(row) {
    if (row.id && !row.isCreated) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL || process.env.VITE_API_URL
          }/owner/delete-user/${row.id}`
        );
        rowsUser.value = rowsUser.value.filter((r) => r.id !== row.id);
        $q.notify({
          message: "Удалено !",
          color: "positive",
          icon: "check_circle",
          position: "top-right",
          timeout: 2500,
        });
      } catch (error) {
        console.error("Error deleting role:", error);

        $q.notify({
          message: `Ошибка: ${error.response?.data?.message || error.message}`,
          color: "negative",
          icon: "error",
          timeout: 3000,
        });
      }
    } else {
      rowsUser.value = rowsUser.value.filter((r) => r !== row);
    }
  }

  async function handleDeleteStores(row) {
    if (row.id && !row.isCreated) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL || process.env.VITE_API_URL
          }/owner/delete-store/${row.id}`
        );
        rowsStores.value = rowsStores.value.filter((r) => r.id !== row.id);
        $q.notify({
          message: "Удалено !",
          color: "positive",
          icon: "check_circle",
          position: "top-right",
          timeout: 2500,
        });
      } catch (error) {
        console.error("Error deleting role:", error);

        $q.notify({
          message: `Ошибка: ${error.response?.data?.message || error.message}`,
          color: "negative",
          icon: "error",
          timeout: 3000,
        });
      }
    } else {
      rowsStores.value = rowsStores.value.filter((r) => r !== row);
    }
  }
  async function updateUser(row) {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/update-user/${row.id}`,
        {
          name: row.name,
          password: row.password + "",
          roleId: row.selectedRoleId,
          address: row.address,
        }
      );

      $q.notify({
        message: "Пользователь обновлен !",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      return response.data;
    } catch (err) {
      console.error("Error creating role:", err);
      error.value = err.response?.data?.error || "Unknown error occurred";

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  async function updateStore(row) {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/owner/update-store/${row.id}`,
        {
          name: row.name,
        }
      );

      $q.notify({
        message: "Адрес магазина обновлен !",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      return response.data;
    } catch (err) {
      console.error("Error creating role:", err);
      error.value = err.response?.data?.error || "Unknown error occurred";

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  return {
    addRowUser,
    addRowRole,
    addRowStores,
    columnsUser,
    columnRols,
    columnStores,
    createRoleWithPermissions,
    createUserAssignRole,
    createStore,
    formatDate,
    formattedRoles,
    getAllUsers,
    getAllRows,
    getAllStores,
    handleCheckboxChange,
    handleDeleteRole,
    handleDeleteStores,
    handleDeleteUser,
    optionsRole,
    rowsUser,
    rowsRole,
    rowsStores,
    updateUser,
    updateStore,
    storeOptions,
  };
});
