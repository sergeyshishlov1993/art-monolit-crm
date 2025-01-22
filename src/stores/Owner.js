import { defineStore } from "pinia";
import { ref } from "vue";
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
        "http://localhost:8000/owner/create-user",
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
        "http://localhost:8000/owner/create-role-with-permissions",
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
      const response = await axios.get("http://localhost:8000/owner/users");

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
      const response = await axios.get("http://localhost:8000/owner/roles");

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
  async function handleCheckboxChange(permissionKey, row) {
    try {
      const value = row[permissionKey];
      if (row.isCreated) {
        console.log(`Pending: ${permissionKey} = ${value}`);
      } else {
        await axios.put("http://localhost:8000/owner/update-role-permissions", {
          roleId: row.id,
          permissionIds: permissionKey,
          value,
        });

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
    if (row.id) {
      try {
        await axios.delete(`http://localhost:8000/owner/delete-role/${row.id}`);
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
    if (row.id) {
      try {
        await axios.delete(`http://localhost:8000/owner/delete-user/${row.id}`);
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
  async function updateUser(row) {
    try {
      const response = await axios.put(
        `http://localhost:8000/owner/update-user/${row.id}`,
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

  return {
    addRowUser,
    addRowRole,
    columnsUser,
    columnRols,
    createRoleWithPermissions,
    createUserAssignRole,
    formatDate,
    formattedRoles,
    getAllUsers,
    getAllRows,
    handleCheckboxChange,
    handleDeleteRole,
    handleDeleteUser,
    optionsRole,
    rowsUser,
    rowsRole,
    updateUser,
  };
});
