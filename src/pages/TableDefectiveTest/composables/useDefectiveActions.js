import debounce from "lodash/debounce";
import { useDefective } from "@/stores/Defective";

export function useDefectiveActions() {
  const storeDefective = useDefective();

  const debouncedUpdateQuantity = debounce(async (row) => {
    await handleUpdate(row);
  }, 1500);

  async function handleUpdate(row) {
    try {
      await storeDefective.handleUpdateQuantity(row);
      row.isChanged = false;
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
    }
  }

  function handlerFocusInput(row) {
    row.isChanged = true;
    debouncedUpdateQuantity(row);
  }

  return {
    handleUpdate,
    handlerFocusInput,
  };
}
