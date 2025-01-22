import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";

import axios from "axios";

export const usePreOrders = defineStore("preOrders", () => {
  const $q = useQuasar();
  const columns = [
    {
      name: "accountNumber",
      required: true,
      label: "Номер Заказа",
      align: "rigth",
      field: "accountNumber",
      sortable: true,
    },
    {
      name: "first_name",
      align: "left",
      label: "Имя",
      field: "first_name",
      sortable: true,
    },
    {
      name: "second_name",
      align: "left",
      label: "Фамилия",
      field: "second_name",
      sortable: true,
    },
    { name: "phone", align: "left", label: "Телефон", field: "phone" },
    { name: "name", align: "left", label: "Названия Заказа", field: "name" },

    {
      name: "totalPrice",
      align: "left",
      label: "Общая сумма",
      field: "totalPrice",
    },

    {
      name: "source",
      label: "Источник",
      align: "left",
      field: "source",
    },

    {
      name: "store",
      label: "Магазин",
      align: "left",
      field: "store",
    },

    {
      name: "move",
      align: "center",
      label: "Переместить",
      field: "move",
    },

    {
      name: "isDraft",
      label: "Статус расчёта",
      align: "center",
      field: "isDraft",
    },

    {
      name: "action",
      align: "center",
      label: "Удалить",
      field: "action",
    },
    {
      name: "date",
      label: "Дата",
      align: "left",
      field: "createdAt",
      sortable: true,
      format: (val) => formatDate(val),
    },
  ];
  const movedPreOrders = ref({});
  const rows = ref([]);

  function addRow() {
    rows.value.push({
      id: crypto.randomUUID(),
      firs_name: "",
      second_name: "",
      phone: "",
      name: "",
      prepayment: 0,
      pay: 0,
      totalPrice: 0,
      source: "fb",
      store: "КС",
      action: "",
      date: getCurrentDate(),
    });
  }
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  function getCurrentDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  function movingPreOrderToOrder(preOrder) {
    movedPreOrders.value = preOrder;
  }

  async function getPreOrders(status, startDate, endDate, search) {
    try {
      const params = {
        startDate: startDate,
        endDate: endDate,
        search: search,
        status: status,
      };

      const orders = await axios.get("http://localhost:8000/pre-orders", {
        params,
      });

      rows.value = orders.data.orders;

      console.log("RESPONSE STORE", orders);

      $q.notify({
        message: "Данные успешно загружены!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    } finally {
    }
  }

  return {
    columns,
    rows,
    addRow,
    getPreOrders,
    getCurrentDate,
    movedPreOrders,
    movingPreOrderToOrder,
  };
});
