import { onMounted } from "vue";
import { useMaterials } from "@/stores/Materials";

export function useMaterialsStoreInit() {
  const storeMaterials = useMaterials();

  onMounted(async () => {
    await storeMaterials.fetchMaterialsData();
  });
}
