<script setup>
import { ref, onMounted, watch } from "vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

import { useDefectiveTable } from "./composables/useDefectiveTable";
import { useDefectiveActions } from "./composables/useDefectiveActions";
import { useDefectiveFilters } from "./composables/useDefectiveFilters";

const { storeDefective, pagination } = useDefectiveTable();
const { handleUpdate, handlerFocusInput } = useDefectiveActions();
const { searchQuery, fetchSearchResults } = useDefectiveFilters();
</script>

<template>
  <div class="table__wrapper">
    <UiTextH1>Брак</UiTextH1>

    <div class="settings">
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
        :rows="storeDefective.rows"
        :columns="storeDefective.columns"
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
            {{ storeDefective.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="props.col.name !== 'quantity'">
              {{ props.row[props.col.name] }}
            </div>
            <q-input
              v-else
              v-model.number="props.row.quantity"
              input-class="text-start"
              type="number"
              dense
              borderless
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
                @click="handleUpdate(props.row)"
                v-if="!props.row.isCreated"
              >
                <q-tooltip>Изменить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                @click="storeDefective.handleDelete(props.row)"
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
  justify-content: center;
  gap: 30px;

  .input-search {
    width: 600px;
  }
}

.actions-btn {
  display: flex;
  gap: 10px;
}
</style>
