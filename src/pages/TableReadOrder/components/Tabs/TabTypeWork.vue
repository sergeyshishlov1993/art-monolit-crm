<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  rows: Array,
});

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
]);
const data = ref([
  { id: crypto.randomUUID(), header: "На стелі" },
  { id: crypto.randomUUID(), header: "На плиті" },
  ...props.rows,
]);

const sortedRows = computed(() => {
  const headers = data.value.filter((row) => row.header);
  const result = [];

  headers.forEach((header) => {
    result.push(header);
    const relatedRows = data.value.filter(
      (row) => row.parentTitle === header.header
    );
    result.push(...relatedRows);
  });

  return result;
});
</script>

<template>
  <div class="q-pa-md">
    <q-table
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
            {{ props.row.name || selected }}
          </q-td>

          <q-td>
            {{ props.row.price }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
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

.total {
  margin-top: 15px;
  font-size: 18px;
  text-align: right;
  font-weight: bold;
}
</style>
