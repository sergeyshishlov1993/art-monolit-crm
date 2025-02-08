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
      field: (row) => new Date(row.createdAt).getTime(),
      sortable: true,
      format: (val) => formatDate(val),
    },
  ];
  const movedPreOrders = ref({});
  const rows = ref([]);
  const onePreOrder = ref({});

  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: "createdAt",
    descending: true,
  });

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

  async function createPreOrder(order, materials, services, works) {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/pre-orders/create-preorder`,
      {
        preOrderData: order,
        preOrderMaterials: materials,
        preOrderServices: services,
        preOrderWorks: works,
      }
    );

    $q.notify({
      message: `Просчет ${order.name} добавлен`,
      color: "positive",
      icon: "check_circle",
      position: "top-right",
      timeout: 2500,
    });
    try {
    } catch (error) {}
  }
  async function deletePreOrder(id) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/pre-orders/remove-order/${id}`
      );

      rows.value = rows.value.filter((el) => el.id !== id);

      $q.notify({
        message: "Удалено!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {
      console.error(error);

      $q.notify({
        message: `Ощибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }

  async function getPreOrders(
    status = null,
    startDate = null,
    endDate = null,
    search = null,
    page = pagination.value.page,
    per_page = pagination.value.rowsPerPage,
    storeAddress = null
  ) {
    try {
      const params = {
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
        page: page || 1,
        per_page: per_page || 10,
        storeAddress: storeAddress || undefined,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/pre-orders`,
        {
          params,
        }
      );

      if (!response.data.orders || response.data.orders.length === 0) {
        console.warn("⚠️ Нет данных для текущей страницы!");
        return;
      }

      rows.value = response.data.orders;

      pagination.value.page = response.data.currentPage;
      pagination.value.rowsPerPage = response.data.perPage;
      pagination.value.rowsNumber = response.data.totalOrders;
    } catch (error) {
      console.error("❌ Ошибка при получении предзаказов:", error);

      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        timeout: 3000,
      });
    }
  }
  async function updatePreOrder(id, order, materials, services, works) {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/pre-orders/update-preorder/${id}`,
      {
        preOrderData: order,
        preOrderMaterials: materials,
        preOrderServices: services,
        preOrderWorks: works,
      }
    );

    $q.notify({
      message: "Замовлення оновлено успішно!",
      color: "positive",
      icon: "check_circle",
      position: "top-right",
      timeout: 2500,
    });
  }

  return {
    addRow,
    columns,
    createPreOrder,
    deletePreOrder,
    updatePreOrder,
    rows,
    getPreOrders,
    getCurrentDate,
    movedPreOrders,
    movingPreOrderToOrder,
    pagination,
    onePreOrder,
  };
});
