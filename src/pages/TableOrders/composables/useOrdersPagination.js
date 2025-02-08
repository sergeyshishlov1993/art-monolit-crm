import { ref } from "vue";
import { useOrders } from "@/stores/Orders";

export function useOrdersPagination() {
  const store = useOrders();
  const loading = ref(false);

  const onRequest = async (params) => {
    loading.value = true;

    try {
      const { page, rowsPerPage } = params.pagination;
      await store.getOrders(
        null,
        null,
        null,
        null,
        page || 1,
        rowsPerPage || 10
      );
    } catch (error) {
      console.error("❌ Ошибка загрузки заказов:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    onRequest,
  };
}
