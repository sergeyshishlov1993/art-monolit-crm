<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";

import TabTableSelector from "@/components/Block/Tabs/TabTableSelector/index.vue";
import TheModalWindow from "@/components/Block/Tabs/TabTableSelector/components/TheModalWindow.vue";
import { useWarehouse } from "@/stores/Warehouse";

const emit = defineEmits([
  "addItem",
  "selectValue",
  "updateInput",
  "createCell",
  "remove",
]);
const props = defineProps({
  rows: Array,
  isCreated: String,
});

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
    label: "Цена",
    field: "price",
    sortable: true,
  },

  {
    name: "quantity",
    align: "left",
    label: "Количество",
    field: "quantity",
    sortable: true,
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
const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 20,
});
const selected = ref("Выбрать");
const showModal = ref(false);
const storeWarehouse = useWarehouse();
const totalPrice = ref(0);

const formatTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString("ru-RU");
});

const calcTotalPrice = () => {
  totalPrice.value = data.reduce((acc, row) => {
    const price = parseFloat(row.price) || 0;
    const quantity = parseFloat(row.quantity) || 1;
    return acc + price * quantity;
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
  emit("addItem", "rowsMaterials");
}
function addSelectedValue(val) {
  const result = props.isCreated ? { ...val, isCalculation: true } : val;
  emit("selectValue", result, "rowsMaterials");
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

function changeQuantity(val) {
  const result = props.isCreated ? { ...val, isCalculation: true } : val;
  emit("selectValue", result, "rowsMaterials");
  calcTotalPrice();
}
function createCell(val, state, id) {
  const idx = data.findIndex((el) => el.id === id);
  data[idx] = val;

  const result = props.isCreated
    ? data.map((item) => ({ ...item, isCalculation: true }))
    : data;

  showModal.value = state;

  emit("createCell", "rowsMaterials", result, id);
  calcTotalPrice();
}
function emitValue(row, fieldName, id) {
  emit("updateInput", "rowsMaterials", id, row, fieldName);
  calcTotalPrice();
}
function removeItem(id) {
  const idx = data.findIndex((el) => el.id === id);

  if (idx !== -1) {
    data.splice(idx, 1);
  }
  emit("remove", "rowsMaterials", id);

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
    tab="rowsMaterials"
    :id="idItems"
    :class="{ showModal: isOpen }"
    @change-state-modal="changeStateModal"
    @create="createCell"
    style="z-index: 1"
  />

  <div class="q-pa-md" @click.stop="showModal = false">
    <q-btn
      color="green"
      icon="add"
      round
      dense
      @click="addItem(rowsMaterials)"
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

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <TabTableSelector
            :options="storeWarehouse.rows"
            v-model="props.row.name"
            :selected="props.row.name || selected"
            :accountNumber="data.length"
            tab="rowsMaterials"
            :id="props.row.id"
            @selectedValue="addSelectedValue"
            @showModal="openWindol"
          />
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

      <template v-slot:body-cell-quantity="props">
        <q-td :props="props">
          <q-input
            v-model.number="props.row.quantity"
            type="number"
            dense
            borderless
            @update:modelValue="changeQuantity(props.row)"
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

<style lang="scss">
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
