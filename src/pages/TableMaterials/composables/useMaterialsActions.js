import { ref } from "vue";
import { useMaterials } from "@/stores/Materials";

export function useMaterialsActions() {
  const storeMaterials = useMaterials();
  const isProcessing = ref(false);

  async function handleAdd(item) {
    storeMaterials.handleAdd(item);

    const idx = storeMaterials.rows.findIndex((el) => el.id === item.id);
    storeMaterials.rows[idx].isCreated = false;
  }

  async function handleUpdate(row) {
    try {
      await storeMaterials.handleUpdate(row);
      row.isChanged = false;
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
    }
  }

  function allowOnlyNumbers(event, column) {
    if (column === "name") return;
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode !== 8 &&
      charCode !== 9 &&
      charCode !== 13 &&
      (charCode < 48 || charCode > 57)
    ) {
      event.preventDefault();
    }
  }

  function handlerFocusInput(row) {
    row.isChanged = true;
  }

  async function clearTableMaterials() {
    await storeMaterials.clearTableMaterials();
    storeMaterials.rows = [];
  }

  return {
    handleAdd,
    handleUpdate,
    allowOnlyNumbers,
    handlerFocusInput,
    clearTableMaterials,
    isProcessing,
  };
}
