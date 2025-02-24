<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import TabTableSelector from "@/components/Block/Tabs/TabTableSelector/index.vue";
import TheModalWindow from "@/components/Block/Tabs/TabTableSelector/components/TheModalWindow.vue";

const emit = defineEmits([
  "addItem",
  "selectValue",
  "updateInput",
  "createCell",
  "remove",
]);
const props = defineProps({
  rows: Array,
});

const columns = ref([
  {
    name: "accountNumber",
    required: true,
    label: "Номер",
    align: "left",
    field: "accountNumber",
  },
  {
    name: "name",
    align: "left",
    label: "Название",
    field: "name",
  },
  {
    name: "price",
    align: "left",
    label: "Цена",
    field: "price",
  },

  {
    name: "delete",
    label: "Удалить",
    align: "left",
    field: "delete",
  },
]);
const data = props.rows;
const idItems = ref(0);
const options = [
  { name: "Доставка", price: "0" },
  { name: "Монтаж", price: "0" },
  { name: "Демонтаж", price: "0" },
  { name: "Демонтаж(Інще)", price: "0" },
  { name: "Бетонування(1,5 Х 2,20 Х 0,15)", price: "0" },
  { name: "Бетонування(2,20 Х 2,20 Х 0,15)", price: "0" },
];
const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 20,
});
const selected = ref("Выбрать");
const showModal = ref(false);
const totalPrice = ref(0);

const formatTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString("ru-RU");
});

const calcTotalPrice = () => {
  totalPrice.value = data.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    return sum + price;
  }, 0);
};
const changeStateModal = (val) => {
  showModal.value = val;
};
const openWindol = (val, id) => {
  idItems.value = id;
  showModal.value = val;
};

function addItem() {
  emit("addItem", "rowsServices");
}
function addSelectedValue(val) {
  emit("selectValue", val, "rowsServices");

  calcTotalPrice();
}
function allowOnlyNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;

  if (
    charCode !== 8 &&
    charCode !== 9 &&
    charCode !== 13 &&
    (charCode < 48 || charCode > 57)
  ) {
    event.preventDefault();
  }
}
function createCell(val, state, id) {
  const idx = data.findIndex((el) => el.id === id);
  data[idx] = val;

  showModal.value = state;

  emit("createCell", "rowsServices", data, id);
  calcTotalPrice();
}
function emitValue(row, fieldName, id) {
  emit("updateInput", "rowsServices", id, row, fieldName);

  calcTotalPrice();
}
function removeItem(id) {
  const idx = data.findIndex((el) => el.id === id);

  if (idx !== -1) {
    data.splice(idx, 1);
  }
  emit("remove", "rowsServices", id);

  calcTotalPrice();
}

watchEffect(() => {
  if (showModal.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
onMounted(() => {
  calcTotalPrice();
});
</script>

<template>
  <TheModalWindow
    v-if="showModal"
    tab="rowsServices"
    :id="idItems"
    :class="{ showModal: isOpen }"
    @change-state-modal="changeStateModal"
    @create="createCell"
    style="z-index: 1"
  />

  <div class="q-pa-md">
    <q-btn
      color="green"
      icon="add"
      round
      dense
      @click="addItem(rowsServices)"
      class="button"
    ></q-btn>

    <q-table
      flat
      bordered
      :rows="data"
      :columns="columns"
      row-key="id"
      hide-bottom
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-accountNumber="props">
        <q-td :props="props">
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-input
            v-model.number="props.row[props.col.name]"
            input-class="text-left"
            type="string"
            dense
            borderless
            @update:modelValue="
              emitValue(props.row, props.col.name, props.row.id)
            "
            @keypress="allowOnlyNumbers"
          ></q-input>
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <TabTableSelector
            :options="options"
            v-model="props.row.name"
            :selected="props.row.name || selected"
            :accountNumber="data.length"
            tab="rowsServices"
            :id="props.row.id"
            @selectedValue="addSelectedValue"
            @showModal="openWindol"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props" class="text-left">
          <q-btn
            color="red"
            icon="delete"
            round
            dense
            @click="removeItem(props.row.id)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>

    <div class="total">
      <strong>Общая сумма: </strong>{{ formatTotalPrice }} ₴
    </div>
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

.button {
  margin-bottom: 15px;
}

.total {
  margin-top: 15px;
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
</style>
