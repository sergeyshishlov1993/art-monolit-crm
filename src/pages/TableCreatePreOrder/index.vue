<script setup>
import { reactive, onMounted } from "vue";
import { useOrderData } from "./composables/useOrderData";
import { usePriceCalculation } from "./composables/usePriceCalculation";
import { useTabsManagement } from "./composables/useTabsManagement";
import { useTableManagement } from "./composables/useTableManagement";
import { useOrderActions } from "./composables/useOrderActions";
import { useUserStore } from "@/stores/User";
import { useValidationOrder } from "./composables/useValidationOrder";
import TheTabs from "@/components/Block/TheTabs.vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";

const userStore = useUserStore();
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

const {
  getOrder,
  accountNumber,
  selectedSource,
  source,
  isOrderCreated,
  selectSource,
  finalPrice,
  isPublic,
} = useOrderData(dataTable);

const { totalPrice, formatFinalPrice, calcTotalPrice, formatCurrency } =
  usePriceCalculation(dataTable, isOrderCreated);

const { currentTab, tabs, changeTab, activeTabComponent, activeTabProps } =
  useTabsManagement(dataTable, isOrderCreated);

const { addItem, addSelectedValue, updateInput, createCell, removeItem } =
  useTableManagement(dataTable, calcTotalPrice);

const { isValid } = useValidationOrder(dataTable);
const { isProcessing, saveOrder } = useOrderActions(
  dataTable,
  userStore,
  selectedSource,
  totalPrice,
  isOrderCreated,
  isValid,
  isPublic
);

onMounted(async () => {
  if (isOrderCreated.value && isPublic.value) {
    await getOrder();
  }
});
</script>

<template>
  <q-breadcrumbs class="text-grey-8 breadcrumbs" align="left">
    <template #separator>
      <q-icon name="chevron_right" color="grey" />
    </template>

    <q-breadcrumbs-el to="/calculate" clickable> Просчеты </q-breadcrumbs-el>
    <q-breadcrumbs-el to="/order-estimation" clickable>
      Просчет {{ accountNumber }} ({{ dataTable.customer.name }})
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

        <span
          >{{
            formatFinalPrice === "0"
              ? formatCurrency(finalPrice)
              : formatFinalPrice
          }}
          ₴</span
        >
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
