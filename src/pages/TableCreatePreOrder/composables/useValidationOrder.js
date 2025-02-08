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

  const isValid = computed(() => {
    return validateCustomerData();
  });

  return {
    validateCustomerData,
    isValid,
  };
}
