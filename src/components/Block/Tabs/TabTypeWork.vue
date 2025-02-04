<script setup>
import { ref, computed, onMounted, reactive, watchEffect } from "vue";
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

const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 20,
});

const data = ref([
  { id: crypto.randomUUID(), header: "На стеле" },
  { id: crypto.randomUUID(), header: "На плите" },
  ...props.rows,
]);
const tableKey = ref(0);
const showModal = ref(false);
const idItems = ref(0);

const sortedRows = computed(() => {
  const headers = data.value.filter((row) => row.header);
  const result = reactive([]);

  headers.forEach((header) => {
    result.push(header);
    const relatedRows = data.value.filter(
      (row) => row.parentTitle === header.header
    );
    result.push(...relatedRows);
  });

  return result;
});

const selected = ref("Выбрать");
const columns = ref([
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
const options = [
  {
    title: "На стеле",
    items: [
      { name: "Портрет", price: "0", parentTitle: "На стеле" },
      { name: "Стихи", price: "0", parentTitle: "На стеле" },
      { name: "Рисунок", price: "0", parentTitle: "На стеле" },
      { name: "Реверс", price: "0", parentTitle: "На стеле" },
    ],
  },

  {
    title: "На плите",
    items: [
      { name: "Стихи", price: "0", parentTitle: "На плите" },
      { name: "Рисунок", price: "0", parentTitle: "На плите" },
    ],
  },
];

const totalPrice = ref(0);
const formatTotalPrice = computed(() => {
  return totalPrice.value.toLocaleString("ru-RU");
});

function addItem() {
  const newItem = reactive({
    id: crypto.randomUUID(),
    accountNumber: data.value.length + 1,
    name: "Выбрать",
    price: 0,
    parentTitle: "На плите",
  });
  data.value.push(newItem);

  emit("addItem", "rowsWorks", newItem);

  tableKey.value = JSON.stringify(sortedRows.value);
}

function addSelectedValue(val) {
  selected.value = val.name;
  const idx = data.value.findIndex((el) => el.id === val.id);
  if (idx !== -1) {
    Object.assign(data.value[idx], reactive({ ...val }));
  } else {
    data.value.push(reactive({ ...val }));
  }

  tableKey.value = JSON.stringify(sortedRows.value);

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
function emitValue(row, fieldName, id) {
  emit("updateInput", "rowsWorks", id, row, fieldName);

  calcTotalPrice();
}

function removeItem(id) {
  const idx = data.value.findIndex((el) => el.id === id);

  if (idx !== -1) {
    data.value.splice(idx, 1);
  }
  emit("remove", "rowsWorks", id);

  tableKey.value = JSON.stringify(sortedRows.value);
  calcTotalPrice();
}

function createCell(val, state, id) {
  const idx = data.value.findIndex((el) => el.id === id);
  data.value[idx] = val;

  showModal.value = state;

  const validData = data.value.filter((el) => !el.header);

  emit("createCell", "rowsWorks", validData, id);

  calcTotalPrice();
  tableKey.value = JSON.stringify(sortedRows.value);
}

const calcTotalPrice = () => {
  totalPrice.value = data.value.reduce((sum, row) => {
    const price = parseFloat(row.price) || 0;
    return sum + price;
  }, 0);
};

const openWindol = (val, id) => {
  idItems.value = id;
  showModal.value = val;
};

const changeStateModal = (val) => {
  showModal.value = val;
};

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
    tab="typeWork"
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
      @click="addItem(rowsWorks)"
      class="button"
    ></q-btn>

    <q-table
      :key="tableKey"
      flat
      bordered
      :rows="sortedRows"
      :columns="columns"
      row-key="id"
      hide-bottom
      v-model:pagination="pagination"
    >
      <template v-slot:body="props">
        <q-tr v-if="props.row.header" class="bg-grey-3 text-bold">
          <q-td :colspan="columns.length">
            {{ props.row.header }}
          </q-td>
        </q-tr>

        <q-tr v-else>
          <q-td>
            <TabTableSelector
              :options="options"
              v-model="props.row.name"
              :selected="props.row.name || selected"
              :accountNumber="data.length"
              tab="typeWork"
              :id="props.row.id"
              @selectedValue="addSelectedValue"
              @showModal="openWindol"
            />
          </q-td>

          <q-td>
            <q-input
              v-model.number="props.row.price"
              input-class="text-left"
              type="string"
              dense
              borderless
              @keypress="allowOnlyNumbers"
              @update:modelValue="
                emitValue(props.row, props.row.price, props.row.id)
              "
            />
          </q-td>
          <q-td>
            <q-btn
              color="red"
              icon="delete"
              round
              dense
              @click="removeItem(props.row.id)"
            ></q-btn>
          </q-td>
        </q-tr>
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
