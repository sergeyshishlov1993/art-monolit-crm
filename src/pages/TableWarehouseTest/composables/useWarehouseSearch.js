import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import { useWarehouse } from "@/stores/Warehouse";

export function useWarehouseSearch() {
  const storeWarehouse = useWarehouse();
  const searchQuery = ref("");
  const pagination = ref({
    sortBy: "createdAt",
    descending: true,
    rowsPerPage: 10,
  });

  const fetchSearchResults = debounce(async (query) => {
    await storeWarehouse.getWarehouseData(query);
  }, 500);

  watch(searchQuery, (newValue) => {
    fetchSearchResults(newValue);
  });

  return { searchQuery, pagination, fetchSearchResults };
}
