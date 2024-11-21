<script setup>
import { ref } from "vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import { useWarehouse } from "@/stores/Warehouse";

const storeWarehouse = useWarehouse();
</script>

<template>
  <div class="table__wrapper">
    <UiTextH1>Склад</UiTextH1>

    <div class="settings">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="storeWarehouse.addRow"
      ></q-btn>

      <ui-input />
    </div>

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        :rows="storeWarehouse.rows"
        :columns="storeWarehouse.columns"
        :rows-per-page="10"
        :rows-per-page-options="[5, 10, 20, 50]"
        row-key="id"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <q-input
              v-model.number="props.row[props.col.name]"
              input-class="text-start"
              type="string"
              dense
              borderless
            ></q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
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
</style>
