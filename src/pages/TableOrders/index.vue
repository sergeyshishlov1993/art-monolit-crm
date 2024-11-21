<template>
  <div class="table__wrapper">
    <ui-text-h1>Заказы</ui-text-h1>

    <div class="settings">
      <q-btn color="green" icon="add" round dense @click="addItem"></q-btn>
      <calendar />

      <q-select
        filled
        v-model="select"
        :options="statusOptions"
        class="select"
      ></q-select>

      <ui-input />
    </div>

    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Заказы"
        :rows="rows"
        :columns="columns"
        row-key="accountNumber"
      >
        <!-- Слот для селекту в колонці "Статус" -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.status"
              :options="statusOptions"
              dense
              outlined
              emit-value
              map-options
              @update:model-value="updateStatus(props.row)"
            ></q-select>
          </q-td>
        </template>

        <!-- Слот для кнопки видалення в колонці "Удалить" -->
        <template v-slot:body-cell-action="props">
          <q-td :props="props" class="text-center">
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              @click="removeItem(props.row)"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import UiInput from "@/components/Ui/UiInput.vue";
import Calendar from "./components/Calendar.vue";

const select = ref("Новый");
const router = useRouter();

const rows = ref([
  {
    accountNumber: 1,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 2,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 3,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 4,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 5,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 6,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 7,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },

  {
    accountNumber: 8,
    firs_name: "Анатолий",
    second_name: "Иванов",
    phone: "+380994755711",
    name: "Ангел (серый)",
    price: 27900,
    status: "new",
    action: "",
    date: "12.06.2024",
  },
]);

const columns = [
  {
    name: "accountNumber",
    required: true,
    label: "Номер Заказа",
    align: "start",
    field: "accountNumber",
    sortable: true,
  },
  {
    name: "firs_name",
    align: "start",
    label: "Имя",
    field: "firs_name",
    sortable: true,
  },
  {
    name: "second_name",
    align: "start",
    label: "Фамилия",
    field: "second_name",
    sortable: true,
  },
  { name: "phone", align: "start", label: "Телефон", field: "phone" },
  { name: "name", align: "start", label: "Названия Заказа", field: "name" },
  { name: "price", align: "start", label: "Цена", field: "price" },
  {
    name: "status",
    label: "Статус",
    align: "start",
    field: "status",
  },
  {
    name: "action",
    align: "center",
    label: "Удалить",
    field: "action",
  },
  {
    name: "date",
    label: "Дата",
    align: "start",
    field: "date",
    sortable: true,
  },
];

const statusOptions = [
  { label: "Новый", value: "new" },
  { label: "Принят", value: "accepted" },
  { label: "В роботе", value: "atWork" },
  { label: "Завершен", value: "completed" },
];

function addItem() {
  router.push("/create");
}

function updateStatus(row) {
  console.log("Status updated for:", row);
}

function removeItem(row) {
  console.log("Item removed:", row);
  // Тут можна додати логіку для видалення рядка з таблиці
}
</script>

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
  gap: 50px;
}

.settings {
  display: flex;
  align-items: center;
  gap: 50px;

  .select {
    width: 190px;
    white-space: nowrap;
  }

  input {
    width: 300px;
  }
}

.q-table__middle {
  text-align: center;
}

.q-table__bottom,
.q-table__top {
  padding: 10px 0;
}

.q-table td,
.q-table th {
  vertical-align: middle;
  text-align: center;
}

.q-field__control {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
