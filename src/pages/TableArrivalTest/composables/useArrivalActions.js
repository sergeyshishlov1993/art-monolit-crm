import debounce from "lodash/debounce";
import { useArrival } from "@/stores/Arrival";

export function useArrivalActions() {
  const storeArrival = useArrival();

  const debouncedUpdate = debounce(async (row) => {
    await handleUpdate(row);
  }, 3000);

  async function handleUpdate(row) {
    try {
      await storeArrival.handleUpdate(row);
      row.isChanged = false;
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
    }
  }

  function handlerFocusInput(row) {
    row.isChanged = true;
    if (!row.isCreated) {
      debouncedUpdate(row);
    }
  }

  function allowOnlyNumbers(event, column) {
    if (column === "name") return;

    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode !== 8 && // Backspace
      charCode !== 9 && // Tab
      charCode !== 13 && // Enter
      (charCode < 48 || charCode > 57) // Только цифры
    ) {
      event.preventDefault();
    }
  }

  async function clearTableArrival() {
    await storeArrival.clearTableArrival();
    storeArrival.rows = [];
  }

  return {
    handleUpdate,
    handlerFocusInput,
    allowOnlyNumbers,
    clearTableArrival,
  };
}
