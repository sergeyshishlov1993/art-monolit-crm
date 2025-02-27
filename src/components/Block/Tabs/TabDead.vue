<script setup>
import { ref, computed, onMounted } from "vue";
import { useTableState } from "./composables/useTableState";

const props = defineProps({
  rows: Array,
});

const data = computed(() => props.rows);
const emit = defineEmits(["addItem", "updateInput", "remove", "updateRows"]);
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
    name: "deadName",
    align: "left",
    label: "Имя",
    field: "deadName",
    sortable: true,
  },

  {
    name: "deadSecondName",
    align: "left",
    label: "Фамилия",
    field: "deadSecondName",
    sortable: true,
  },
  {
    name: "deadSurName",
    align: "left",
    label: "Отчество",
    field: "deadSurName",
    sortable: true,
  },

  {
    name: "deadDateBirth",
    align: "left",
    label: "Дата рождения",
    field: "deadDateBirth",
    sortable: true,
  },

  {
    name: "deadDateDeath",
    align: "left",
    label: "Дата смерти",
    field: "deadDateDeath",
    sortable: true,
  },

  {
    name: "delete",
    label: "Удалить",
    align: "left",
    field: "delete",
  },
]);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 20,
});
function addItem() {
  emit("addItem", "rowsDead");
}

function emitValue(row, fieldName, id) {
  emit("updateInput", "rowsDead", id, row, fieldName);
}

function removeItem(id) {
  emit("remove", "rowsDead", id);
}
</script>

<template>
  <div class="q-pa-md">
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
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-input
            v-if="
              props.col.name === 'deadDateBirth' ||
              props.col.name === 'deadDateDeath'
            "
            v-model="props.row[props.col.name]"
            mask="##.##.####"
            placeholder="дд.мм.гггг"
            dense
            borderless
            @update:modelValue="
              emitValue(props.row, props.col.name, props.row.id)
            "
          ></q-input>

          <q-input
            v-else
            v-model="props.row[props.col.name]"
            input-class="text-left"
            type="string"
            placeholder="Внести"
            dense
            borderless
            @update:modelValue="
              emitValue(props.row, props.col.name, props.row.id)
            "
          ></q-input>
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
