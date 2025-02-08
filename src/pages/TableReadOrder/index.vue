<script setup>
import { useOrderTabs } from "./composables/useOrderTabs";
import { useOrderData } from "./composables/useOrderData";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";
import TheTabs from "@/components/Block/TheTabs.vue";

const route = useRoute();
const dataTable = reactive({
  rowsCustomer: [
    {
      name: "",
      first_name: "",
      second_name: "",
      phone: "",
      address: "",
      comment: "",
    },
  ],
  rowsCustomer: [
    {
      id: crypto.randomUUID(),
      accountNumber: 1,
      customerName: "",
      customerSecondName: "",
      customerPhone: "",
    },
  ],
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

const { store } = useOrderData(dataTable);
const { currentTab, activeTabComponent, activeTabProps, changeTab } =
  useOrderTabs(dataTable);

const accountNumber = ref(route.query.accountNumber);

const tabs = [
  { name: "Заказчик" },
  { name: "Умерший" },
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
  { name: "Фото" },
];
</script>

<template>
  <q-breadcrumbs class="text-grey-8 breadcrumbs" align="left">
    <template #separator>
      <q-icon name="chevron_right" color="grey" />
    </template>

    <q-breadcrumbs-el to="/orders" clickable> Заказы </q-breadcrumbs-el>
    <q-breadcrumbs-el to="/create" clickable>
      Заказ {{ accountNumber }} ({{ store.rows.name }})
    </q-breadcrumbs-el>
  </q-breadcrumbs>

  <div class="table__wrapper">
    <UiTextH1>Заказ №{{ accountNumber }}</UiTextH1>

    <div>
      <UiTextH2 class="table__title">{{ store.oneOrder.name }}</UiTextH2>
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
      />
    </keep-alive>
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

.total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;

  .input-price {
    width: 80px;
    text-align: center;
  }
}

.button-group {
  display: flex;
  justify-content: end;
  border-top: 2px grey solid;
  padding-top: 50px;
}
</style>
