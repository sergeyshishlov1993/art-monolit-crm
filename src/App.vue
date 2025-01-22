<script setup>
import { onMounted } from "vue";
import { useWarehouse } from "@/stores/Warehouse";
const storeWarehouse = useWarehouse();

onMounted(async () => {
  await storeWarehouse.getWarehouseData();
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
