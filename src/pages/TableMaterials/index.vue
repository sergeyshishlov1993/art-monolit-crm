<script setup>
import { ref, computed, onMounted, watch } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useMaterials } from "@/stores/Materials";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import debounce from "lodash/debounce";

const storeMaterials = useMaterials();
const searchQuery = ref("");
const pagination = ref({
  sortBy: "name",
  descending: false,
  rowsPerPage: 10,
});
const totalWeight = computed(() => storeMaterials.calculateTotalWeight());
const debouncedSearch = debounce(fetchSearchResults, 500);
const debouncedUpdate = debounce(async (row) => {
  await handleUpdate(row);
}, 3000);

onMounted(async () => {
  await storeMaterials.fetchMaterialsData();
});

watch(searchQuery, (newValue) => {
  debouncedSearch(newValue);
});

function generatePDF() {
  const docDefinition = {
    content: [
      {
        text: `Заказ ${storeMaterials.getCurrentDate()}`,
        style: "header",
        alignment: "center",
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*", "*"],

          body: [
            [
              "Номер",
              "Название",
              "Длина",
              "Ширина",
              "Толщина",
              "Вес",
              "Количество",
            ],
            ...storeMaterials.rows.map((row, index) => [
              index + 1,
              row.name,
              row.length,
              row.width,
              row.thickness,
              row.weight,
              row.quantity,
            ]),
          ],
        },

        layout: "grid",
      },
      {
        text: `общий вес ${totalWeight.value} кг`,
        style: "header",
        alignment: "right",
        margin: [0, 10, 0, 5],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 15, 0, 10],
      },
    },
    defaultStyle: {
      fontSize: 12,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`Заказ ${storeMaterials.getCurrentDate()} .pdf`);
}

async function fetchSearchResults(query) {
  await storeMaterials.fetchMaterialsData(query);
}

async function handleAdd(item) {
  storeMaterials.handleAdd(item);

  const idx = storeMaterials.rows.findIndex((el) => el.id === item.id);
  storeMaterials.rows[idx].isCreated = false;
}

async function handleUpdate(row) {
  try {
    await storeMaterials.handleUpdate(row);
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

async function clearTableMaterials() {
  await storeMaterials.clearTableMaterials();

  storeMaterials.rows = [];
}
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
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
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
          <q-td :props="props">
            {{ storeMaterials.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <q-td :props="props" class="text-center">
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
      {{ totalWeight.toLocaleString("ru-RU") }} кг</UiTextH1
    >

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
</style>
