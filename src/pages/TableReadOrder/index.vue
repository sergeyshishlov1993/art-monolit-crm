<script setup>
import axios from "axios";
import { ref, reactive, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useOrders } from "@/stores/Orders";

import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiTextH2 from "@/components/Ui/UiTextH2.vue";
import TheTabs from "@/components/Block/TheTabs.vue";

import TabCustomer from "./components/Tabs/TabCustomer.vue";
import TabMaterials from "./components/Tabs/TabMaterials.vue";
import TabTypeWork from "./components/Tabs/TabTypeWork.vue";
import TabServices from "./components/Tabs/TabServices.vue";
import TabDead from "./components/Tabs/TabDead.vue";
import TabPhotos from "@/components/Block/Tabs/TabPhotos/index.vue";

const route = useRoute();

const activeTabComponent = computed(() => {
  switch (currentTab.value) {
    case "Заказчик":
      return TabCustomer;

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
    case "Заказчик":
      return { rows: dataTable.rowsCustomer };

    case "Умерший":
      return { rows: dataTable.rowsDead };

    case "Материалы":
      return { rows: dataTable.rowsMaterials };
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
const accountNumber = ref(route.query.accountNumber);
const currentTab = ref("Заказчик");

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

const store = useOrders();

const tabs = [
  { name: "Заказчик" },
  { name: "Умерший" },
  { name: "Материалы" },
  { name: "Виды работ" },
  { name: "Услуги" },
  { name: "Фото" },
];

onMounted(async () => {
  await store.getOrdersById(route.query.id);
  sortDataOrder();
});

function changeTab(name) {
  currentTab.value = name;
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

function sortDataOrder() {
  dataTable.rowsDead = store.rows.OrderDeads;
  dataTable.rowsMaterials = store.rows.OrderMaterials;
  dataTable.rowsServices = store.rows.OrderServices;
  dataTable.rowsWorks = store.rows.OrderWorks;
  sortPhotos(store.rows.OrderPhotoLinks);
  dataTable.rowsCustomer = {
    id: store.rows.id,
    firstName: store.rows.first_name,
    secondName: store.rows.second_name,
    phone: store.rows.phone,
    address: store.rows.address,
    comment: store.rows.comment,
    createdAt: new Date(store.rows.createdAt),
  };
}
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
      <UiTextH2 class="table__title">{{ store.rows.name }}</UiTextH2>
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
