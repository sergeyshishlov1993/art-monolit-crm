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

      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.row[props.col.name] }}
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <q-td :props="props" class="text-left"> </q-td>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

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
    name: "deadName",
    align: "left",
    label: "Имя",
    field: "deadName",
  },

  {
    name: "deadSecondName",
    align: "left",
    label: "Фамилия",
    field: "deadSecondName",
  },
  {
    name: "deadSurName",
    align: "left",
    label: "Отчество",
    field: "deadSurName",
  },

  {
    name: "deadDateBirth",
    align: "left",
    label: "Дата рождения",
    field: "deadDateBirth",
  },

  {
    name: "deadDateDeath",
    align: "left",
    label: "Дата смерти",
    field: "deadDateDeath",
  },
]);
const data = computed(() => props.rows);
</script>
<style lang="scss" scoped></style>
