<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import UiInput from "@/components/Ui/UiInput.vue";
import UiTextH5 from "@/components/Ui/UiTextH5.vue";
import UiTextH6 from "@/components/Ui/UiTextH6.vue";

const props = defineProps({
  options: Array,
  selected: String,
  accountNumber: Number,
});

const emit = defineEmits(["selectedValue"]);

const selected = ref(props.selected || null);
const search = ref("");
const showOptions = ref(false);
const dropdownStyles = ref({});

const options = computed(() => {
  return props.options.map((el) => ({
    accountNumber: props.accountNumber,
    name: `${el.name} (${el.length}X${el.width}X${el.thickness})`,
    price: Math.ceil(+el.price * 1.4),
    value: `(${el.length}X${el.width}X${el.thickness})`,
  }));
});

const handleInput = (event) => {
  search.value = event.target.value;
};

const filteredOptions = computed(() => {
  return options.value.filter((el) =>
    el.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

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
    width: `200px`,
    zIndex: 1000,
  };
};

const toggleOptions = (event) => {
  showOptions.value = !showOptions.value;
  if (showOptions.value) {
    calculateDropdownPosition(event.currentTarget);
  }
};

const closeDropdown = () => {
  showOptions.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
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
        :class="$style.list"
        :style="dropdownStyles"
        @click.stop
      >
        <UiInput
          :class="$style.input"
          type="search"
          placeholder="Найти или выбрать"
          :value="search"
          @input="(event) => handleInput(event)"
        />

        <UiTextH6
          v-for="option in filteredOptions"
          :key="option.name"
          @click="handleSelect(option)"
          :class="$style.options"
        >
          {{ option.name }}
        </UiTextH6>
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
    max-height: 200px;
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
</style>

<style module>
.list {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
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
  font-size: 14px !important;
}

.options:hover {
  background-color: #f0f0f0;
}
</style>
