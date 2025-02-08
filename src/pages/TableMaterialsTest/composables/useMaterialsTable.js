import { ref } from "vue";
import { useMaterials } from "@/stores/Materials";

export function useMaterialsTable() {
  const storeMaterials = useMaterials();
  const pagination = ref({
    sortBy: "createdAt",
    descending: true,
    rowsPerPage: 10,
  });

  return {
    storeMaterials,
    pagination,
  };
}
