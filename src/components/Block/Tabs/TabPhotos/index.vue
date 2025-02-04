<script setup>
import { ref, computed } from "vue";
import { usePermissionStore } from "@/stores/PermissionStore";
import TheTabs from "@/components/Block/TheTabs.vue";
import TabPhotoCarvings from "./components/TabPhotoCarvings.vue";
import TabPhotoArtistic from "./components/TabPhotoArtistic.vue";

const props = defineProps({
  rows: Array,
});
const emit = defineEmits(["updateParents"]);

const permissionStore = usePermissionStore();

const canWrite = permissionStore.hasPermission("can_write_orders");

const activeTabComponent = computed(() => {
  switch (currentTab.value) {
    case "Резные работы":
      return TabPhotoCarvings;

    case "Художественые работы":
      return TabPhotoArtistic;
  }
});

const activeTabProps = computed(() => {
  switch (currentTab.value) {
    case "Резные работы":
      return { rows: props.rows.carvings, canWrite: canWrite };

    case "Художественые работы":
      return { rows: props.rows.artistic, canWrite: canWrite };

    default:
      return {};
  }
});

const currentTab = ref("Резные работы");
const tabs = [{ name: "Резные работы" }, { name: "Художественые работы" }];

function changeTab(name) {
  currentTab.value = name;
}

function addPhoto(item, type) {
  emit("updateParents", item, type);
}
</script>

<template>
  <div class="tabs">
    <TheTabs
      v-for="tab in tabs"
      :key="tab.name"
      @click="changeTab(tab.name)"
      :selectedTab="currentTab"
      :name="tab.name"
      >{{ tab.name }}</TheTabs
    >
  </div>

  <keep-alive>
    <component
      :is="activeTabComponent"
      v-bind="activeTabProps"
      @upload="addPhoto"
    />
  </keep-alive>
</template>

<style lang="scss" scoped>
.tabs {
  position: relative;
  padding: 64px 0 34px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
}
</style>
