import { defineStore } from "pinia";
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

export const useArrival = defineStore("arrival", () => {
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
      name: "weight",
      align: "left",
      label: "Вес",
      field: "weight",
    },

    {
      name: "defective",
      label: "Брак",
      align: "left",
      field: "defective",
      sortable: true,
    },
    {
      name: "quantity",
      label: "Количество",
      align: "left",
      field: "quantity",
      sortable: true,
    },

    {
      name: "createdAt",
      label: "Дата",
      align: "left",
      field: "createdAt",
      sortable: true,
      format: (val) => formatDate(val),
    },

    {
      name: "delete",
      label: "Действия",
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
  function getCurrentDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  async function clearTableArrival() {
    try {
      const response = await axios.delete(
        `http://localhost:8000/arrival/clear`
      );

      $q.notify({
        message: "Успешно очишена таблицы Материалы",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("ERROR", error);
    }
  }
  async function fetchMaterialsData(search) {
    try {
      const params = {
        search: search,
      };
      const response = await axios.get("http://localhost:8000/arrival", {
        params,
      });

      rows.value = response.data.arrival;

      $q.notify({
        message: "Данные (приход) успешно получены!",
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
  async function handleAdd(item) {
    try {
      const response = await axios.post(
        "http://localhost:8000/arrival/create",
        {
          arrivalData: item,
        }
      );

      $q.notify({
        message: "Успешно cоздано!",
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
        `http://localhost:8000/arrival/update/${row.id}`,
        {
          arrivalData: row,
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
        `http://localhost:8000/arrival/delete/${row.id}`
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

  async function transferDataToWarehouse() {
    try {
      const response = await axios.post(
        `http://localhost:8000/arrival/transfer-to-warehouse`
      );

      $q.notify({
        message: "Успешно внесено в склад",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("ERROR", error);
    }
  }

  return {
    columns,
    rows,
    addRow,
    formatDate,
    getCurrentDate,
    fetchMaterialsData,
    handleAdd,
    handleUpdate,
    handleDelete,
    transferDataToWarehouse,
    clearTableArrival,
  };
});
