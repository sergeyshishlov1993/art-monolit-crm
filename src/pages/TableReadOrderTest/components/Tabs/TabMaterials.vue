<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="data"
      :columns="columns"
      row-key="id"
      hide-bottom
    >
      <template v-slot:body-cell-accountNumber="props">
        <q-td :props="props">
          {{ props.pageIndex + 1 }}
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          {{ props.row.name }}
        </q-td>
      </template>

      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.row[props.col.name] }}
        </q-td>
      </template>

      <template v-slot:body-cell-quantity="props">
        <q-td :props="props">
          {{ props.row.quantity }}
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props" class="text-left"> </q-td>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref } from "vue";
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
    name: "quantity",
    align: "left",
    label: "Количество",
    field: "quantity",
  },
]);
const data = props.rows;
</script>
<style lang="scss" scoped></style>
