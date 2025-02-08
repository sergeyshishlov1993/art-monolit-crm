<script setup>
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import { useWarehouseLogic } from "./composables/useWarehouseLogic";
import { useWarehouseSearch } from "./composables/useWarehouseSearch";
import {
  allowOnlyNumbers,
  handlerFocusInput,
} from "./composables/useWarehouseInputs";

const { storeWarehouse, permissionStore } = useWarehouseLogic();
const { searchQuery, pagination, fetchSearchResults } = useWarehouseSearch();
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
        :rows="storeWarehouse.rows"
        :columns="storeWarehouse.columns"
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
            {{ storeWarehouse.formatDate(props.row.createdAt) }}
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
              @focus="handlerFocusInput(props.row)"
              @keypress="allowOnlyNumbers($event, props.col.name)"
            ></q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <q-td :props="props" class="text-center">
            <div class="actions-btn">
              <q-btn
                v-if="!props.row.isCreated"
                :disable="!props.row.isChanged"
                icon="sync"
                round
                glossy
                color="teal"
                dense
                ripple
                @click="storeWarehouse.handleUpdate(props.row)"
              >
                <q-tooltip>Изменить</q-tooltip>
              </q-btn>

              <q-btn
                :disable="!props.row.isChanged"
                round
                color="primary"
                icon="edit"
                dense
                @click="storeWarehouse.handleAdd(props.row)"
                v-if="props.row.isCreated"
              >
                <q-tooltip>Добавить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                @click="storeWarehouse.handleDelete(props.row)"
              >
                <q-tooltip>Удалить</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table__wrapper {
  h1 {
    text-align: center;
    font-size: 34px;
    font-weight: 600;
  }
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  .input-search {
    width: 400px;
  }
}

.actions-btn {
  display: flex;
  gap: 10px;
}
</style>
