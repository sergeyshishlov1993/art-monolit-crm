import { onMounted } from "vue";
import { useWarehouse } from "@/stores/Warehouse";
import { usePermissionStore } from "@/stores/PermissionStore";

export function useWarehouseLogic() {
  const storeWarehouse = useWarehouse();
  const permissionStore = usePermissionStore();

  onMounted(async () => {
    await storeWarehouse.getWarehouseData();

    if (!permissionStore.isOwner) {
      storeWarehouse.columns = storeWarehouse.columns.filter(
        (el) => el.name !== "earnings"
      );
    }
  });

  return { storeWarehouse, permissionStore };
}
