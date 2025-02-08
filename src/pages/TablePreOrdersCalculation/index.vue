<template>
  <div class="table__wrapper">
    <ui-text-h1>Просчет</ui-text-h1>

    <q-expansion-item label="Фильтры" icon="filter_list" expand-separator>
      <div class="q-pa-md">
        <div class="settings">
          <div>
            <q-input
              class="calendar"
              v-model="formattedDateRange"
              outlined
              label="Выберите период"
              readonly
              @focus="showCalendar = true"
            >
              <template v-slot:prepend>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                  @click="showCalendar = true"
                />
              </template>
            </q-input>

            <q-popup-proxy
              v-model="showCalendar"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="selectedDateRange"
                range
                mask="YYYY-MM-DD"
                default-year-month="2024/01"
                @update:model-value="updateFormattedDateRange"
              />
            </q-popup-proxy>
          </div>

          <q-input
            class="input-search"
            v-model="searchQuery"
            @update:model-value="handlerSearch()"
            outlined
            placeholder="Введите текст для поиска"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="select"
            :options="statusOptions"
            class="select-filter"
            @update:model-value="filterStatus(select)"
          ></q-select>

          <q-select
            v-if="storeUser.user && storeUser.user.address === 'Все магазины'"
            v-model="selectedStores"
            :options="storeOwner.storeOptions"
            outlined
            dense
            emit-value
            map-options
            option-value="id"
            option-label="name"
            class="q-mt-sm"
            @update:model-value="handleStoreChange"
          />

          <q-btn
            round
            color="deep-orange"
            glossy
            text-color="white"
            icon="clear"
            @click="resetFilters"
          >
            <q-tooltip>Скинуть фильтры</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-expansion-item>

    <div class="q-pa-md">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="addItem"
        class="q-mb-lg"
      ></q-btn>

      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        :rows="store.rows"
        :columns="store.columns"
        row-key="accountNumber"
        v-model:pagination="pagination"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width></q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                @click.stop="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              ></q-btn>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="openOrder(props.row.id)"
            >
              <template v-if="col.name === 'accountNumber'">
                <q-td>{{ props.pageIndex + 1 }}</q-td>
              </template>

              <template v-if="col.name === 'isDraft'">
                <q-td>
                  <q-btn
                    class="glossy"
                    round
                    dense
                    disable
                    :color="!props.row.isDraft ? 'green' : 'deep-orange'"
                    icon="edit_document"
                  >
                    <q-tooltip>
                      {{
                        !props.row.isDraft ? "Заказан" : "На этапе просчета"
                      }}</q-tooltip
                    >
                  </q-btn>
                </q-td>
              </template>

              <template v-else-if="col.name === 'move'">
                <div @click.stop>
                  <q-btn
                    icon="swap_horiz"
                    color="secondary"
                    round
                    dense
                    :disable="!props.row.isDraft"
                    @click="moveItem(props.row)"
                  >
                    <q-tooltip>
                      {{
                        !props.row.isDraft ? "В заказaх" : "Внести в заказы"
                      }}</q-tooltip
                    >
                  </q-btn>
                </div>
              </template>

              <template v-else-if="col.name === 'action'">
                <div @click.stop>
                  <q-btn
                    color="red"
                    icon="delete"
                    round
                    dense
                    @click="removeItem(props.row.id)"
                  >
                    <q-tooltip>Удалить</q-tooltip>
                  </q-btn>
                </div>
              </template>

              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>

          <q-tr v-show="props.expand" :props="props">
            <q-td :colspan="store.columns.length">
              <div class="q-px-md">
                <p><strong>Деталі замовлення:</strong></p>
                <p>
                  Ім'я: {{ props.row.first_name }} {{ props.row.second_name }}
                </p>
                <p>Телефон: {{ props.row.phone }}</p>
                <p>Назва: {{ props.row.name }}</p>
                <p>Дата: {{ props.row.date }}</p>
                <p>Ціна: {{ props.row.totalPrice }} грн</p>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { usePreOrders } from "@/stores/PreOrders";
import { useOrders } from "@/stores/Orders";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

const formattedDateRange = ref("01.01.2024 - 01.02.2024");
const router = useRouter();
const isCreated = ref(false);
const isProcessing = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 20,
});
const searchQuery = ref("");
const select = ref("Просчет");
const statusOptions = ref([
  { label: "Просчет", value: "isDraft" },
  { label: "В заказах", value: "isPublic" },
]);
const selectedDateRange = ref({ from: "2024-01-01", to: "2024-02-01" });
const showCalendar = ref(false);
const store = usePreOrders();
const storeOrders = useOrders();

onMounted(async () => {
  await store.getPreOrders();
});

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
};
const updateFormattedDateRange = async (range) => {
  if (range?.from && range?.to) {
    formattedDateRange.value = `${formatDate(range.from)} - ${formatDate(
      range.to
    )}`;

    await store.getPreOrders(
      null,
      selectedDateRange.value.from,
      selectedDateRange.value.to
    );
  } else {
    formattedDateRange.value = "";
  }

  showCalendar.value = false;
};

function addItem() {
  router.push(
    `/order-estimation?id=id&accountNumber=${
      store.rows.length + 1
    }&isCreated=true`
  );
  store.addRow();

  isCreated.value = true;
}
function openOrder(id) {
  router.push(
    `/order-estimation?id=${id}&accountNumber=${store.rows.length}&isCreated=${isCreated.value}`
  );
}
function moveItem(item) {
  store.movingPreOrderToOrder(item);
  router.push(
    `/create?id=id&accountNumber=${
      storeOrders.rows.length + 1
    }&isCreated=true&isMoved=true&preOrderId=${item.id}`
  );

  storeOrders.addRow();
}

async function handlerSearch() {
  await store.getPreOrders(null, null, null, searchQuery.value);
}
async function removeItem(id) {
  isProcessing.value = true;
  await store.deletePreOrder(id);
}
async function resetFilters() {
  selectedDateRange.value = { from: "2024-01-01", to: "2024-02-01" };
  formattedDateRange.value = "01.01.2024 - 01.02.2024";
  select.value = "Просчет";
  searchQuery.value = "";

  await store.getPreOrders();
}

async function filterStatus(status) {
  await store.getPreOrders(status.value);
}
</script>

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

  .calendar {
    width: 450px;
  }

  .select-filter {
    width: 450px;
  }

  .input-search {
    width: 450px;
  }
}

.row-border-draft {
  width: 10px;
  height: 100%;
  border-left: 15px solid yellow;
}
</style>
