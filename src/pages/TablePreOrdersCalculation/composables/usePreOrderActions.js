import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePreOrders } from "@/stores/PreOrders";
import { useOrders } from "@/stores/Orders";

export function usePreOrderActions() {
  const router = useRouter();
  const store = usePreOrders();
  const storeOrders = useOrders();
  const isCreated = ref(false);
  const isProcessing = ref(false);

  const addItem = () => {
    router.push(
      `/order-estimation?id=id&accountNumber=${
        store.rows.length + 1
      }&isCreated=true`
    );
    store.addRow();
    isCreated.value = true;
  };

  const openOrder = (order) => {
    router.push(
      `/order-estimation?id=${order.id}&accountNumber=${store.rows.length}&isCreated=${isCreated.value}&isPublic=${order.isDraft}`
    );
  };

  const moveItem = (item) => {
    store.movingPreOrderToOrder(item);
    router.push(
      `/create?id=id&accountNumber=${
        storeOrders.rows.length + 1
      }&isCreated=true&isMoved=true&preOrderId=${item.id}`
    );
    storeOrders.addRow();
  };

  const removeItem = async (id) => {
    isProcessing.value = true;
    await store.deletePreOrder(id);
    isProcessing.value = false;
  };

  return {
    addItem,
    openOrder,
    moveItem,
    removeItem,
    isProcessing,
  };
}
