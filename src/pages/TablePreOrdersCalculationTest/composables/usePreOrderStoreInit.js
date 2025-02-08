import { onMounted } from "vue";
import { usePreOrders } from "@/stores/PreOrders";
import { useOwner } from "@/stores/Owner";

export function usePreOrderStoreInit() {
  const store = usePreOrders();
  const storeOwner = useOwner();

  onMounted(async () => {
    await store.getPreOrders();
    await storeOwner.getAllStores();
  });
}
