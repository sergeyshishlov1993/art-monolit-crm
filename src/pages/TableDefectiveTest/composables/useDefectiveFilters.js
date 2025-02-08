import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import { useDefective } from "@/stores/Defective";

export function useDefectiveFilters() {
  const storeDefective = useDefective();
  const searchQuery = ref("");

  const debouncedSearch = debounce(fetchSearchResults, 500);

  watch(searchQuery, (newValue) => {
    debouncedSearch(newValue);
  });

  async function fetchSearchResults(query) {
    await storeDefective.getDefectiveData(query);
  }

  return {
    searchQuery,
    fetchSearchResults,
  };
}
