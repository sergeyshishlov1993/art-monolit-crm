import { ref, onMounted } from "vue";
import { useDefective } from "@/stores/Defective";

export function useDefectiveTable() {
  const storeDefective = useDefective();

  const pagination = ref({
    sortBy: "createdAt",
    descending: true,
    rowsPerPage: 10,
  });

  onMounted(async () => {
    await storeDefective.getDefectiveData();
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
    storeDefective,
    pagination,
    formatDate,
  };
}
