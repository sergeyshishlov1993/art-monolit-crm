import { defineStore } from "pinia";
import { ref } from "vue";
import { useQuasar } from "quasar";

import axios from "axios";

export const useOrders = defineStore("orders", () => {
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
      name: "prepayment",
      align: "left",
      label: "Предоплата",
      field: "prepayment",
    },
    { name: "pay", align: "left", label: "Остаток", field: "pay" },
    {
      name: "totalPrice",
      align: "left",
      label: "Общая сумма",
      field: "totalPrice",
    },

    {
      name: "status",
      label: "Статус",
      align: "center",
      field: "status",
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
      name: "action",
      align: "left",
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

  const rows = ref([]);
  const oneOrder = ref({});

  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: "createdAt",
    descending: true,
  });
  async function createOrder(
    orderData,
    deads,
    materials,
    services,
    works,
    photo
  ) {
    const serializablePhoto = JSON.parse(JSON.stringify(photo));
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/orders/create`,
      {
        orderData: orderData,
        orderDeads: deads,
        orderMaterials: materials,
        orderServices: services,
        orderWorks: works,
        rowsPhotos: serializablePhoto,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    $q.notify({
      message: "Замовлення створено успішно!",
      color: "positive",
      icon: "check_circle",
      position: "top-right",
      timeout: 2500,
    });
  }

  async function deleteOrder(id, name, isDraft) {
    try {
      if (isDraft) {
        rows.value = rows.value.filter((r) => r.id !== id);

        clearDraft();
      } else {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/orders/remove-order/${id}`
        );

        rows.value = rows.value.filter((r) => r.id !== id);

        $q.notify({
          message: `Заказ ${name} удален`,
          color: "positive",
          icon: "check_circle",
          position: "top-right",
          timeout: 2500,
        });
      }
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

  async function changeStatusOrder(id, statuses, name) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/change-status-order`,
        {
          orderId: id,
          statuses,
          name: name,
        }
      );

      console.log("Response", response);

      $q.notify({
        message: `Статусы для заказа ${name} изменены`,
        color: "positive",
        icon: "check_circle",
        timeout: 2500,
      });
    } catch (error) {
      console.error("ERROR", error);
    }
  }

  async function getOrders(
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
        storeAddress: storeAddress,
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          params,
        }
      );

      if (!response.data.orders || response.data.orders.length === 0) {
        console.warn("⚠️ Нет данных для текущей страницы!");
        return;
      }

      rows.value = response.data.orders.map((order) => ({
        ...order,
        activeStatuses: getActiveStatuses(order.OrderStatuses[0] || {}),
      }));

      pagination.value.page = response.data.currentPage;
      pagination.value.rowsPerPage = response.data.perPage;
      pagination.value.rowsNumber = response.data.totalOrders;
    } catch (error) {
      console.error("❌ Ошибка при получении данных:", error);
    }
  }
  async function getOrdersById(orderId) {
    try {
      const order = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`
      );

      oneOrder.value = await order.data.order;

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
  async function movePreOrderToOrder(id) {
    try {
      const response = axios.put(
        `${import.meta.env.VITE_API_URL}/pre-orders/update-preorder-status/${
          id.value
        }`
      );

      console.log("pre order move", response);
    } catch (error) {
      console.error("error", error);
    }
  }
  async function updateOrder(
    id,
    order,
    deads,
    materials,
    services,
    works,
    photo
  ) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/update/${id}`,
        {
          orderData: order,
          orderDeads: deads,
          orderMaterials: materials,
          orderServices: services,
          orderWorks: works,
          rowsPhotos: photo,
        }
      );

      $q.notify({
        message: `${order.name} успешно был обновлен!`,
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    } catch (error) {}
  }

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
      status: "new",
      source: "fb",
      store: "КС",
      action: "",
      isDraft: false,
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
  function getActiveStatuses(statusObject) {
    const activeStatuses = [];
    for (const [key, value] of Object.entries(statusObject)) {
      if (
        value === true &&
        key !== "id" &&
        key !== "parentId" &&
        key !== "createdAt" &&
        key !== "updatedAt"
      ) {
        activeStatuses.push(key);
      }
    }
    return activeStatuses;
  }
  function getCurrentDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const getSavedDraft = () => {
    const savedDraft = localStorage.getItem("orderDraft");

    if (!savedDraft) return null;

    const parsedDraft = JSON.parse(savedDraft);

    const alreadyExists = rows.value.some(
      (order) => order.id === parsedDraft.id
    );
    if (alreadyExists) return parsedDraft;

    if (parsedDraft.isDraft) {
      rows.value.unshift(parsedDraft);
    }

    return parsedDraft;
  };

  const clearDraft = () => {
    localStorage.removeItem("orderDraft");
  };

  async function removeFromS3(fileKey) {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/orders/delete-from-s3?fileKey=${fileKey}`
      );
    } catch (error) {}
  }

  return {
    addRow,
    columns,
    createOrder,
    changeStatusOrder,
    deleteOrder,
    rows,
    getOrders,
    getCurrentDate,
    getOrdersById,
    movePreOrderToOrder,
    updateOrder,
    removeFromS3,
    pagination,
    getSavedDraft,
    clearDraft,
    oneOrder,
  };
});
