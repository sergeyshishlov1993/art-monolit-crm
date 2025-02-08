import { ref, computed } from "vue";
import TabMaterials from "@/components/Block/Tabs/TabMaterials.vue";
import TabTypeWork from "@/components/Block/Tabs/TabTypeWork.vue";
import TabServices from "@/components/Block/Tabs/TabServices.vue";

export function useTabsManagement(dataTable, isOrderCreated) {
  const currentTab = ref("");

  const tabs = [
    { name: "Материалы" },
    { name: "Виды работ" },
    { name: "Услуги" },
  ];

  function changeTab(name) {
    currentTab.value = name;
  }

  const activeTabComponent = computed(() => {
    switch (currentTab.value) {
      case "Материалы":
        return TabMaterials;
      case "Виды работ":
        return TabTypeWork;
      case "Услуги":
        return TabServices;
      default:
        return null;
    }
  });

  const activeTabProps = computed(() => {
    switch (currentTab.value) {
      case "Материалы":
        return {
          rows: dataTable.rowsMaterials,
          isCreated: isOrderCreated.value,
        };
      case "Виды работ":
        return { rows: dataTable.rowsWorks };
      case "Услуги":
        return { rows: dataTable.rowsServices };
      default:
        return {};
    }
  });

  return {
    currentTab,
    tabs,
    changeTab,
    activeTabComponent,
    activeTabProps,
  };
}
