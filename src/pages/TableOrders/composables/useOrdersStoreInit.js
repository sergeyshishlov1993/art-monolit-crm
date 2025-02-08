import { onMounted } from "vue";
import { useOrders } from "@/stores/Orders";
import { useOwner } from "@/stores/Owner";
import { useUserStore } from "@/stores/User";

export function useOrdersStoreInit() {
  const store = useOrders();
  const storeOwner = useOwner();
  const storeUser = useUserStore();

  onMounted(async () => {
    await store.getOrders(
      null,
      null,
      null,
      null,
      null,
      null,
      storeUser.user.address
    );
    await storeOwner.getAllStores();
    store.getSavedDraft();
  });
}
