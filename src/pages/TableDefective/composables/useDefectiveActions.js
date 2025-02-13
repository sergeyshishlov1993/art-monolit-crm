import { useDefective } from "@/stores/Defective";

export function useDefectiveActions() {
  const storeDefective = useDefective();

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
  }

  return {
    handleUpdate,
    handlerFocusInput,
  };
}
