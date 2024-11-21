<script setup>
import { ref, computed } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";
import TheTabs from "./components/TheTabs.vue";
import TabMaterials from "./components/Tabs/TabMaterials.vue";
import TabTypeWork from "./components/Tabs/TabTypeWork.vue";
import TabServices from "./components/Tabs/TabServices.vue";

import WarehouseSelector from "./components/WarehouseSelector.vue";
import { useWarehouse } from "@/stores/Warehouse";

const storeWarehouse = useWarehouse();

const columns = ref([
  {
    name: "accountNumber",
    required: true,
    label: "Номер",
    align: "left",
    field: "accountNumber",
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "Название",
    field: "name",
    sortable: true,
  },
  {
    name: "price",
    align: "left",
    label: "Ценв",
    field: "price",
    sortable: true,
  },

  {
    name: "delete",
    label: "Удалить",
    align: "left",
    field: "delete",
  },
]);

const tabs = [
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
];

const rowsMaterials = ref([
  {
    id: crypto.randomUUID(),
    accountNumber: 1,
    name: "Арка",
    price: 487,
  },
]);

const rowsServices = ref([
  {
    accountNumber: 1,
    name: "Арка",
    price: 487,
  },
]);

const rowsWorks = ref([
  {
    accountNumber: 1,
    name: "Арка",
    price: 487,
  },
]);

const customerName = ref("");
const customerSecondName = ref("");
const customerPhone = ref("");
const customerAddress = ref("");
const comment = ref("");
const deadName = ref("");
const deadSecondName = ref("");
const deadSurName = ref("");
const deadDateBirth = ref("");
const deadDateDeath = ref("");

const selected = ref("Выбрать");
const currentTab = ref("Материалы");

const activeTabComponent = computed(() => {
  switch (currentTab.value) {
    case "Материалы":
      return TabMaterials;

    case "Виды работ":
      return TabTypeWork;

    case "Услуги":
      return TabServices;
  }
});

function changeTab(name) {
  currentTab.value = name;
}

function addItem(tableName) {
  tableName.push({
    id: crypto.randomUUID(),
    accountNumber: tableName.length + 1,
    name: "",
    price: "",
  });
}

function generatePDF() {
  const docDefinition = {
    content: [
      { text: "Заказ №1", style: "header" },
      { text: "Заказчик", style: "subheader" },
      {
        columns: [{ text: `Имя: ${customerName.value || "Не указано"}` }],
      },
      { text: `Фамилия: ${customerSecondName.value || "Не указано"}` },
      { text: `Телефон: ${customerPhone.value || "Не указано"}` },
      { text: `Адрес доставки: ${customerAddress.value || "Не указано"}` },
      { text: `Примечание: ${comment.value || "Нет"}` },
      { text: "Умерший", style: "subheader" },
      {
        columns: [{ text: `Имя: ${deadName.value || "Не указано"}` }],
      },
      { text: `Фамилия: ${deadSecondName.value || "Не указано"}` },
      { text: `Отчество: ${deadSurName.value || "Не указано"}` },
      { text: `Дата рождения: ${deadDateBirth.value || "Не указано"}` },
      { text: `Дата смерти: ${deadDateDeath.value || "Не указано"}` },

      { text: "Материалы", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...rowsMaterials.value.map((row) => [
              row.accountNumber,
              row.name || "Не указано",
              row.price || "0",
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },

      { text: "Услуги", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...rowsServices.value.map((row) => [
              row.accountNumber,
              row.name || "Не указано",
              row.price || "0",
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },

      { text: "Виды работ", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...rowsWorks.value.map((row) => [
              row.accountNumber,
              row.name || "Не указано",
              row.price || "0",
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },

      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 10],
      },
    },
    defaultStyle: {
      fontSize: 14,
    },
  };

  pdfMake.createPdf(docDefinition).download("Order.pdf");
}

function addSelectedValue(val) {
  const idx = rowsMaterials.value.findIndex(
    (el) => el.accountNumber === val.accountNumber
  );

  rowsMaterials.value[idx] = val;
}
</script>

<template>
  <div class="table__wrapper">
    <UiTextH1>Заказ №1</UiTextH1>

    <div>
      <UiTextH2 class="table__title">Название продукта</UiTextH2>
      <q-input
        class="input"
        stack-label
        v-model="customerName"
        label="Название"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      ></q-input>
    </div>

    <div class="tabs">
      <the-tabs
        v-for="tab in tabs"
        :key="tab.name"
        @click="changeTab(tab.name)"
        :selectedTab="currentTab"
        :name="tab.name"
        >{{ tab.name }}</the-tabs
      >
    </div>

    <keep-alive>
      <component :is="activeTabComponent" />
    </keep-alive>

    <div class="q-pa-md">
      <div class="wrapper">
        <div class="customer">
          <UiTextH2 class="table__title">Заказчик</UiTextH2>

          <q-input
            stack-label
            v-model="customerName"
            label="Имя заказчика"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="customerSecondName"
            label="Фамилия заказчика"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="customerPhone"
            label="Номер телефону *"
            lazy-rules
            mask="+380(##)-###-##-##"
            :rules="[
              (val) =>
                (val !== null && val !== '') ||
                'Будь ласка, введіть номер телефону',
              (val) =>
                /^\+380\(\d{2}\)-\d{3}-\d{2}-\d{2}$/.test(val) ||
                'Неправильний формат номеру телефону',
            ]"
            type="tel"
          ></q-input>

          <q-input
            stack-label
            v-model="customerAddress"
            label="Aдрес доставки"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="comment"
            label="Примечание"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>
        </div>

        <div class="info-by-order">
          <UiTextH2 class="table__title">Умерший</UiTextH2>

          <q-input
            stack-label
            v-model="deadName"
            label="Имя умершего"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="deadSecondName"
            label="Фамилия умершего"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="deadSurName"
            label="Отчество умершего"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="deadDateBirth"
            label="Дата рождения умершего"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="deadDateDeath"
            label="Дата смерти умершего"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>
        </div>
      </div>
    </div>

    <q-btn
      label="Save"
      color="primary"
      icon="save"
      class="q-mt-md"
      @click="generatePDF"
    ></q-btn>
  </div>
</template>

<style lang="scss" scoped>
.table__wrapper {
  padding-top: 50px;

  h1 {
    text-align: center;
    font-size: 34px;
    font-weight: 600;
  }

  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form {
  display: flex;
  flex-direction: column;
}

.wrapper {
  display: flex;
  gap: 50px;

  .customer {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;

    h2 {
      font-weight: 500;
    }
  }

  .info-by-order {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 100%;

    h2 {
      font-weight: 500;
    }
  }
}

.table__title {
  text-align: center;
  font-weight: 500;
  font-size: 25px;
  margin-bottom: 50px;
}

.button {
  margin-bottom: 15px;
}

.input {
  width: 500px;
  margin: 0 auto;
}

.q-td {
  height: 50px;
  position: relative;
  overflow-y: auto;
}

.tabs {
  position: relative;
  padding: 64px 0 34px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
}
</style>
