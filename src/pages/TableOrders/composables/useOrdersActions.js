import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOrders } from "@/stores/Orders";

export function useOrdersActions(canWrite) {
  const router = useRouter();
  const store = useOrders();
  const isCreated = ref(false);

  const addItem = () => {
    router.push(
      `/create?id=id&accountNumber=${store.rows.length + 1}&isCreated=true`
    );
    store.addRow();
    store.clearDraft();
    isCreated.value = true;
  };

  const openOrder = (id, isDraft) => {
    if (isDraft) isCreated.value = true;

    router.push(
      canWrite
        ? `/create?id=${id}&accountNumber=${store.rows.length}&isCreated=${isCreated.value}`
        : `/read-order?id=${id}&accountNumber=${store.rows.length}`
    );
  };

  const removeOrder = async (id, name, isDraft, isPublic) => {
    await store.deleteOrder(id, name, isDraft, isPublic);
  };

  return {
    addItem,
    openOrder,
    removeOrder,
    isCreated,
  };
}
