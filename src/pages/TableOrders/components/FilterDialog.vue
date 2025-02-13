<template>
  <q-dialog
    v-model="props.showFilters"
    position="right"
    full-width
    full-height
    class="dialog"
    @update:model-value="closeDialog"
  >
    <q-card class="filter-modal">
      <q-card-section class="row justify-between items-center">
        <div class="text-h6">Фильтры</div>
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="emit('update:showFilters', false)"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="flex-grow">
        <div style="width: 450px">
          <div>
            <q-input
              class="calendar"
              v-model="formattedDateRange"
              outlined
              label="Выберите период"
              readonly
              @click="toggleCalendar"
            >
              <template v-slot:prepend>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                  @click="toggleCalendar"
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
                @update:model-value="updateAndCloseCalendar"
              />
            </q-popup-proxy>
          </div>

          <q-item>
            <q-select
              v-model="selectedStatus"
              :options="statusOptions"
              class="select-filter full-width"
              label="Статус"
              @update:model-value="filterStatus"
              @popup-show="closeCalendar"
            />
          </q-item>

          <q-item v-if="props.isAllStores">
            <q-select
              v-model="selectedStores"
              :options="storeOptions"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              class="select-filter full-width"
              label="Магазины"
              @update:model-value="handleStoreChange"
              @popup-show="closeCalendar"
            />
          </q-item>

          <q-item>
            <q-select
              class="select-filter full-width"
              v-model="selectedSource"
              :options="sourceOptions"
              label="Источник"
              @update:model-value="selectSource"
              @popup-show="closeCalendar"
            />
          </q-item>

          <q-item class="count-order">
            <div>
              <UiTextH3>
                - Количество заказов:
                <span class="bold-text">{{ props.totalOrders }} шт</span> -
              </UiTextH3>
              <UiTextH3 style="margin-top: 15px">
                - Общая сума заказов:
                <span class="bold-text">{{ props.formattedTotalSum }}</span> -
              </UiTextH3>
            </div>
          </q-item>
        </div>
      </q-card-section>

      <q-separator />

      <div align="right" class="action-btn">
        <q-btn
          color="primary"
          icon="calculate"
          label="Пересчитать"
          @click="handlerCalculationOrder"
        />
        <q-btn
          flat
          color="red"
          icon="clear"
          label="Сбросить"
          @click="resetFilters"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import UiTextH3 from "@/components/Ui/UiTextH3.vue";
import { useOrdersFilters } from "../composables/useOrdersFilters";

const props = defineProps({
  showFilters: Boolean,
  totalOrders: Number,
  formattedTotalSum: String,
  storeOptions: Array,
  sourceOptions: Array,
  statusOptions: Array,
  isAllStores: Boolean,
});

const emit = defineEmits(["update:showFilters"]);

const {
  formattedDateRange,
  selectedDateRange,
  selectedStores,
  selectedStatus,
  updateFormattedDateRange,
  handleStoreChange,
  filterStatus,
  resetFilters,
  selectedSource,
  selectSource,
  handlerCalculationOrder,
} = useOrdersFilters();

const showCalendar = ref(false);
const toggleCalendar = (event) => {
  event.stopPropagation();
  showCalendar.value = !showCalendar.value;
};
const closeCalendar = () => {
  showCalendar.value = false;
};
const updateAndCloseCalendar = (value) => {
  updateFormattedDateRange(value);
  closeCalendar();
};
const closeDialog = (value) => {
  if (!value) {
    emit("update:showFilters", false);
  }
};
</script>

<style lang="scss" scoped>
.filter-modal {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.flex-grow {
  flex: 1;
  overflow-y: auto;
}

.action-btn {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
}

.count-order {
  margin-top: 50px;
}

.bold-text {
  font-weight: 500;
  font-size: 20px;
}
</style>
