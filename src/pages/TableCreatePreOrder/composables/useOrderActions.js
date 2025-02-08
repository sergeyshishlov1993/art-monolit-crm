import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { usePreOrders } from "@/stores/PreOrders";

export function useOrderActions(
  dataTable,
  userStore,
  selectedSource,
  totalPrice,
  isOrderCreated,
  isValid
) {
  const isProcessing = ref(false);
  const router = useRouter();
  const route = useRoute();
  const $q = useQuasar();
  const storePreOrder = usePreOrders();

  async function saveOrder() {
    isProcessing.value = true;

    if (!isValid.value) {
      isProcessing.value = false;
      console.warn("❌ Валидация не пройдена!");
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      ...dataTable.customer,
      isDraft: true,
      isPublick: false,
      storeAddress: userStore.user.address,
      source: selectedSource.value,
      totalPrice: totalPrice.value,
      currentData: storePreOrder.getCurrentDate(),

      dataTable: {
        rowsMaterials: dataTable.rowsMaterials,
        rowsServices: dataTable.rowsServices,
        rowsWorks: dataTable.rowsWorks,
      },
    };

    try {
      isProcessing.value = true;
      if (!isOrderCreated.value) {
        console.log(order);
        await storePreOrder.createPreOrder(
          order,
          dataTable.rowsMaterials,
          dataTable.rowsServices,
          dataTable.rowsWorks
        );

        router.push("/calculate");
      } else {
        isProcessing.value = true;

        storePreOrder.updatePreOrder(
          route.query.id,
          order,
          order.dataTable.rowsMaterials,
          order.dataTable.rowsServices,
          order.dataTable.rowsWorks
        );
      }

      isOrderCreated.value = false;
      isProcessing.value = false;

      router.push("/calculate");
    } catch (error) {
      $q.notify({
        message: `Помилка: ${error.response?.data?.message || error.message}`,
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
    isProcessing,
    saveOrder,
  };
}
