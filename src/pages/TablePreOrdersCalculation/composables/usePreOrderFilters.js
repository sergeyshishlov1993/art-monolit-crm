import { ref } from "vue";
import { usePreOrders } from "@/stores/PreOrders";
import { useOwner } from "@/stores/Owner";

export function usePreOrderFilters() {
  const store = usePreOrders();
  const storeOwner = useOwner();

  const formattedDateRange = ref("");
  const selectedDateRange = ref({ from: "", to: "" });
  const selectedStores = ref(null);
  const searchQuery = ref("");
  const showCalendar = ref(false);
  const statusOptions = ref([
    { label: "Просчет", value: "isDraft" },
    { label: "В заказах", value: "isPublic" },
  ]);
  const selectedStatus = ref("Просчет");

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };

  const updateFormattedDateRange = async (range) => {
    if (range?.from && range?.to) {
      formattedDateRange.value = `${formatDate(range.from)} - ${formatDate(
        range.to
      )}`;
      await store.getPreOrders(
        null,
        selectedDateRange.value.from,
        selectedDateRange.value.to
      );
    } else {
      formattedDateRange.value = "";
    }

    showCalendar.value = false;
  };

  const handleStoreChange = async (storeId) => {
    const storeAddress = storeOwner.storeOptions.find((s) => s.id === storeId);
    await store.getPreOrders(
      null,
      null,
      null,
      null,
      null,
      null,
      storeAddress ? storeAddress.name : null
    );
  };

  const filterStatus = async (status) => {
    selectedStatus.value = status;
    await store.getPreOrders(status.value);
  };

  const handlerSearch = async () => {
    await store.getPreOrders(null, null, null, searchQuery.value);
  };

  async function resetFilters() {
    selectedDateRange.value = { from: "", to: "" };
    formattedDateRange.value = "";
    selectedStatus.value = "Просчет";
    searchQuery.value = "";

    await store.getPreOrders();
  }

  return {
    formattedDateRange,
    selectedDateRange,
    selectedStores,
    statusOptions,
    selectedStatus,
    searchQuery,
    showCalendar,
    updateFormattedDateRange,
    handleStoreChange,
    filterStatus,
    handlerSearch,
    resetFilters,
    formatDate,
  };
}
