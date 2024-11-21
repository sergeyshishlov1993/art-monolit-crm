import { defineStore } from "pinia";
import { ref } from "vue";

export const useWarehouse = defineStore("warehouse", () => {
  const columns = ref([
    {
      name: "accountNumber",
      required: true,
      label: "Номер",
      align: "start",
      field: "accountNumber",
      sortable: true,
    },
    {
      name: "name",
      align: "start",
      label: "Название",
      field: "name",
      sortable: true,
    },
    {
      name: "length",
      align: "start",
      label: "Длина",
      field: "length",
      sortable: true,
    },
    { name: "width", align: "start", label: "Ширина", field: "width" },
    {
      name: "thickness",
      align: "start",
      label: "Толщина",
      field: "thickness",
    },
    { name: "priceM2", align: "start", label: "Цена м2", field: "priceM2" },

    {
      name: "price",
      label: "Цена детали",
      align: "start",
      field: "price",
    },
    {
      name: "weight",
      align: "start",
      label: "Вес",
      field: "weight",
    },
    {
      name: "count",
      label: "Количество",
      align: "start",
      field: "count",
      sortable: true,
    },

    {
      name: "defective",
      label: "Брак",
      align: "start",
      field: "defective",
      sortable: true,
    },

    {
      name: "date",
      label: "Дата",
      align: "start",
      field: "date",
      sortable: true,
    },

    {
      name: "delete",
      label: "Удалить",
      align: "start",
      field: "delete",
      sortable: true,
    },
  ]);

  const rows = ref([
    {
      id: crypto.randomUUID(),
      accountNumber: 1,
      name: "Арка",
      length: "80",
      width: "40",
      thickness: "8",
      priceM2: 582,
      price: 487,
      weight: "77",
      count: 89,
      defective: 1,
      date: "12.08.2024",
    },
    {
      id: crypto.randomUUID(),
      accountNumber: 2,
      name: "Арка",
      length: "90",
      width: "40",
      thickness: "8",
      priceM2: 582,
      price: 487,
      weight: "77",
      count: 55,
      defective: 3,
      date: "12.08.2024",
    },
    {
      id: crypto.randomUUID(),
      accountNumber: 3,
      name: "Арка",
      length: "100",
      width: "40",
      thickness: "8",
      priceM2: 582,
      price: 487,
      weight: "77",
      count: 34,
      defective: 19,
      date: "12.08.2024",
    },
    {
      id: crypto.randomUUID(),
      accountNumber: 4,
      name: "Арка",
      length: "110",
      width: "40",
      thickness: "8",
      priceM2: 582,
      price: 487,
      weight: "77",
      count: 12,
      defective: 0,
      date: "12.08.2024",
    },
  ]);

  function getCurrentDate() {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  function addRow() {
    rows.value.push({
      accountNumber: rows.value.length + 1,
      name: "",
      length: "",
      width: "",
      thickness: "",
      priceM2: "",
      price: "",
      weight: "",
      count: "",
      defective: 0,
      date: getCurrentDate(),
    });
  }

  return {
    columns,
    rows,
    addRow,
  };
});
