<template>
  <div class="table__wrapper">
    <ui-text-h1>Заказы</ui-text-h1>

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
          v-if="canWrite"
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
              @click="openOrder(props.row.id, props.row.isDraft)"
            >
              <template v-if="col.name === 'accountNumber'">
                <q-td>
                  <div class="account-number">
                    <q-avatar
                      v-if="props.row.isDraft"
                      color="orange"
                      text-color="white"
                      size="30px"
                      class="q-ml-xs"
                    >
                      <q-icon name="description" size="18px" />
                    </q-avatar>
                    {{ props.pageIndex + 1 }}
                  </div>
                </q-td>
              </template>

              <template v-if="col.name === 'status'">
                <div @click.stop style="overflow: hidden">
                  <div class="q-pa-md" style="max-width: 300px">
                    <q-select
                      filled
                      v-model="props.row.activeStatuses"
                      :options="statusOptions"
                      multiple
                      emit-value
                      map-options
                      :display-value="
                        lastActiveStatus(props.row.activeStatuses)
                      "
                      @update:model-value="updateStatuses(props.row)"
                      :class="getStatusClass(props.row.activeStatuses)"
                    >
                      <template
                        v-slot:option="{
                          itemProps,
                          opt,
                          selected,
                          toggleOption,
                        }"
                      >
                        <q-item v-bind="itemProps">
                          <q-item-section>
                            <q-item-label v-html="opt.label"></q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-toggle
                              :model-value="selected"
                              @update:model-value="toggleOption(opt)"
                            ></q-toggle>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
              </template>

              <template v-else-if="col.name === 'action'">
                <div @click.stop>
                  <q-btn
                    color="red"
                    icon="delete"
                    round
                    dense
                    @click="
                      store.deleteOrder(
                        props.row.id,
                        props.row.name,
                        props.row.isDraft
                      )
                    "
                  ></q-btn>
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
                <p><strong>Детали заказа:</strong></p>
                <p>Название: {{ props.row.name }}</p>
                <p>
                  Имя: {{ props.row.first_name }} {{ props.row.second_name }}
                </p>
                <p>Телефон: {{ props.row.phone }}</p>
                <p>Адрес: {{ props.row.address }}</p>
                <p class="comment">Комментарий: {{ props.row.comment }}</p>
                <p>Цена: {{ props.row.totalPrice }} грн</p>
                <p>Дата создания: {{ props.row.createdAt }}</p>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/User";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useOrders } from "@/stores/Orders";
import { useOrdersFilters } from "./composables/useOrdersFilters";
import { useOrdersActions } from "./composables/useOrdersActions";
import { useOrdersPagination } from "./composables/useOrdersPagination";
import { useOrdersStoreInit } from "./composables/useOrdersStoreInit";
import { useOrdersStatus } from "./composables/useOrdersStatus";
import { useOwner } from "@/stores/Owner";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

const store = useOrders();
const storeOwner = useOwner();
const storeUser = useUserStore();
const permissionStore = usePermissionStore();
const canWrite = permissionStore.hasPermission("can_write_orders");

const {
  formattedDateRange,
  selectedDateRange,
  selectedStores,
  selectedStatus,
  statusOptions,
  searchQuery,
  updateFormattedDateRange,
  handleStoreChange,
  filterStatus,
  handlerSearch,
  resetFilters,
  showCalendar,
} = useOrdersFilters();

const { addItem, openOrder, removeOrder } = useOrdersActions(canWrite);
const { onRequest } = useOrdersPagination();
const { getStatusClass, lastActiveStatus, updateStatuses } = useOrdersStatus(
  statusOptions,
  store
);

useOrdersStoreInit();
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

.comment {
  width: 100%;
  white-space: normal;
  overflow: visible;
}

.status-new {
  background-color: #ffecb3 !important;
}

.status-layout {
  background-color: #bbdefb !important;
}

.status-layout_accepted {
  background-color: #c8e6c9 !important;
}

.status-engraving_front {
  background-color: #ffe0b2 !important;
}

.status-engraving_reverse {
  background-color: #ffcc80 !important;
}

.status-engraving_plate {
  background-color: #ffab91 !important;
}

.status-engraving_stand {
  background-color: #b39ddb !important;
}

.status-milling {
  background-color: #d1c4e9 !important;
}

.status-concreting {
  background-color: #b3e5fc !important;
}

.status-laying_tiles {
  background-color: #f8bbd0 !important;
}

.status-installation {
  background-color: #dcedc8 !important;
}

.status-completed {
  background-color: #ffcdd2 !important;
}

.status-default {
  background-color: #e0e0e0 !important;
}
</style>
