<template>
  <div class="card">
    <div class="image-wrapper">
      <img
        :src="props.url"
        alt="Фото"
        class="preview-image"
        v-if="!props.isLoading"
        @click="showImage = true"
      />
      <div v-else class="loading-spinner">
        <q-spinner size="50px" color="primary" />
      </div>
    </div>

    <q-input
      class="text-aria"
      v-model="description"
      type="textarea"
      label="Описание"
      placeholder="Введите текст для описание тут..."
      autogrow
      maxlength="500"
      :readonly="!props.canWrite"
    />

    <div>
      <q-btn
        color="red"
        icon="delete"
        round
        dense
        @click="removeItem(props.url, props.fileKey)"
        v-if="props.canWrite"
      ></q-btn>
    </div>

    <q-dialog v-model="showImage">
      <div class="img">
        <q-img :src="props.url" class="full-image" />
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useOrders } from "@/stores/Orders";

import { ref, watch } from "vue";
const route = useRoute();

const props = defineProps({
  id: String,
  url: String,
  fileKey: String,
  canWrite: Boolean,
  isLoading: Boolean,
  description: String,
});
const emit = defineEmits(["enter", "remove"]);

const store = useOrders();

const isOrderCreated = ref(route.query.isCreated === "false");

const description = ref(props.description);
const showImage = ref(false);

watch(description, (newValue) => {
  emit("enter", newValue, props.id);
});

const removeItem = async (id, key) => {
  emit("remove", props.id);

  if (!isOrderCreated.value) {
    await store.removeFromS3(key);
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 10px;
  display: flex;
  align-items: stretch;
  gap: 20px;
}

.image-wrapper {
  position: relative;
  width: 200px;
}

.preview-image {
  max-width: 200px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.preview-image:hover {
  transform: scale(1.05);
}

.text-aria {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text-aria .q-field {
  height: 100%;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img {
  width: 100%;
}

.image-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
}

.full-image {
  max-width: 100%;
  max-height: 100vh;
}
</style>
