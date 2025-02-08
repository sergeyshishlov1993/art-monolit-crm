<template>
  <div class="carvings">
    <div class="file-preview">
      <q-file
        v-if="props.canWrite"
        v-model="files"
        label="Выберите файлы"
        multiple
        accept="image/*"
        filled
        clearable
        @update:model-value="onFileChange"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-icon
            name="close"
            @click.stop="clearPreviews"
            class="cursor-pointer"
          />
        </template>
      </q-file>

      <div v-if="previewUrls.length" class="preview-container">
        <PhotoCard
          v-for="file in previewUrls"
          :key="file.id"
          class="preview-item"
          :url="file.url"
          :fileKey="file.key"
          :id="file.id"
          :isLoading="file.isLoading"
          :description="file.description"
          :canWrite="props.canWrite"
          @remove="removeItem"
          @enter="enterDescription"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import PhotoCard from "./PhotoCard.vue";

const props = defineProps({
  rows: Array,
  canWrite: Boolean,
});

const emit = defineEmits(["upload"]);

const previewUrls = ref([]);

const isLoading = ref(false);

watch(
  () => props.rows,
  (newRows) => {
    previewUrls.value = newRows.map((file, index) => ({
      ...file,
      id: file.id || index,
    }));
  },
  { immediate: true }
);

const onFileChange = async (newFiles) => {
  if (!newFiles || newFiles.length === 0) return;

  const fileArray = Array.from(newFiles);

  for (const file of fileArray) {
    if (file.type.startsWith("image/")) {
      try {
        const uniqueFileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/s3-presigned-url`,
          {
            fileName: uniqueFileName,
          }
        );

        const { presignedUrl, fileUrl, fileKey } = response.data;

        await axios.put(presignedUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        isLoading.value = true;

        const item = {
          id: crypto.randomUUID(),
          url: fileUrl,
          key: fileKey,
          description: "",
          type: "carvings",
          isLoading: isLoading.value,
        };

        previewUrls.value.push(item);

        emit("upload", previewUrls.value, "carvings");

        setTimeout(() => {
          const uploadedFile = previewUrls.value.find((f) => f.id === item.id);
          if (uploadedFile) {
            uploadedFile.isLoading = false;
          }
        }, 500);
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);

        if (error.response) {
          console.log("❌ Статус код:", error.response.status);
          console.log("📌 Заголовки ответа:", error.response.headers);
          console.log("📄 Ответ S3:", error.response.data);
        } else if (error.request) {
          console.log("⚠️ Нет ответа от сервера:", error.request);
        } else {
          console.log("🔴 Ошибка запроса:", error.message);
        }
      }
    }
  }
};

const clearPreviews = () => {
  previewUrls.value = [];
};

const enterDescription = (value, id) => {
  const idx = previewUrls.value.findIndex((el) => el.id === id);
  previewUrls.value[idx].description = value;

  emit("upload", previewUrls.value, "carvings");
};

const removeItem = (id) => {
  previewUrls.value = previewUrls.value.filter((file) => file.id !== id);

  emit("upload", previewUrls.value, "carvings");
};
</script>

<style lang="scss" scoped>
.file-preview {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
