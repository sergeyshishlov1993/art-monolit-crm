import { defineStore } from "pinia";
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export const useWarehouse = defineStore("warehouse", () => {
  const $q = useQuasar();
  const columns = ref([
    {
      name: "accountNumber",
      required: true,
      label: "Номер",
      align: "left",
      field: "accountNumber",
      sortable: true,
    },
    {
      name: "name",
      align: "left",
      label: "Название",
      field: "name",
      sortable: true,
    },
    {
      name: "length",
      align: "left",
      label: "Длина",
      field: "length",
      sortable: true,
    },
    { name: "width", align: "left", label: "Ширина", field: "width" },
    {
      name: "thickness",
      align: "left",
      label: "Толщина",
      field: "thickness",
    },
    { name: "priceM2", align: "left", label: "Цена м2", field: "priceM2" },

    {
      name: "price",
      label: "Цена детали",
      align: "left",
      field: "price",
    },
    {
      name: "earnings",
      label: "Заработок %",
      align: "left",
      field: "earnings",
    },
    {
      name: "weight",
      align: "left",
      label: "Вес",
      field: "weight",
    },
    {
      name: "quantity",
      label: "Количество",
      align: "left",
      field: "quantity",
      sortable: true,
    },

    {
      name: "defective",
      label: "Брак",
      align: "left",
      field: "defective",
      sortable: true,
    },

    {
      name: "createdAt",
      label: "Дата",
      align: "left",
      field: "createdAt",
      field: (row) => new Date(row.createdAt).getTime(),
      sortable: true,
      format: (val) => formatDate(val),
    },

    {
      name: "delete",
      label: "Действие",
      align: "left",
      field: "delete",
      sortable: true,
    },
  ]);

  const rows = ref([]);

  function addRow() {
    rows.value.push({
      id: crypto.randomUUID(),
      accountNumber: rows.value.length + 1,
      name: "",
      length: "",
      width: "",
      thickness: "",
      priceM2: "",
      price: "",
      weight: "",
      count: "",
      defective: 0,
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

  async function handleAdd(item) {
    const idx = rows.value.findIndex((el) => el.id === item.id);
    rows.value[idx].isCreated = false;
    rows.value[idx].isChanged = false;

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/warehouse/create`,
        {
          item,
        }
      );

      $q.notify({
        message: `Успешно добавлен в склад ${item.name} ${item.length}X${item.width}X${item.thickness}!`,
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
  async function handleUpdate(row) {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/warehouse/update/${row.id}`,
        {
          item: row,
        }
      );
      console.log("Обновление строки", response);
      row.isChanged = false;

      $q.notify({
        message: "Успешно изменено!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("Ошибка обновления строки:", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function handleDelete(row) {
    const index = rows.value.findIndex((item) => item.id === row.id);

    if (index !== -1) {
      rows.value.splice(index, 1);
    }
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL || process.env.VITE_API_URL
        }/warehouse/delete/${row.id}`
      );

      $q.notify({
        message: `Позиция ${row.name} ${row.length}X${row.width}X${row.thickness} удалена!`,
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("Ошибка удаления:", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function getWarehouseData(search) {
    try {
      const params = {
        search: search,
      };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || process.env.VITE_API_URL}/warehouse`,
        {
          params,
        }
      );

      rows.value = response.data.warehouse;

      $q.notify({
        message: "Данные (склад) успешно получены!",
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

  return {
    columns,
    rows,
    addRow,
    getWarehouseData,
    formatDate,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
});
