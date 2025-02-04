<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useOrders } from "@/stores/Orders";
import { usePreOrders } from "@/stores/PreOrders";
import { useValidation } from "@/composables/useValidation";
import { useUserStore } from "@/stores/User";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import TabDead from "@/components/Block/Tabs/TabDead.vue";
import TabMaterials from "@/components/Block/Tabs/TabMaterials.vue";
import TabTypeWork from "@/components/Block/Tabs/TabTypeWork.vue";
import TabServices from "@/components/Block/Tabs/TabServices.vue";
import TabPhotos from "@/components/Block/Tabs/TabPhotos/index.vue";
import TheTabs from "@/components/Block/TheTabs.vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const store = useOrders();
const storePreOrder = usePreOrders();
const userStore = useUserStore();
const { validateCustomerData, validationTable } = useValidation($q);

const accountNumber = ref(route.query.accountNumber);
const currentTab = ref("Умерший");

const dataTable = reactive(
  store.getSavedDraft() || {
    customer: {
      name: "",
      first_name: "",
      second_name: "",
      phone: "",
      address: "",
      comment: "",
      status: "new",
    },

    rowsDead: [
      {
        id: crypto.randomUUID(),
        accountNumber: 1,
        deadName: "",
        deadSecondName: "",
        deadSurName: "",
        deadDateBirth: "",
        deadDateDeath: "",
      },
    ],

    rowsMaterials: [
      {
        id: crypto.randomUUID(),
        accountNumber: 1,
        name: "Выбрать",
        quantity: 1,
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
    rowsPhotos: { carvings: [], artistic: [] },
  }
);
const finalPrice = ref(0);
const isProcessing = ref(false);
const isOrderCreated = ref(route.query.isCreated === "false");
const isMoved = ref(route.query.isMoved === "true");
const isPublic = ref(false);
const order = ref({});
const prepayment = ref(0);
const sale = ref(0);
const selectedSource = ref("Магазин");
const source = ["Google", "Facebook", "Instagram", "Рекомендация", "Магазин"];

const tabs = [
  { name: "Умерший" },
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
  { name: "Фото" },
];
const totalPrice = ref(0);

const calcFinalPrice = (event, name) => {
  const value = event.target.value.replace(/\D/g, "");

  switch (name) {
    case "prepayment":
      prepayment.value = value;
      break;

    case "sale":
      sale.value = value;
      break;
  }

  formatCurrency(
    (finalPrice.value = Math.max(
      0,
      totalPrice.value - prepayment.value - sale.value
    ))
  );
};
const formatCurrency = (value) => {
  return parseFloat(value || 0).toLocaleString("ru-RU");
};

const activeTabComponent = computed(() => {
  switch (currentTab.value) {
    case "Материалы":
      return TabMaterials;

    case "Умерший":
      return TabDead;

    case "Виды работ":
      return TabTypeWork;

    case "Услуги":
      return TabServices;

    case "Фото":
      return TabPhotos;
  }
});
const activeTabProps = computed(() => {
  switch (currentTab.value) {
    case "Умерший":
      return { rows: dataTable.rowsDead };

    case "Материалы":
      return { rows: dataTable.rowsMaterials, isCreated: isOrderCreated.value };
    case "Виды работ":
      return { rows: dataTable.rowsWorks };
    case "Услуги":
      return { rows: dataTable.rowsServices };
    case "Фото":
      return { rows: dataTable.rowsPhotos };
    default:
      return {};
  }
});
const formatFinalPrice = computed(() => {
  return formatCurrency(finalPrice.value);
});
const formattedPrepayment = computed(() => {
  return formatCurrency(prepayment.value);
});
const formatSale = computed(() => {
  return formatCurrency(sale.value);
});
const formatTotalPrice = computed(() => {
  return formatCurrency(totalPrice.value);
});

onMounted(async () => {
  userStore.loadUserFromStorage();

  const savedData = store.getSavedDraft();

  if (savedData) {
    Object.assign(dataTable, savedData);

    totalPrice.value = savedData.totalPrice;
    prepayment.value = savedData.prepayment;
    finalPrice.value = savedData.finalPrice;
    sale.value = savedData.sale;
    $q.notify({
      message: "Черновик заказа восстановлен",
      color: "positive",
      icon: "restore",
      position: "top-right",
      timeout: 2000,
    });

    return;
  }

  if (isOrderCreated.value) {
    // await getOrder();

    await distributeData();
  }

  if (isMoved.value) {
    addMovedOrder();
  }
});

function addItem(tableName, item) {
  if (tableName === "rowsWorks") {
    dataTable.rowsWorks.push(item);
  } else {
    dataTable[tableName].push(
      reactive({
        id: crypto.randomUUID(),
        accountNumber: dataTable[tableName].length + 1,
        name: "Выбрать",
        quantity: 1,
        price: 0,
      })
    );
  }
}
function addPhoto(data, type) {
  dataTable.rowsPhotos[type] = data;
}
function addMovedOrder() {
  const { address, comment, first_name, second_name, name, phone } =
    storePreOrder.movedPreOrders;

  totalPrice.value = storePreOrder.movedPreOrders.totalPrice;
  dataTable.customer = {
    address,
    comment,
    first_name,
    second_name,
    name,
    phone,
    status: "new",
  };

  dataTable.rowsMaterials = storePreOrder.movedPreOrders.PreOrderMaterials;
  dataTable.rowsServices = storePreOrder.movedPreOrders.PreOrderServices;
  dataTable.rowsWorks = storePreOrder.movedPreOrders.PreOrderWorks;
}
function addSelectedValue(val, table) {
  const idx = dataTable[table].findIndex((el) => el.id === val.id);

  dataTable[table][idx] = val;

  calcTotalPrice();
}
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

  formatCurrency((finalPrice.value = totalPrice.value));
}
function changeTab(name) {
  currentTab.value = name;
}
function createCell(table, val, id) {
  dataTable[table] = val;

  calcTotalPrice();
}
function generatePDF() {
  const rowsMaterials = ref([
    { id: crypto.randomUUID(), header: "На стеле" },
    { id: crypto.randomUUID(), header: "На плите" },
    ...dataTable.rowsWorks,
  ]);

  const sortedRows = computed(() => {
    const headers = rowsMaterials.value.filter((row) => row.header);
    const result = reactive([]);

    headers.forEach((header) => {
      result.push(header);
      const relatedRows = rowsMaterials.value.filter(
        (row) => row.parentTitle === header.header
      );
      result.push(...relatedRows);
    });

    return result;
  });

  const docDefinition = {
    content: [
      {
        stack: [
          {
            text: "Запорожье",
            alignment: "left",
            fontSize: 10,
            margin: [0, 0, 0, 5],
          },
          {
            text: "вул Космическая 63",
            alignment: "left",
            fontSize: 10,
            margin: [0, 0, 0, 5],
          },
          {
            text: "+380(50) 852 05 94",
            alignment: "left",
            fontSize: 10,
          },
        ],
        width: "auto",
      },
      { text: "Заказ №1", style: "header", alignment: "center" },

      { text: `${order.value.name}`, style: "header", alignment: "center" },

      {
        columns: [
          {
            text: `Заказчик`,
            style: "subheader",
            margin: [0, 0, 0, 5],
          },
        ],
      },

      {
        text: `Имя: ${order.value.first_name || "Не указано"}`,
        margin: [0, 0, 0, 5],
      },

      {
        text: `Фамилия: ${order.value.second_name || "Не указано"}`,
        margin: [0, 0, 0, 5],
      },
      {
        text: `Телефон: ${order.value.phone || "Не указано"}`,
        margin: [0, 0, 0, 5],
      },
      {
        text: `Адрес доставки: ${order.value.address || "Не указано"}`,
        margin: [0, 0, 0, 5],
      },
      {
        text: `Примечание: ${order.value.comment || "Нет"}`,
        margin: [0, 0, 0, 5],
      },

      { text: "Умерший", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*"],
          body: [
            [
              "Номер",
              "Имя",
              "Фамилия",
              "Отчество",
              "Дата рождения",
              "Дата смерти",
            ],
            ...dataTable.rowsDead.map((row, index) => [
              index + 1,
              row.deadName,
              row.deadSecondName,
              row.deadSurName,
              row.deadDateBirth,
              row.deadDateDeath,
            ]),
          ],
        },

        layout: "grid",
      },

      { text: "Материалы", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...dataTable.rowsMaterials.map((row, index) => [
              index + 1,
              row.name || "Не указано",
              row.price || "0",
            ]),
          ],
        },
        layout: "grid",
      },

      { text: "Услуги", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...dataTable.rowsServices.map((row, index) => [
              index + 1,
              row.name || "Не указано",
              row.price || "0",
            ]),
          ],
        },
        layout: "grid",
      },

      { text: "Виды работ", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto"],
          body: [
            ["Номер", "Название", "Цена"],
            ...sortedRows.value.flatMap((row, index, array) => {
              if (row.header) {
                return [
                  [
                    {
                      text: row.header,
                      colSpan: 3,
                      bold: true,
                      alignment: "left",
                    },
                    {},
                    {},
                  ],
                ];
              } else {
                const rowIndex = array
                  .slice(0, index)
                  .filter((item) => !item.header).length;
                return [
                  [rowIndex + 1, row.name || "Не указано", row.price || "0"],
                ];
              }
            }),
          ],
        },
        layout: "grid",
      },

      { text: "Финансовая информация", style: "subheader" },
      ,
      {
        table: {
          headerRows: 0,
          widths: ["*", "*"],
          body: [
            [
              { text: "Общая сумма", alignment: "left" },
              {
                text:
                  (Number(totalPrice.value) || 0).toLocaleString("ru-RU") +
                  " грн",
                alignment: "right",
              },
            ],
            [
              { text: "Скидка", alignment: "left" },
              {
                text:
                  "-" +
                  (Number(sale.value) || 0).toLocaleString("ru-RU") +
                  " грн",
                alignment: "right",
              },
            ],
            [
              { text: "Предоплата", alignment: "left" },
              {
                text:
                  (Number(prepayment.value) || 0).toLocaleString("ru-RU") +
                  " грн",
                alignment: "right",
              },
            ],
            [
              {
                text: "Итоговая сумма",
                alignment: "left",
                bold: true,
                fontSize: 12,
              },
              {
                text:
                  (Number(finalPrice.value) || 0).toLocaleString("ru-RU") +
                  " грн",
                alignment: "right",
                bold: true,
                fontSize: 14,
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 15, 0, 10],
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download(`${accountNumber.value}.pdf`);
}
function selectSource(select) {
  selectSource.value = select;
}
function removeItem(table, id) {
  const idx = dataTable[table].findIndex((el) => el.id === id);

  if (idx !== -1) {
    dataTable[table].splice(idx, 1);

    dataTable[table].forEach((item, index) => {
      item.accountNumber = index + 1;
    });
  }

  calcTotalPrice();
}

function updateInput(table, id, row, fieldName) {
  const idx = dataTable[table].findIndex((el) => el.id === id);
  const key = Object.keys(row).find((k) => row[k] === fieldName);

  if (table === "rowsWorks") {
    dataTable[table][idx][key] = row[key];
  } else {
    dataTable[table][idx][fieldName] = row[fieldName];
  }

  calcTotalPrice();
}
function sortPhotos(orderPhotoLinks) {
  const sorted = orderPhotoLinks.map((photo) => {
    dataTable.rowsPhotos[photo.type].push(photo);
  });

  return {
    carvings: sorted.carvings || [],
    artistic: sorted.artistic || [],
  };
}

async function distributeData() {
  await store.getOrdersById(route.query.id);

  order.value = store.oneOrder;
  finalPrice.value = order.value.pay;
  prepayment.value = order.value.prepayment;
  sale.value = order.value.sale;
  totalPrice.value = +order.value.totalPrice;
  isPublic.value = order.value.isPublic;

  const { address, comment, first_name, second_name, name, phone } =
    order.value;

  dataTable.customer = {
    address,
    comment,
    first_name,
    second_name,
    name,
    phone,
  };
  dataTable.rowsDead = order.value.OrderDeads;
  dataTable.rowsMaterials = order.value.OrderMaterials;
  dataTable.rowsServices = order.value.OrderServices;
  dataTable.rowsWorks = order.value.OrderWorks;
  sortPhotos(order.value.OrderPhotoLinks);
}

function validateOrderData() {
  const isCustomerValid = validateCustomerData(dataTable.customer);

  const isTablesValid = [validationTable(dataTable.rowsDead, "Умерший")].every(
    (isValid) => isValid
  );

  return isCustomerValid && isTablesValid;
}

const saveDraftToLocalStorage = () => {
  localStorage.setItem(
    "orderDraft",
    JSON.stringify({
      ...dataTable,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      isDraft: true,
      isPublic: isPublic.value,
      totalPrice: totalPrice.value,
      finalPrice: finalPrice.value,
      sale: sale.value,
      status: "new",
      prepayment: prepayment.value,
    })
  );
};

watch(
  [dataTable, prepayment, sale, totalPrice, finalPrice],
  () => {
    saveDraftToLocalStorage();
  },
  { deep: true }
);

async function saveOrder() {
  isProcessing.value = true;

  // if (!validateOrderData()) {
  //   isProcessing.value = false;
  //   return;
  // }

  const order = {
    id: crypto.randomUUID(),
    ...dataTable.customer,
    source: selectedSource.value,
    prepayment: prepayment.value,
    pay: finalPrice.value,
    sale: sale.value,
    status: "new",
    totalPrice: totalPrice.value,
    storeAddress: userStore.user.address,
    isPublic: true,
    currentData: store.getCurrentDate(),

    dataTable: {
      rowsDead: dataTable.rowsDead,
      rowsMaterials: dataTable.rowsMaterials,
      rowsServices: dataTable.rowsServices,
      rowsWorks: dataTable.rowsWorks,
      rowsPhotos: dataTable.rowsPhotos,
    },
  };

  try {
    if (!isOrderCreated.value) {
      await store.createOrder(
        order,
        order.dataTable.rowsDead,
        order.dataTable.rowsMaterials,
        order.dataTable.rowsServices,
        order.dataTable.rowsWorks,
        order.dataTable.rowsPhotos
      );

      store.clearDraft();

      if (isMoved.value) {
        await store.movePreOrderToOrder(route.query.preOrderId);
      }

      router.push("/orders");
    } else {
      await store.updateOrder(
        route.query.id,
        order,
        order.dataTable.rowsDead,
        order.dataTable.rowsMaterials,
        order.dataTable.rowsServices,
        order.dataTable.rowsWorks,
        order.dataTable.rowsPhotos
      );
    }

    isOrderCreated.value = false;
    isProcessing.value = false;

    router.push("/orders");
  } catch (error) {
    $q.notify({
      message: `Ошибка: ${error.response?.data?.message || error.message}`,
      color: "negative",
      icon: "error",
      position: "top-right",
      timeout: 3000,
    });
    console.error("Помилка при збереженні замовлення:", error);
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <q-breadcrumbs class="text-grey-8 breadcrumbs" align="left">
    <template #separator>
      <q-icon name="chevron_right" color="grey" />
    </template>

    <q-breadcrumbs-el to="/orders" clickable> Заказы </q-breadcrumbs-el>
    <q-breadcrumbs-el to="/create" clickable>
      Заказ {{ accountNumber }} ({{ dataTable.customer.name }})
    </q-breadcrumbs-el>
  </q-breadcrumbs>

  <div class="table__wrapper">
    <UiTextH1>Заказ №{{ accountNumber }}</UiTextH1>

    <div>
      <UiTextH2 class="table__title">Название продукта</UiTextH2>

      <q-input
        class="input"
        stack-label
        v-model="dataTable.customer.name"
        label="Название"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Введите название']"
      ></q-input>
    </div>

    <div class="tabs">
      <TheTabs
        v-for="tab in tabs"
        :key="tab.name"
        @click="changeTab(tab.name)"
        :selectedTab="currentTab"
        :name="tab.name"
        >{{ tab.name }}</TheTabs
      >
    </div>

    <keep-alive>
      <component
        :is="activeTabComponent"
        v-bind="activeTabProps"
        @addItem="addItem"
        @selectValue="addSelectedValue"
        @updateInput="updateInput"
        @createCell="createCell"
        @remove="removeItem"
        @updateParents="addPhoto"
      />
    </keep-alive>

    <div class="q-pa-md">
      <UiTextH2 class="table__title">Заказчик</UiTextH2>

      <div class="wrapper">
        <div class="customer">
          <q-input
            stack-label
            v-model="dataTable.customer.first_name"
            label="Имя заказчика"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Введите имя']"
          ></q-input>

          <q-input
            stack-label
            v-model="dataTable.customer.second_name"
            label="Фамилия заказчика"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Введите фамилию']"
          ></q-input>

          <q-input
            stack-label
            v-model="dataTable.customer.comment"
            label="Примечание"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Введите коментирие к заказу',
              (val) => val.length >= 3 || 'Минимум 3 символа',
            ]"
          ></q-input>
        </div>

        <div class="customer">
          <q-input
            stack-label
            v-model="dataTable.customer.phone"
            label="Номер телефону *"
            lazy-rules
            mask="+380(##)-###-##-##"
            :rules="[
              (val) => (val !== null && val !== '') || 'Введите номер телефона',
              (val) =>
                /^\+380\(\d{2}\)-\d{3}-\d{2}-\d{2}$/.test(val) ||
                'Неправильний формат номеру телефону',
            ]"
            type="tel"
          ></q-input>

          <q-input
            stack-label
            v-model="dataTable.customer.address"
            label="Aдрес доставки"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Введите адрес']"
          ></q-input>

          <q-select
            v-model="selectedSource"
            :options="source"
            label="Источник"
            @update:model-value="selectSource(selectedSource)"
          ></q-select>
        </div>
      </div>
    </div>

    <div class="total-summary">
      <div class="total-summary__row">
        <span>Общая сумма</span>
        <span>{{ formatTotalPrice }} ₴</span>
      </div>
      <div class="total-summary__row">
        <span>Скидка</span>
        <div>
          <input
            placeholder="0"
            class="input-price"
            v-model.number="formatSale"
            @input="(event) => calcFinalPrice(event, 'sale')"
          />
          ₴
        </div>
      </div>
      <div class="total-summary__row">
        <span>Предоплата</span>
        <div>
          <input
            placeholder="0"
            class="input-price"
            v-model.number="formattedPrepayment"
            @input="(event) => calcFinalPrice(event, 'prepayment')"
          />
          ₴
        </div>
      </div>
      <div class="total-summary__row total-summary__row--final">
        <span>Итоговая сумма</span>
        <span>{{ formatFinalPrice }} ₴</span>
      </div>
    </div>

    <div class="button-group">
      <q-btn
        :disable="isProcessing"
        label="Сохранить"
        icon="save"
        color="primary"
        class="q-mr-sm"
        @click="saveOrder"
      />

      <q-btn
        @click="generatePDF"
        label="Сгенерировать PDF"
        icon="picture_as_pdf"
        color="red"
        class="q-mr-sm"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table__wrapper {
  gap: 30px;
  display: flex;
  padding-top: 20px;
  flex-direction: column;

  h1 {
    font-size: 34px;
    font-weight: 600;
    text-align: center;
  }
}

.form {
  display: flex;
  flex-direction: column;
}

.wrapper {
  gap: 50px;
  display: flex;

  .customer {
    gap: 15px;
    width: 100%;
    display: flex;
    flex-direction: column;

    h2 {
      font-weight: 500;
    }
  }

  .info-by-order {
    gap: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;

    h2 {
      font-weight: 500;
    }
  }
}

.table__title {
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 100px;
}

.button {
  margin-bottom: 15px;
}

.input {
  width: 300px;
  margin: 0 auto;
}

.q-td {
  height: 50px;
  overflow-y: auto;
  position: relative;
}

.tabs {
  display: flex;
  position: relative;
  align-items: center;
  padding: 64px 0 34px 0;
  justify-content: space-around;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
}

.total-summary {
  gap: 10px;
  display: flex;
  font-size: 18px;
  padding: 0 50px;
  flex-direction: column;

  &__row {
    display: flex;
    padding: 5px 0;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }

    &--final {
      font-size: 20px;
      margin-top: 10px;
      font-weight: bold;
    }
  }

  .input-price {
    padding: 5px;
    width: 100px;
    font-size: 18px;
    text-align: right;
  }
}

.button-group {
  display: flex;
  padding-top: 50px;
  justify-content: end;
  border-top: 2px grey solid;
}
</style>
