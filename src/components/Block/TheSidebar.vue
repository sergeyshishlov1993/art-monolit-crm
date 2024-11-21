<script setup>
import UiTextH2 from "@/components/Ui/UiTextH2.vue";
import UiTextH4 from "@/components/Ui/UiTextH4.vue";
import IconOrder from "@/assets/icons/IconOrder.vue";
import IconDefective from "@/assets/icons/IconDefective.vue";
import IconMaterials from "@/assets/icons/iconMaterials.vue";
import IconWarehouse from "@/assets/icons/IconWarehouse.vue";
import IconArrival from "@/assets/icons/IconArrival.vue";
import IconMenu from "@/assets/icons/IconMenu.vue";
import UiTextH3 from "@/components/Ui/UiTextH3.vue";
import { ref } from "vue";

const isCollapsed = ref(true);
const activePage = ref("orders");

function selectedPage(name) {
  activePage.value = name;
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <button @click="isCollapsed = !isCollapsed">
      <icon-menu />
      <ui-text-h2 v-if="!isCollapsed">Меню</ui-text-h2>
    </button>

    <nav class="sidebar__nav">
      <ul>
        <router-link
          to="/"
          :class="[{ selected: activePage == 'orders' }]"
          @click="selectedPage('orders')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-order />
          <ui-text-h3 v-if="!isCollapsed">Заказы</ui-text-h3>
        </router-link>

        <router-link
          to="/warehouse"
          :class="[{ selected: activePage == 'warehouse' }]"
          @click="selectedPage('warehouse')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-warehouse />
          <ui-text-h3 v-if="!isCollapsed">Склад</ui-text-h3>
        </router-link>

        <router-link
          to="/arrival"
          :class="[{ selected: activePage == 'arrival' }]"
          @click="selectedPage('arrival')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-arrival />
          <ui-text-h3 v-if="!isCollapsed">Приход</ui-text-h3>
        </router-link>

        <router-link
          to="/defective"
          :class="[{ selected: activePage == 'defective' }]"
          @click="selectedPage('defective')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-defective />
          <ui-text-h3 v-if="!isCollapsed">Брак</ui-text-h3>
        </router-link>

        <router-link
          to="/materials"
          :class="[{ selected: activePage == 'materials' }]"
          @click="selectedPage('materials')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-materials />
          <ui-text-h3 v-if="!isCollapsed">Материалы</ui-text-h3>
        </router-link>
      </ul>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 220px;
  padding: 50px 0;
  background: #000;
  display: flex;
  flex-direction: column;
  gap: 30px;
  overflow: hidden;
  transition: width 0.3s;

  &.collapsed {
    width: 69px;

    .sidebar__nav ul li ui-text-h3 {
      display: none;
    }

    button ui-text-h2 {
      display: none;
    }
  }

  button {
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 20px;
    color: white;

    svg {
      width: 35px;
      min-width: 35px;
    }
  }

  &__nav {
    ul {
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 15px;

      a {
        margin: 0;
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 10px;

        &.selected {
          width: 100%;
          background: white;

          h3 {
            color: black;
            font-weight: 500;
          }

          svg {
            filter: invert(1);
          }
        }

        h3 {
          color: white;
        }

        svg {
          width: 35px;
          min-width: 35px;
        }
      }
    }
  }
}
</style>
