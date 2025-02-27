<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useOrders } from "@/stores/Orders";
import { usePreOrders } from "@/stores/PreOrders";
import { useUserStore } from "@/stores/User";

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

const accountNumber = ref(route.query.accountNumber);
const currentTab = ref("Умерший");

const dataTable = reactive({
  customer: {
    name: "",
    first_name: "",
    second_name: "",
    phone: "",
    address: "",
    comment: "",
    status: "new",
    isPublic: false,
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
});

const isPublic = ref(false);
const order = ref({});
const orderNumber = ref();
const selectedSource = ref("Магазин");
const source = ["Google", "Facebook", "Instagram", "Рекомендация", "Магазин"];

const tabs = [
  { name: "Умерший" },
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
  { name: "Фото" },
];

import { useOrderManagement } from "./composables/useOrderManagement";
import { useCalcTotalPrice } from "./composables/useCalcTotalPrice";
import { useTableManagement } from "./composables/useTableManagement";
import { usePDFGenerator } from "./composables/usePDFGenerator";
import { useValidationOrder } from "./composables/useValidationOrder";

const { isValid } = useValidationOrder(dataTable.customer);

const {
  calcFinalPrice,
  calcTotalPrice,
  formatFinalPrice,
  formattedPrepayment,
  formatSale,
  formatTotalPrice,
  totalPrice,
  finalPrice,
  sale,
  prepayment,
} = useCalcTotalPrice(dataTable);

const {
  addItem,
  removeItem,
  updateInput,
  createCell,
  addSelectedValue,
  saveState,
} = useTableManagement(dataTable, calcTotalPrice);

const {
  addMovedOrder,
  saveOrder,
  isProcessing,
  isMoved,
  isOrderCreated,
  sortPhotos,
  addPhoto,
} = useOrderManagement(
  dataTable,
  store,
  $q,
  selectedSource,
  userStore,
  totalPrice,
  finalPrice,
  prepayment,
  sale,
  route,
  router,
  isValid,
  isPublic
);

const { generatePDF } = usePDFGenerator(
  accountNumber,
  dataTable,
  totalPrice,
  prepayment,
  sale,
  finalPrice,
  orderNumber
);

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

const handleSaveShortcut = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    if (!isProcessing.value) {
      saveOrder();
    }
  }
};

onMounted(async () => {
  window.addEventListener("keydown", handleSaveShortcut);
  userStore.loadUserFromStorage();

  if (isOrderCreated.value) {
    await distributeData();

    store.clearDraft();
  }

  const savedData = store.getSavedDraft();
  if (!order.value.isPublic && savedData) {
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

  if (isMoved.value) {
    addMovedOrder(storePreOrder.movedPreOrders);
  }
});

if (isMoved.value) {
  addMovedOrder(storePreOrder.movedPreOrders);
}

function changeTab(name) {
  currentTab.value = name;
}

function selectSource(select) {
  selectedSource.value = select;
}

async function distributeData() {
  await store.getOrdersById(route.query.id);

  order.value = store.oneOrder;
  finalPrice.value = order.value.pay;
  prepayment.value = order.value.prepayment;
  sale.value = order.value.sale;
  totalPrice.value = +order.value.totalPrice;
  orderNumber.value = order.value.order_number;

  const { address, comment, first_name, second_name, name, phone, isPublic } =
    order.value;
  dataTable.customer = {
    address,
    comment,
    first_name,
    second_name,
    name,
    phone,
    isPublic,
  };
  dataTable.rowsDead = order.value.OrderDeads;
  dataTable.rowsMaterials = order.value.OrderMaterials;
  dataTable.rowsServices = order.value.OrderServices;
  dataTable.rowsWorks = order.value.OrderWorks;
  sortPhotos(order.value.OrderPhotoLinks);
}

onUnmounted(() => {
  window.removeEventListener("keydown", handleSaveShortcut);
});
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
    <UiTextH1
      >Заказ №{{
        orderNumber ? String(orderNumber).toUpperCase() : "Новый"
      }}</UiTextH1
    >

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
      >
        {{ tab.name }}
      </TheTabs>
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
        @updateRows="saveState"
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
            :value="formatSale"
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
            :value="formattedPrepayment"
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
