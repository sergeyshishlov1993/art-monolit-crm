import { ref, onMounted } from "vue";
import { useArrival } from "@/stores/Arrival";

export function useArrivalTable() {
  const storeArrival = useArrival();

  const pagination = ref({
    sortBy: "createdAt",
    descending: true,
    rowsPerPage: 10,
  });

  onMounted(async () => {
    await storeArrival.fetchMaterialsData();
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return {
    storeArrival,
    pagination,
    formatDate,
  };
}
