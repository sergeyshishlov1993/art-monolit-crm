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
  const selectedSource = ref("");

  const user = ref(null);

  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    user.value = userData ? JSON.parse(userData) : null;
  }

  const storeAdress = ref(user.value?.address || "");

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
        selectedDateRange.value.to,
        storeAdress.value ? storeAdress.value.name : null
      );

      await store.calculateOrders(
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

  const handlerCalculationOrder = async () => {
    await store.calculateOrders(
      selectedDateRange.value.from,
      selectedDateRange.value.to,
      storeAdress.value,
      selectedSource.value
    );
  };

  const handleStoreChange = async (storeId) => {
    storeAdress.value = storeOwner.storeOptions.find((s) => s.id === storeId);
    await store.getOrders(
      null,
      null,
      null,
      null,
      null,
      null,
      storeAdress.value
    );

    await store.calculateOrders(null, null, storeAdress.value);

    console.log("calculateOrders", storeAdress.value);
  };

  const handlerSearch = async () => {
    await store.getOrders(
      null,
      null,
      null,
      searchQuery.value,
      null,
      null,
      storeAdress.value
    );

    console.log("search", storeAdress.value);
  };

  const resetFilters = async () => {
    selectedDateRange.value = { from: "", to: "" };
    formattedDateRange.value = "";
    selectedStatus.value = "Новый";
    searchQuery.value = "";
    storeAdress.value = "";
    selectedSource.value = "";

    store.totalOrders = 0;
    store.totalSum = 0;
    await store.getOrders();
  };

  const selectSource = async (select) => {
    selectedSource.value = select;

    await store.getOrders(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      selectedSource.value
    );

    await store.calculateOrders(null, null, null, selectedSource.value);
  };

  return {
    formattedDateRange,
    selectedDateRange,
    selectedStores,
    selectedStatus,
    searchQuery,
    statusOptions,
    updateFormattedDateRange,
    filterStatus,
    handleStoreChange,
    handlerSearch,
    resetFilters,
    formatDate,
    selectedSource,
    selectSource,
    handlerCalculationOrder,
  };
}
