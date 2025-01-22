<template>
  <div class="modal" @click="closeModal">
    <article class="modal-container" @click.stop>
      <header class="modal-container-header">
        <button class="icon-button" @click="closeModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </button>
      </header>

      <section
        class="modal-container-body rtf"
        v-if="props.tab === 'rowsMaterials'"
      >
        <q-input
          v-model="newWarehouseItem.name"
          label="Название"
          outlined
          clearable
          @click.stop
        />

        <q-input
          v-model="newWarehouseItem.length"
          label="Длина"
          outlined
          class="q-mt-md"
          @click.stop
        />

        <q-input
          v-model="newWarehouseItem.width"
          label="Ширина"
          outlined
          class="q-mt-md"
          @click.stop
        />

        <q-input
          v-model="newWarehouseItem.thickness"
          label="Толшина"
          outlined
          class="q-mt-md"
          @click.stop
        />

        <q-input
          v-model.number="newWarehouseItem.quantity"
          type="text"
          label="Количество"
          outlined
          clearable
          @click.stop
        />

        <q-input
          v-model.number="newWarehouseItem.price"
          label="Цена"
          type="text"
          outlined
          class="q-mt-md"
          @click.stop
        />
      </section>

      <section class="modal-container-body rtf" v-else>
        <div @click.stop>
          <q-select
            v-if="props.tab === 'typeWork'"
            v-model="newItem.parentTitle"
            :options="['На стеле', 'На плите']"
            label="Расположение"
            outlined
            class="q-mt-md"
          />
        </div>

        <q-input
          v-model="newItem.name"
          label="Название материала/услуги"
          outlined
          clearable
        />
        <q-input
          v-model.number="newItem.price"
          label="Цена"
          type="text"
          outlined
          class="q-mt-md"
        />
      </section>

      <footer class="modal-container-footer">
        <button class="button is-ghost" @click="resetForm">Отмена</button>
        <button class="button is-primary" @click="createCell">Сохранить</button>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["changeStateModal"]);
const props = defineProps({
  tab: String,
  id: String,
});

const newItem = ref({
  name: "",
  price: 0,
});
const newWarehouseItem = ref({
  name: "",
  length: "",
  width: "",
  thickness: "",
  quantity: 0,
  isCreatedMenedger: true,
  price: 0,
});

const createCell = () => {
  emit(
    "create",
    props.tab === "rowsMaterials" ? newWarehouseItem.value : newItem.value,
    false,
    props.id
  );
};
const closeModal = () => {
  emit("changeStateModal", false);
};
const resetForm = () => {
  props.tab === "rowsMaterials"
    ? (newWarehouseItem.value = {})
    : (newItem.value = {});
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap");

*,
*:before,
*:after {
  box-sizing: border-box;
}

/* Some basic CSS overrides */
body {
  line-height: 1.5;
  min-height: 100vh;
  font-family: "Outfit", sans-serif;
  color: #2d232e;
  background-color: #c8c0bd;
  position: relative;
}

button,
input,
select,
textarea {
  font: inherit;
}

a {
  color: inherit;
}

/* End basic CSS override */

* {
  scrollbar-width: 0;
}

*::-webkit-scrollbar {
  background-color: transparent;
  width: 12px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 99px;
  background-color: #ddd;
  border: 4px solid #fff;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  background-color: rgba(#000, 0.25);
}

.modal-container {
  max-height: 90vh;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 30px 0 rgba(#000, 0.25);

  @media (max-width: 600px) {
    width: 90%;
  }
}

.modal-container-header {
  padding: 16px 32px;
  border-bottom: 1px solid #ddd;
  display: flex;
  place-content: flex-end;
}

.modal-container-title {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
  font-weight: 700;
  font-size: 1.125;
  svg {
    width: 32px;
    height: 32px;
    color: #750550;
  }
}

.modal-container-body {
  padding: 24px 32px 51px;
  overflow-y: auto;
}

.rtf {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 700;
  }

  h1 {
    font-size: 1.5rem;
    line-height: 1.125;
  }

  h2 {
    font-size: 1.25rem;
    line-height: 1.25;
  }

  h3 {
    font-size: 1rem;
    line-height: 1.5;
  }

  & > * + * {
    margin-top: 1em;
  }

  & > * + :is(h1, h2, h3) {
    margin-top: 2em;
  }

  & > :is(h1, h2, h3) + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    margin-left: 20px;
    list-style-position: inside;
  }

  ol {
    list-style: numeric;
  }

  ul {
    list-style: disc;
  }
}

.modal-container-footer {
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  gap: 12px;
  position: relative;
  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -51px;
    left: 24px;
    right: 24px;
    height: 50px;
    flex-shrink: 0;
    background-image: linear-gradient(to top, rgba(#fff, 0.75), transparent);
    pointer-events: none;
  }
}

.button {
  padding: 12px 20px;
  border-radius: 8px;
  background-color: transparent;
  border: 0;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &.is-ghost {
    &:hover,
    &:focus {
      background-color: #dfdad7;
    }
  }

  &.is-primary {
    background-color: #750550;
    color: #fff;
    &:hover,
    &:focus {
      background-color: #4a0433;
    }
  }
}

.icon-button {
  padding: 0;
  border: 0;
  background-color: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.15s ease;
  svg {
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:focus {
    background-color: #dfdad7;
  }
}
</style>
