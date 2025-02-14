<template>
  <div class="table__wrapper">
    <ui-text-h1>Заказы</ui-text-h1>

    <div class="filter">
      <div>
        <q-toolbar>
          <q-btn
            dense
            flat
            round
            icon="filter_list"
            @click="showFilters = true"
          />
          <q-toolbar-title>Фильтрация заказов</q-toolbar-title>
        </q-toolbar>
      </div>

      <FilterDialog
        v-model:showFilters="showFilters"
        :totalOrders="store.totalOrders"
        :formattedTotalSum="formattedTotalSum"
        :storeOptions="storeOwner.storeOptions"
        :sourceOptions="source"
        :statusOptions="statusOptions"
        :isAllStores="storeUser.user?.address === 'Все магазины'"
      />
    </div>

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
        dense
        :rows="store.rows"
        :columns="filteredColumns"
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
                    v-if="permissionStore.isOwner == 'true'"
                    color="red"
                    icon="delete"
                    round
                    dense
                    @click="
                      removeOrder(
                        props.row.id,
                        props.row.name,
                        props.row.isDraft,
                        props.row.isPublic
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
                <p>
                  Цена:
                  {{ parseFloat(props.row.totalPrice).toLocaleString("ru-RU") }}
                  грн
                </p>
                <p>
                  Дата создания:
                  {{
                    new Date(props.row.createdAt).toLocaleString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }}
                </p>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
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
import UiTextH3 from "@/components/Ui/UiTextH3.vue";

import FilterDialog from "./components/FilterDialog.vue";

const source = ["Google", "Facebook", "Instagram", "Рекомендация", "Магазин"];
const store = useOrders();
const storeOwner = useOwner();
const storeUser = useUserStore();
const showFilters = ref(false);
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
  selectedSource,
  selectSource,
  handlerCalculationOrder,
} = useOrdersFilters();

const { addItem, openOrder, removeOrder } = useOrdersActions(canWrite);
const { onRequest } = useOrdersPagination(storeUser, selectedStores);
const { getStatusClass, lastActiveStatus, updateStatuses } = useOrdersStatus(
  statusOptions,
  store
);

useOrdersStoreInit();

const filteredColumns = computed(() =>
  permissionStore.isOwner == "true"
    ? store.columns
    : store.columns.filter((col) => col.name !== "action")
);
const formattedTotalSum = computed(() => {
  return new Intl.NumberFormat("ru-RU").format(store.totalSum) + " грн";
});

watchEffect(() => {
  store.rows = store.rows.filter((el) => el.isPublic === true);
});
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
  flex-direction: column;
  gap: 30px;

  &-header {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .calendar {
    width: 600px;
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

.filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
