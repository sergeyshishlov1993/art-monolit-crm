<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import UiInput from "@/components/Ui/UiInput.vue";
import UiTextH5 from "@/components/Ui/UiTextH5.vue";
import UiTextH6 from "@/components/Ui/UiTextH6.vue";

const props = defineProps({
  id: String,
  options: Array,
  selected: String,
  accountNumber: Number,
  tab: String,
  openWindol: Boolean,
});

const emit = defineEmits(["selectedValue", "create", "showModal"]);
const showDialog = ref(false);
const dropdownRef = ref(null);

function openDialog() {
  showDialog.value = true;
  emit("showModal", showDialog.value, props.id);
  showOptions.value = false;
}

const selected = computed(() => props.selected);
const search = ref("");
const showOptions = ref(false);
const dropdownStyles = ref({});

const warehouseOptions = computed(() => {
  return props.options.map((el) => ({
    id: props.id,
    accountNumber: props.accountNumber,
    warehouseId: el.id,
    name: `${el.name} (${el.length}X${el.width}X${el.thickness})`,
    quantity: 1,
    isCreatedMenedger: false,
    price: Math.ceil(+el.price + (+el.price * el.earnings) / 100),
    value: `(${el.length}X${el.width}X${el.thickness})`,
  }));
});

const typeWorkOptions = computed(() => {
  return (props.options || []).map((el) => ({
    ...el,
    items: (el.items || []).map((item) => ({
      ...item,
      id: props.id,

      accountNumber: props.accountNumber,
    })),
  }));
});

const serviceOptions = computed(() => {
  return (props.options || []).map((el) => ({
    ...el,
    id: props.id,

    accountNumber: props.accountNumber,
  }));
});

const filteredOptions = computed(() => {
  return warehouseOptions.value.filter((el) =>
    el.name.toLowerCase().includes(search.value.toLowerCase())
  );
});
const handleInput = (event) => {
  search.value = event.target.value;
};

const handleSelect = (value) => {
  selected.value = value.name;
  showOptions.value = false;
  search.value = "";

  emit("selectedValue", value);
};

const calculateDropdownPosition = (element) => {
  const rect = element.getBoundingClientRect();
  dropdownStyles.value = {
    position: "absolute",
    top: `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `240px`,
    height: '300px',
    zIndex: 1000,
  };
};

const toggleOptions = (event) => {
  showOptions.value = !showOptions.value;
  if (showOptions.value) {
    calculateDropdownPosition(event.currentTarget);
  }
};


const handleClickOutside = (event) => {
  if (showOptions.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showOptions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="selector" @click.stop="toggleOptions">
    <div class="selected">
      <UiTextH5>{{ selected || "Выберите элемент" }}</UiTextH5>
    </div>

    <teleport to="body">
      <div
        v-if="showOptions"
        ref="dropdownRef"
        :class="$style.list"
        :style="dropdownStyles"
        @click.stop
      >
        <UiInput
          v-if="props.tab == 'rowsMaterials'"
          :class="$style.input"
          type="search"
          placeholder="Найти или выбрать"
          :value="search"
          @input="(event) => handleInput(event)"
        />

        <q-btn
          label="Добавить"
          icon="add"
          color="primary"
          @click="openDialog"
        />

        <div v-if="props.tab == 'rowsMaterials'">
          <UiTextH5 class="li"
            v-for="option in filteredOptions"
            :key="option.name"
            @click="handleSelect(option)"
            :class="$style.options"
          >
            <span> {{ option.title }}</span>
            {{ option.name }}
          </UiTextH5>
        </div>

        <ul>
          <li v-for="group in typeWorkOptions" :key="group.title">
            <UiTextH6 class="title-list">{{ group.title }}</UiTextH6>
            <ul>
              <li
                v-for="item in group.items"
                :key="item"
                :class="$style.options"
                @click="handleSelect(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </li>
        </ul>

        <div v-if="props.tab == 'rowsServices'">
          <UiTextH6
            v-for="option in serviceOptions"
            :key="option.name"
            @click="handleSelect(option)"
            :class="$style.options"
          >
            <span> {{ option.title }}</span>
            {{ option.name }}
          </UiTextH6>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.selector {
  width: 160px;
  cursor: pointer;

  .selected {
    margin-bottom: 10px;

    h5 {
      font-weight: 500;
    }
  }

  .selector-list {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    z-index: 1000;
  }

  .input-search {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ccc;
    margin-bottom: 5px;
  }

  h6 {
    cursor: pointer !important;
    padding: 8px !important;
    font-size: 14px !important;
    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.title-list {
  font-size: 16px;
  font-weight: 600;
}
</style>

<style module>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  z-index: 1000;
}

.input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
}

.options {
  cursor: pointer !important;
  padding: 8px !important;
  font-size: 16px !important;
  font-weight: 500 !important
}

.options:hover {
  background-color: #f0f0f0;
}


</style
