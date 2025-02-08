import { ref } from "vue";
import { useOrders } from "@/stores/Orders";
import { useOwner } from "@/stores/Owner";

export function useOrdersFilters() {
  const formattedDateRange = ref("");
  const selectedDateRange = ref({ from: "", to: "" });
  const selectedStores = ref(null);
  const selectedStatus = ref("Новый");
  const searchQuery = ref("");
  const showCalendar = ref(false);
  const store = useOrders();
  const storeOwner = useOwner();

  const statusOptions = [
    { label: "Новый", value: "new" },
    { label: "Макет", value: "layout" },
    { label: "Принят Макет", value: "layout_accepted" },
    { label: "Гравировка(Фронт)", value: "engraving_front" },
    { label: "Гравировка(Реверс)", value: "engraving_reverse" },
    { label: "Гравировка(Плита)", value: "engraving_plate" },
    { label: "Гравировка(Тумба)", value: "engraving_stand" },
    { label: "Фрезеровка", value: "milling" },
    { label: "Бетонирование", value: "concreting" },
    { label: "Укладка плитки", value: "laying_tiles" },
    { label: "Установка", value: "installation" },
    { label: "Завершен", value: "completed" },
  ];

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  };

  const updateFormattedDateRange = async (range) => {
    if (range?.from && range?.to) {
      formattedDateRange.value = `${formatDate(range.from)} - ${formatDate(
        range.to
      )}`;
      await store.getOrders(
        null,
        selectedDateRange.value.from,
        selectedDateRange.value.to
      );
    } else {
      formattedDateRange.value = "";
    }
    showCalendar.value = false;
  };

  const filterStatus = async (status) => {
    await store.getOrders(status.value);
  };

  const handleStoreChange = async (storeId) => {
    const storeAdress = storeOwner.storeOptions.find((s) => s.id === storeId);
    await store.getOrders(
      null,
      null,
      null,
      null,
      null,
      null,
      storeAdress ? storeAdress.name : null
    );
  };

  const handlerSearch = async () => {
    await store.getOrders(null, null, null, searchQuery.value);
  };

  const resetFilters = async () => {
    selectedDateRange.value = { from: "2025-01-01", to: "2025-02-01" };
    formattedDateRange.value = "01.01.2025 - 01.02.2025";
    selectedStatus.value = "Новый";
    searchQuery.value = "";

    await store.getOrders();
  };

  return {
    formattedDateRange,
    selectedDateRange,
    selectedStores,
    selectedStatus,
    searchQuery,
    statusOptions,
    showCalendar,
    updateFormattedDateRange,
    filterStatus,
    handleStoreChange,
    handlerSearch,
    resetFilters,
    formatDate,
  };
}
