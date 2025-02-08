import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import { useArrival } from "@/stores/Arrival";

export function useArrivalFilters() {
  const storeArrival = useArrival();
  const searchQuery = ref("");

  const debouncedSearch = debounce(fetchSearchResults, 500);

  watch(searchQuery, (newValue) => {
    debouncedSearch(newValue);
  });

  async function fetchSearchResults(query) {
    await storeArrival.fetchMaterialsData(query);
  }

  return {
    searchQuery,
    fetchSearchResults,
  };
}
