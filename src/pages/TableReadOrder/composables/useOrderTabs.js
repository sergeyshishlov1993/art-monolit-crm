import { ref, computed } from "vue";
import TabCustomer from "../components/Tabs/TabCustomer.vue";
import TabMaterials from "../components/Tabs/TabMaterials.vue";
import TabTypeWork from "../components/Tabs/TabTypeWork.vue";
import TabServices from "../components/Tabs/TabServices.vue";
import TabDead from "../components/Tabs/TabDead.vue";
import TabPhotos from "@/components/Block/Tabs/TabPhotos/index.vue";

export function useOrderTabs(dataTable) {
  const currentTab = ref("Заказчик");

  const activeTabComponent = computed(() => {
    switch (currentTab.value) {
      case "Заказчик":
        return TabCustomer;
      case "Материалы":
        return TabMaterials;
      case "Умерший":
        return TabDead;
      case "Виды работ":
        return TabTypeWork;
      case "Услуги":
        return TabServices;
      case "Фото":
        return TabPhotos;
      default:
        return null;
    }
  });

  const activeTabProps = computed(() => {
    switch (currentTab.value) {
      case "Заказчик":
        return { rows: dataTable.rowsCustomer };
      case "Умерший":
        return { rows: dataTable.rowsDead };
      case "Материалы":
        return { rows: dataTable.rowsMaterials };
      case "Виды работ":
        return { rows: dataTable.rowsWorks };
      case "Услуги":
        return { rows: dataTable.rowsServices };
      case "Фото":
        return { rows: dataTable.rowsPhotos };
      default:
        return {};
    }
  });

  function changeTab(name) {
    currentTab.value = name;
  }

  return {
    currentTab,
    activeTabComponent,
    activeTabProps,
    changeTab,
  };
}
