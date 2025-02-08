import { usePreOrders } from "@/stores/PreOrders";

export function usePreOrderPagination() {
  const store = usePreOrders();

  const onRequest = async (params) => {
    try {
      const { page, rowsPerPage } = params.pagination;
      await store.getPreOrders(
        null,
        null,
        null,
        null,
        page || 1,
        rowsPerPage || 10
      );
    } catch (error) {
      console.error("❌ Ошибка загрузки предзаказов:", error);
    }
  };

  return {
    onRequest,
  };
}
