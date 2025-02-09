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
                default-year-month="2025/01"
                @update:model-value="updateFormattedDateRange"
              />
            </q-popup-proxy>
          </div>

          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            class="select-filter"
            @update:model-value="filterStatus(selectedStatus)"
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
      <div class="header">
        <q-btn
          color="green"
          icon="add"
          round
          dense
          @click="addItem"
          class="q-mb-lg"
        ></q-btn>

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
      </div>

      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        :rows="store.rows"
        :columns="store.columns"
        row-key="accountNumber"
        v-model:pagination="store.pagination"
        @request="onRequest"
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
              @click="openOrder(props.row)"
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
                <p>
                  Дата:
                  {{
                    new Date(props.row.createdAt).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  }}
                </p>
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
import { usePreOrders } from "@/stores/PreOrders";
import { useUserStore } from "@/stores/User";
import { useOwner } from "@/stores/Owner";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

import { usePreOrderFilters } from "./composables/usePreOrderFilters";
import { usePreOrderActions } from "./composables/usePreOrderActions";
import { usePreOrderPagination } from "./composables/usePreOrderPagination";
import { usePreOrderStatus } from "./composables/usePreOrderStatus";
import { usePreOrderStoreInit } from "./composables/usePreOrderStoreInit";

const {
  formattedDateRange,
  selectedDateRange,
  selectedStores,
  statusOptions,
  selectedStatus,
  searchQuery,
  showCalendar,
  updateFormattedDateRange,
  handleStoreChange,
  filterStatus,
  handlerSearch,
  resetFilters,
  formatDate,
} = usePreOrderFilters();

const { addItem, openOrder, moveItem, removeItem, isProcessing } =
  usePreOrderActions();

const { onRequest } = usePreOrderPagination();

const { getStatusColor, getStatusText } = usePreOrderStatus();

usePreOrderStoreInit();

const store = usePreOrders();
const storeOwner = useOwner();
const storeUser = useUserStore();
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

.header {
  display: flex;
  align-items: baseline;
  gap: 40px;

  margin-bottom: 30px;

  .input-search {
    width: 100%;
  }
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
