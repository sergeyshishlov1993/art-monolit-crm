<template>
  <div class="table__wrapper">
    <UiTextH1>Владелец</UiTextH1>

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
      <component :is="activeTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useOwner } from "@/stores/Owner";
import TheTabs from "@/components/Block/TheTabs.vue";
import TabRolePermission from "./components/Tabs/TabRolePermission.vue";
import TabUsers from "./components/Tabs/TabUsers.vue";
import TabStores from "./components/Tabs/TabStores.vue";
import UiTextH1 from "@/components/Ui/UiTextH1.vue";

const storeOwner = useOwner();

const activeTabComponent = computed(() => {
  switch (currentTab.value) {
    case "Пользователи":
      return TabUsers;

    case "Роли и разрешения":
      return TabRolePermission;

    case "Магазины":
      return TabStores;
  }
});
const currentTab = ref("Роли и разрешения");
const tabs = [
  { name: "Роли и разрешения" },
  { name: "Магазины" },
  { name: "Пользователи" },
];

onMounted(async () => {
  await storeOwner.getAllUsers();
  await storeOwner.getAllRows();
  await storeOwner.getAllStores();
});

function changeTab(name) {
  currentTab.value = name;
}
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
  justify-content: space-between;
  gap: 30px;

  .input-search {
    width: 400px;
  }
}

.tabs {
  position: relative;
  padding: 64px 0 34px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid rgba(216, 216, 216, 1);
}

.actions-btn {
  display: flex;
  gap: 10px;
}
</style>
