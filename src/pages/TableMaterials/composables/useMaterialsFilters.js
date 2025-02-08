import { ref, watch } from "vue";
import debounce from "lodash/debounce";
import { useMaterials } from "@/stores/Materials";

export function useMaterialsFilters() {
  const storeMaterials = useMaterials();
  const searchQuery = ref("");
  const debouncedSearch = debounce(fetchSearchResults, 500);

  watch(searchQuery, (newValue) => {
    debouncedSearch(newValue);
  });

  async function fetchSearchResults(query) {
    await storeMaterials.fetchMaterialsData(query);
  }

  return {
    searchQuery,
    fetchSearchResults,
  };
}
