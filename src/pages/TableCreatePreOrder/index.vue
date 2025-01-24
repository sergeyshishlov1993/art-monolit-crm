<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { usePreOrders } from "@/stores/PreOrders";
import axios from "axios";

import TabMaterials from "@/components/Block/Tabs/TabMaterials.vue";
import TabTypeWork from "@/components/Block/Tabs/TabTypeWork.vue";
import TabServices from "@/components/Block/Tabs/TabServices.vue";
import TheTabs from "@/components/Block/TheTabs.vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const accountNumber = ref(route.query.accountNumber);
const currentTab = ref("");
const dataTable = reactive({
  customer: {
    name: "",
    first_name: "",
    second_name: "",
    phone: "",
    address: "",
    comment: "",
    status: "new",
  },

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
});
const finalPrice = ref(0);
const isProcessing = ref(false);
const isOrderCreated = ref(route.query.isCreated === "false");
const order = ref({});
const selectedSource = ref("Магазин");
const source = ["Google", "Facebook", "Instagram", "Рекомендация", "Магазин"];
const storePreOrder = usePreOrders();
const tabs = [
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
];
const totalPrice = ref(0);

const formatCurrency = (value) => {
  return parseFloat(value || 0).toLocaleString("ru-RU");
};

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
const activeTabProps = computed(() => {
  switch (currentTab.value) {
    case "Материалы":
      return { rows: dataTable.rowsMaterials, isCreated: isOrderCreated.value };
    case "Виды работ":
      return { rows: dataTable.rowsWorks };
    case "Услуги":
      return { rows: dataTable.rowsServices };
    default:
      return {};
  }
});
const formatFinalPrice = computed(() => {
  return formatCurrency(finalPrice.value);
});

onMounted(async () => {
  if (isOrderCreated.value) {
    await getOrder();
  }

  // if (isMoved.value) {
  //   const { address, comment, first_name, second_name, name, phone } =
  //     storePreOrder.movedPreOrders;

  //   totalPrice.value = storePreOrder.movedPreOrders.totalPrice;
  //   dataTable.customer = {
  //     address,
  //     comment,
  //     first_name,
  //     second_name,
  //     name,
  //     phone,
  //     status: "new",
  //   };

  //   dataTable.rowsMaterials = storePreOrder.movedPreOrders.PreOrderMaterials;
  //   dataTable.rowsServices = storePreOrder.movedPreOrders.PreOrderServices;
  //   dataTable.rowsWorks = storePreOrder.movedPreOrders.PreOrderWorks;
  // }
});

function addItem(tableName, item) {
  // console.log("ADD ITEM", item);
  // if (tableName === "rowsWorks") {
  //   dataTable.rowsWorks.push(item);
  // } else {
  //   dataTable[tableName].push(
  //     reactive({
  //       id: crypto.randomUUID(),
  //       accountNumber: dataTable[tableName].length + 1,
  //       name: "Выбрать",
  //       quantity: 1,
  //       price: 0,
  //     })
  //   );
  // }

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

  dataTable[table][idx][fieldName] = row[fieldName];

  calcTotalPrice();
}

async function getOrder() {
  const response = await axios.get(
    `http://localhost:8000/pre-orders/${route.query.id}`
  );

  console.log("RESPONSE PRE ORDERS", response);

  order.value = response.data.order;
  finalPrice.value = +order.value.totalPrice;

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
  dataTable.rowsMaterials = order.value.PreOrderMaterials;
  dataTable.rowsServices = order.value.PreOrderServices;
  dataTable.rowsWorks = order.value.PreOrderWorks;
}

async function saveOrder() {
  isProcessing.value = true;

  const order = {
    id: crypto.randomUUID(),
    ...dataTable.customer,
    isDraft: true,
    isPublick: false,
    source: selectedSource.value,
    totalPrice: totalPrice.value,
    currentData: storePreOrder.getCurrentDate(),

    dataTable: {
      rowsMaterials: dataTable.rowsMaterials,
      rowsServices: dataTable.rowsServices,
      rowsWorks: dataTable.rowsWorks,
    },
  };

  try {
    isProcessing.value = true;
    if (!isOrderCreated.value) {
      const response = await axios.post(
        "http://localhost:8000/pre-orders/create-preorder",
        {
          preOrderData: order,
          preOrderMaterials: order.dataTable.rowsMaterials,
          preOrderServices: order.dataTable.rowsServices,
          preOrderWorks: order.dataTable.rowsWorks,
        }
      );

      $q.notify({
        message: "Замовлення створено успішно!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });

      router.push("/calculate");
    } else {
      isProcessing.value = true;
      const response = await axios.put(
        `http://localhost:8000/pre-orders/update-preorder/${route.query.id}`,
        {
          preOrderData: order,
          preOrderMaterials: order.dataTable.rowsMaterials,
          preOrderServices: order.dataTable.rowsServices,
          preOrderWorks: order.dataTable.rowsWorks,
        }
      );

      $q.notify({
        message: "Замовлення оновлено успішно!",
        color: "positive",
        icon: "check_circle",
        position: "top-right",
        timeout: 2500,
      });
    }

    isOrderCreated.value = false;
    isProcessing.value = false;

    router.push("/calculate");
  } catch (error) {
    $q.notify({
      message: `Помилка: ${error.response?.data?.message || error.message}`,
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
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
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
      />
    </keep-alive>

    <div class="q-pa-md">
      <UiTextH2 class="table__title customer">Заказчик</UiTextH2>

      <div class="wrapper">
        <div class="customer">
          <q-input
            stack-label
            v-model="dataTable.customer.first_name"
            label="Имя заказчика"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="dataTable.customer.second_name"
            label="Фамилия заказчика"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          ></q-input>

          <q-input
            stack-label
            v-model="dataTable.customer.comment"
            label="Примечание"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
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
            v-model="dataTable.customer.address"
            label="Aдрес доставки"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table__wrapper {
  padding-top: 20px;

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
    gap: 15px;
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

.customer {
  text-align: justify;
  font-weight: 600;
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

.total-summary {
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding: 5px 0;

    &:last-child {
      border-bottom: none;
    }

    &--final {
      font-weight: bold;
      font-size: 20px;
      margin-top: 10px;
    }
  }

  .input-price {
    width: 100px;
    text-align: right;
    font-size: 18px;
    padding: 5px;
  }
}

.button-group {
  display: flex;
  justify-content: end;
  border-top: 2px grey solid;
  padding-top: 50px;
}
</style>
