import { watch, ref } from "vue";

const isProcessing = ref(false);

import { useValidation } from "@/composables/useValidation";

export function useOrderManagement(
  dataTable,
  store,
  $q,
  selectedSource,
  userStore,
  totalPrice,
  finalPrice,
  prepayment,
  sale,
  route,
  router,
) {
  const { validateCustomerData, validationTable } = useValidation($q);
  const isOrderCreated = ref(route.query.isCreated === "false");
  const isMoved = ref(route.query.isMoved === "true");
  const movedId = ref(route.query.preOrderId);

  function addPhoto(data, type) {
    dataTable.rowsPhotos[type] = data;
  }

  function addMovedOrder(movedData) {
    const { address, comment, first_name, second_name, name, phone } =
      movedData;

    dataTable.customer = {
      address,
      comment,
      first_name,
      second_name,
      name,
      phone,
      status: "new",
      isPublic: false,
    };
    totalPrice.value = movedData.totalPrice;
    finalPrice.value = totalPrice.value;
    dataTable.rowsMaterials = movedData.PreOrderMaterials;
    dataTable.rowsServices = movedData.PreOrderServices;
    dataTable.rowsWorks = movedData.PreOrderWorks;
  }

  const saveDraftToLocalStorage = () => {
    if (dataTable.customer.isPublic) {
      return;
    } else {
      localStorage.setItem(
        "orderDraft",
        JSON.stringify({
          ...dataTable,
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          isDraft: true,
          totalPrice: totalPrice.value,
          finalPrice: finalPrice.value,
          sale: sale.value,
          status: "new",
          prepayment: prepayment.value,
        })
      );
    }
  };
  function sortPhotos(orderPhotoLinks) {
    const sorted = orderPhotoLinks.map((photo) => {
      dataTable.rowsPhotos[photo.type].push(photo);
    });

    return {
      carvings: sorted.carvings || [],
      artistic: sorted.artistic || [],
    };
  }

  watch(
    dataTable,
    (newVal, oldVal) => {
      saveDraftToLocalStorage();
    },
    { deep: true }
  );

  async function saveOrder() {
    isProcessing.value = true;

    if (!validateCustomerData(dataTable.customer)) {
      isProcessing.value = false;
      console.warn("❌ Валидация не пройдена!");
      return;
    }

    if (!validationTable(dataTable.rowsDead, "Умерший")) {
      isProcessing.value = false;
      console.warn("❌ Валидация не пройдена!");
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      ...dataTable.customer,
      source: selectedSource.value,
      prepayment: prepayment.value,
      pay: finalPrice.value,
      sale: sale.value,
      status: "new",
      totalPrice: totalPrice.value,
      storeAddress: userStore.user.address,
      isPublic: true,
      currentData: store.getCurrentDate(),

      dataTable: {
        rowsDead: dataTable.rowsDead,
        rowsMaterials: dataTable.rowsMaterials,
        rowsServices: dataTable.rowsServices,
        rowsWorks: dataTable.rowsWorks,
        rowsPhotos: dataTable.rowsPhotos,
      },
    };

    try {
      if (!isOrderCreated.value) {
        await store.createOrder(
          order,
          order.dataTable.rowsDead,
          order.dataTable.rowsMaterials,
          order.dataTable.rowsServices,
          order.dataTable.rowsWorks,
          order.dataTable.rowsPhotos
        );

        store.clearDraft();

        if (isMoved.value) {
          await store.movePreOrderToOrder(movedId);
        }

        router.push("/orders");
      } else {
        await store.updateOrder(
          route.query.id,
          order,
          order.dataTable.rowsDead,
          order.dataTable.rowsMaterials,
          order.dataTable.rowsServices,
          order.dataTable.rowsWorks,
          order.dataTable.rowsPhotos
        );

        store.clearDraft();
      }

      isOrderCreated.value = false;
      isProcessing.value = false;

      router.push("/orders");

      store.clearDraft();
    } catch (error) {
      $q.notify({
        message: `Ошибка: ${error.response?.data?.message || error.message}`,
        color: "negative",
        icon: "error",
        position: "top-right",
        timeout: 3000,
      });
      console.error("Помилка при збереженні замовлення:", error);
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    addPhoto,
    dataTable,
    addMovedOrder,
    isOrderCreated,
    isProcessing,
    saveDraftToLocalStorage,
    saveOrder,
    isMoved,
    sortPhotos,
  };
}
