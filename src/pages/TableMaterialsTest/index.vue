<script setup>
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import { useMaterialsFilters } from "./composables/useMaterialsFilters";
import { useMaterialsActions } from "./composables/useMaterialsActions";
import { useMaterialsPDF } from "./composables/useMaterialsPDF";
import { useMaterialsTable } from "./composables/useMaterialsTable";
import { useMaterialsStoreInit } from "./composables/useMaterialsStoreInit";

const { searchQuery, fetchSearchResults } = useMaterialsFilters();
const { handleAdd, allowOnlyNumbers, handlerFocusInput, clearTableMaterials } =
  useMaterialsActions();
const { generatePDF } = useMaterialsPDF();
const { storeMaterials, pagination } = useMaterialsTable();

useMaterialsStoreInit();
</script>

<template>
  <div class="table__wrapper">
    <UiTextH1>Материалы</UiTextH1>

    <div class="settings">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="storeMaterials.addRow"
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
        :rows="storeMaterials.rows"
        :columns="storeMaterials.columns"
        v-model:pagination="pagination"
        row-key="id"
      >
        <template v-slot:body-cell-accountNumber="props">
          <q-td
            :props="props"
            :class="{ 'highlight-cell': props.row.isCreateMenedger }"
          >
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td
            :props="props"
            :class="{ 'highlight-cell': props.row.isCreateMenedger }"
          >
            <q-input
              v-model.number="props.row[props.col.name]"
              input-class="text-left"
              type="string"
              dense
              borderless
              @keypress="allowOnlyNumbers($event, props.col.name)"
              @focus="handlerFocusInput(props.row)"
            ></q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td
            :props="props"
            :class="{ 'highlight-cell': props.row.isCreateMenedger }"
          >
            {{ storeMaterials.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <q-td
            :props="props"
            class="text-center"
            :class="{ 'highlight-cell': props.row.isCreateMenedger }"
          >
            <div class="actions-btn">
              <q-btn
                :disable="!props.row.isChanged"
                round
                color="primary"
                icon="edit"
                dense
                @click="handleAdd(props.row)"
                v-if="props.row.isCreated"
              >
                <q-tooltip>Добавить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                @click="storeMaterials.handleDelete(props.row)"
              >
                <q-tooltip>Удалить</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <UiTextH1 class="total-weight">
      <span>общий вес:</span>
      {{ storeMaterials.calculateTotalWeight().toLocaleString("ru-RU") }} кг
    </UiTextH1>

    <div class="button-group">
      <q-btn
        label="Сгенерировать PDF"
        icon="picture_as_pdf"
        color="green"
        class="q-mr-sm"
        @click="generatePDF"
      />

      <q-btn
        :disable="!storeMaterials.rows.length"
        label="Сохранить"
        icon="save"
        color="primary"
        class="q-mr-sm"
        @click="storeMaterials.transferDataToArrival()"
      />

      <q-btn
        label="Очистить"
        icon="clear"
        color="red"
        class="q-mr-sm"
        @click="clearTableMaterials()"
      />
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

.button-group {
  display: flex;
  justify-content: end;
}

.total-weight {
  text-align: end !important;

  span {
    font-size: 16px;
  }
}

.actions-btn {
  display: flex;
  gap: 10px;
}

.highlight-cell {
  background-color: rgba(255, 235, 59, 0.15) !important;
  transition: background-color 0.3s ease-in-out;
}
</style>
