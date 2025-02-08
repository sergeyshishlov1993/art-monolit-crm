import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useOrders } from "@/stores/Orders";
import { useOrderHelpers } from "./useOrderHelpers";

export function useOrderData(dataTable) {
  const route = useRoute();
  const store = useOrders();
  const { sortPhotos, sortDataOrder } = useOrderHelpers();

  onMounted(async () => {
    await store.getOrdersById(route.query.id);

    console.log("store ... . .", store.rows);
    sortDataOrder(store, dataTable);
  });

  return {
    store,
    dataTable,
  };
}
