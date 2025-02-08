import { computed, ref } from "vue";

export function usePriceCalculation(dataTable) {
  const totalPrice = ref(0);
  const finalPrice = ref(0);

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString("ru-RU");
  };

  function calcTotalPrice() {
    const calculate = (rows) =>
      rows.reduce(
        (acc, row) =>
          acc + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 1),
        0
      );

    totalPrice.value =
      calculate(dataTable.rowsMaterials) +
      calculate(dataTable.rowsServices) +
      calculate(dataTable.rowsWorks);

    finalPrice.value = totalPrice.value;
  }

  const formatFinalPrice = computed(() => formatCurrency(finalPrice.value));

  return {
    totalPrice,
    finalPrice,
    formatFinalPrice,
    calcTotalPrice,
    formatCurrency,
  };
}
