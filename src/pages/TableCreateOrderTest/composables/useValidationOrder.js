import { useQuasar } from "quasar";
import { computed } from "vue";

export function useValidationOrder(dataTable) {
  const $q = useQuasar();

  function isNotEmpty(value) {
    return value !== null && value !== undefined && value !== "";
  }

  function validateCustomerData() {
    if (!dataTable.customer || !isNotEmpty(dataTable.customer.name)) {
      $q.notify({
        type: "negative",
        message: "Имя клиента не может быть пустым!",
      });
      return false;
    }
    return true;
  }

  function validateTable(rows, tableName) {
    if (!Array.isArray(rows) || rows.length === 0) {
      $q.notify({
        type: "negative",
        message: `Таблица "${tableName}" не может быть пустой!`,
      });
      return false;
    }

    const hasEmptyRow = rows.some((row) =>
      Object.values(row).some((value) => !isNotEmpty(value))
    );

    if (hasEmptyRow) {
      $q.notify({
        type: "negative",
        message: `В таблице "${tableName}" есть пустые строки!`,
      });
      return false;
    }

    return true;
  }

  const isValid = computed(() => {
    return (
      validateCustomerData() && validateTable(dataTable.rowsDead, "Умерший")
    );
  });

  return {
    validateCustomerData,
    validateTable,
    isValid,
  };
}
