import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useCalculation = defineStore("calculation", () => {
  const columns = [
    {
      name: "accountNumber",
      required: true,
      label: "Номер Заказа",
      align: "rigth",
      field: "accountNumber",
      sortable: true,
    },
    {
      name: "firs_name",
      align: "left",
      label: "Имя",
      field: "firs_name",
      sortable: true,
    },
    {
      name: "second_name",
      align: "left",
      label: "Фамилия",
      field: "second_name",
      sortable: true,
    },

    { name: "phone", align: "left", label: "Телефон", field: "phone" },

    { name: "name", align: "left", label: "Памятник", field: "name" },

    {
      name: "totalPrice",
      align: "left",
      label: "Общая сумма",
      field: "totalPrice",
    },

    {
      name: "source",
      label: "Источник",
      align: "left",
      field: "source",
    },

    {
      name: "action",
      align: "left",
      label: "Удалить",
      field: "action",
    },
    {
      name: "date",
      label: "Дата",
      align: "left",
      field: "date",
      sortable: true,
    },
  ];

  const rows = ref([
    {
      id: "61af193c-acef-4a93-93ca-163f754dfd3d",
      accountNumber: 1,
      firs_name: "Анатолий",
      second_name: "Иванов",
      phone: "+380994755711",
      name: "Ангел (серый)",

      comment:
        "Lorem Ipsum - это текст-рыба, часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной  для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только",
      totalPrice: 27900,
      source: "fb",
      action: "",
      date: "12.06.2024",

      dataTable: reactive({
        rowsMaterials: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsServices: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsWorks: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],
      }),
    },

    {
      id: "f25017f4-c9eb-414f-a2d9-53d82bcc6ef4",
      accountNumber: 2,
      firs_name: "Анатолий",
      second_name: "Иванов",
      phone: "+380994755711",
      name: "Ангел (серый)",

      totalPrice: 27900,
      status: "new",
      source: "fb",

      action: "",
      date: "12.06.2024",

      dataTable: reactive({
        rowsMaterials: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsServices: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsWorks: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],
      }),
    },

    {
      id: "85c9e0cb-900e-46ea-a847-ee342a82d7bb",
      accountNumber: 3,
      firs_name: "Анатолий",
      second_name: "Иванов",
      phone: "+380994755711",
      name: "Ангел (серый)",
      totalPrice: 27900,
      source: "fb",
      action: "",
      date: "12.06.2024",

      dataTable: reactive({
        rowsMaterials: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsServices: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsWorks: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],
      }),
    },

    {
      id: "e22019b1-4902-4d18-89e2-2c4707c91f8c",
      accountNumber: 4,
      firs_name: "Анатолий",
      second_name: "Иванов",
      phone: "+380994755711",
      name: "Ангел (серый)",
      totalPrice: 27900,
      source: "fb",
      action: "",
      date: "12.06.2024",

      dataTable: reactive({
        rowsMaterials: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsServices: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],

        rowsWorks: [
          {
            id: crypto.randomUUID(),
            accountNumber: 1,
            name: "Выбрать",
            price: 0,
          },
        ],
      }),
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
      id: crypto.randomUUID(),
      accountNumber: rows.value.length + 1,
      firs_name: "",
      second_name: "",
      phone: "",
      name: "",
      totalPrice: 0,
      source: "",
      action: "",
      date: getCurrentDate(),
    });
  }

  return {
    columns,
    rows,
    addRow,
  };
});
