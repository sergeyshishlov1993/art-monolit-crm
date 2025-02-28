import { ref, computed } from "vue";

export function useCalcTotalPrice(dataTable) {
  const totalPrice = ref(0);
  const finalPrice = ref(0);
  const sale = ref(0);
  const prepayment = ref(0);

  const formatFinalPrice = computed(() => formatCurrency(finalPrice.value));
  const formattedPrepayment = computed(() => formatCurrency(prepayment.value));
  const formatSale = computed(() => formatCurrency(sale.value));
  const formatTotalPrice = computed(() => formatCurrency(totalPrice.value));

  function calcTotalPrice() {
    const materials = dataTable.rowsMaterials.reduce((acc, row) => {
      const price = parseFloat(row.price) || 0;
      const qty = parseFloat(row.quantity) || 1;
      return acc + price * qty;
    }, 0);

    const services = dataTable.rowsServices.reduce((acc, row) => {
      const price = parseFloat(row.price) || 0;
      const qty = parseFloat(row.quantity) || 1;
      return acc + price * qty;
    }, 0);

    const works = dataTable.rowsWorks.reduce((acc, row) => {
      const price = parseFloat(row.price) || 0;
      const qty = parseFloat(row.quantity) || 1;
      return acc + price * qty;
    }, 0);

    totalPrice.value = materials + services + works;
    finalPrice.value = totalPrice.value - sale.value - prepayment.value;
  }

  const calcFinalPrice = (event, name) => {
    const value = Number(event.target.value.replace(/\D/g, "")) || 0;

    switch (name) {
      case "sale":
        sale.value = value;
        break;
      case "prepayment":
        prepayment.value = value;
        break;
    }

    const priceAfterDiscount = totalPrice.value - sale.value;
    finalPrice.value = priceAfterDiscount - prepayment.value;
    return finalPrice.value;
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString("ru-RU");
  };

  return {
    calcTotalPrice,
    totalPrice,
    finalPrice,
    sale,
    prepayment,
    calcFinalPrice,
    formatFinalPrice,
    formattedPrepayment,
    formatSale,
    formatTotalPrice,
  };
}
