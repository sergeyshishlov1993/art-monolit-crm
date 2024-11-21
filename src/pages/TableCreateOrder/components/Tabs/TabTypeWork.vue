<script setup>
import { ref } from "vue";

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
    label: "Ценв",
    field: "price",
    sortable: true,
  },

  {
    name: "delete",
    label: "Удалить",
    align: "left",
    field: "delete",
  },
]);

const rowsWorks = ref([
  {
    accountNumber: 1,
    name: "Арка",
    price: 487,
  },
]);

function addItem(tableName) {
  tableName.push({
    id: crypto.randomUUID(),
    accountNumber: tableName.length + 1,
    name: "",
    price: "",
  });
}
</script>

<template>
  <div class="q-pa-md">
    <q-btn
      color="green"
      icon="add"
      round
      dense
      @click="addItem(rowsWorks)"
      class="button"
    ></q-btn>

    <q-table flat bordered :rows="rowsWorks" :columns="columns" row-key="id">
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-input
            v-model.number="props.row[props.col.name]"
            input-class="text-left"
            type="string"
            dense
            borderless
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
            @click="removeItem(props.row)"
          ></q-btn>
        </q-td>
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

.button {
  margin-bottom: 15px;
}
</style>
