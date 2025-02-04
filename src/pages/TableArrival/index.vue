<script setup>
import { ref, onMounted, watch } from "vue";
import { useArrival } from "@/stores/Arrival";
import debounce from "lodash/debounce";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

const storeArrival = useArrival();
const searchQuery = ref("");
const debouncedSearch = debounce(fetchSearchResults, 500);
const debouncedUpdate = debounce(async (row) => {
  await handleUpdate(row);
}, 3000);
onMounted(async () => {
  await storeArrival.fetchMaterialsData();
});
watch(searchQuery, (newValue) => {
  debouncedSearch(newValue);
});

async function clearTableArrival() {
  await storeArrival.clearTableArrival();

  storeArrival.rows = [];
}
async function fetchSearchResults(query) {
  await storeArrival.fetchMaterialsData(query);
}
async function handleUpdate(row) {
  try {
    await storeArrival.handleUpdate(row);
    row.isChanged = false;
  } catch (error) {
    console.error("Ошибка при обновлении количества:", error);
  }
}

function allowOnlyNumbers(event, n) {
  if (n === "name") {
    return;
  }
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
function handlerFocusInput(row) {
  row.isChanged = true;

  if (!row.isCreated) {
    debouncedUpdate(row);
  }
}
</script>

<template>
  <div class="table__wrapper">
    <ui-text-h1>Приход</ui-text-h1>

    <div class="settings">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="storeArrival.addRow"
      ></q-btn>

      <q-input
        class="input-search"
        v-model="searchQuery"
        @update:model-value="fetchSearchResults()"
        outlined
        placeholder="Введите текст для поиска"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        :rows="storeArrival.rows"
        :columns="storeArrival.columns"
        v-model:pagination="pagination"
        row-key="id"
      >
        <template v-slot:body-cell-accountNumber="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ storeArrival.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            <q-input
              v-if="props.col.name !== 'createdAt'"
              v-model.number="props.row[props.col.name]"
              input-class="text-start"
              type="string"
              dense
              borderless
              @keypress="allowOnlyNumbers($event, props.col.name)"
              @focus="handlerFocusInput(props.row)"
            ></q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <q-td :props="props" class="text-center">
            <div class="actions-btn">
              <q-btn
                :disable="!props.row.isChanged"
                icon="sync"
                round
                glossy
                color="teal"
                dense
                ripple
                @click="storeArrival.handleUpdate(props.row)"
                v-if="!props.row.isCreated"
              >
                <q-tooltip>Изменить</q-tooltip>
              </q-btn>

              <q-btn
                :disable="!props.row.isChanged"
                round
                color="primary"
                icon="edit"
                dense
                @click="storeArrival.handleAdd(props.row)"
                v-if="props.row.isCreated"
              >
                <q-tooltip>Добавить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                @click="storeArrival.handleDelete(props.row)"
              >
                <q-tooltip>Удалить</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <div class="button-group">
      <q-btn
        :disable="!storeArrival.rows.length"
        label="Внести приход"
        icon="add_circle"
        color="green"
        push
        @click="storeArrival.transferDataToWarehouse()"
      />

      <q-btn
        label="Очистить"
        icon="clear"
        color="red"
        class="q-mr-sm"
        @click="clearTableArrival()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table__wrapper {
  gap: 50px;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 34px;
    font-weight: 600;
    text-align: center;
  }
}

.settings {
  gap: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .input-search {
    width: 400px;
  }
}

.button-group {
  gap: 10px;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.actions-btn {
  gap: 10px;
  display: flex;
}
</style>
