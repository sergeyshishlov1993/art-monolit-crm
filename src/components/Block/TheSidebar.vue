<script setup>
import IconLogo from "@/assets/icons/IconLogo.vue";
import IconLogoout from "@/assets/icons/IconLogoout.vue";
import IconOrder from "@/assets/icons/IconOrder.vue";
import IconDefective from "@/assets/icons/IconDefective.vue";
import IconMaterials from "@/assets/icons/iconMaterials.vue";
import IconWarehouse from "@/assets/icons/IconWarehouse.vue";
import IconArrival from "@/assets/icons/IconArrival.vue";
import IconCalculate from "@/assets/icons/IconCalculate.vue";
import iconUser from "@/assets/icons/iconUser.vue";
import UiTextH3 from "@/components/Ui/UiTextH3.vue";
import { ref, computed } from "vue";
import { usePermissionStore } from "@/stores/PermissionStore";
import { useRoute, useRouter } from "vue-router";

import { logout } from "@/services/authService";

const isCollapsed = ref(true);
const activePage = ref("orders");
const route = useRoute();
const router = useRouter();

const permissionStore = usePermissionStore();
const canViewArrival = computed(() => permissionStore.hasPermission("arrival"));
const canViewOrders = computed(() => permissionStore.hasPermission("orders"));
const canViewPreOrders = computed(() =>
  permissionStore.hasPermission("calculation")
);
const canViewDefective = computed(() =>
  permissionStore.hasPermission("defective")
);
const canViewMaterials = computed(() =>
  permissionStore.hasPermission("materials")
);
const canViewWarehouse = computed(() =>
  permissionStore.hasPermission("warehouse")
);

function selectedPage(name) {
  activePage.value = name;
  isCollapsed.value = !isCollapsed.value;
}

let hoverTimeout = null;

function handleMouseEnter() {
  clearTimeout(hoverTimeout);
  isCollapsed.value = false;
}

function handleMouseLeave() {
  hoverTimeout = setTimeout(() => {
    isCollapsed.value = true;
  }, 100);
}

async function logoutUser() {
  await logout();

  permissionStore.clearPermissions();

  router.push("/login");
}
</script>

<template>
  <aside
    :class="['sidebar', { collapsed: isCollapsed }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="logo">
      <router-link to="/">
        <IconLogo :class="{ logo_open: !isCollapsed }" />
      </router-link>
    </div>

    <nav class="sidebar__nav">
      <ul>
        <router-link
          v-if="canViewOrders"
          to="/orders"
          :class="[
            {
              selected:
                route.name === 'orders' ||
                route.name === 'readOrder' ||
                route.name === 'orders-create',
            },
          ]"
          @click="selectedPage('orders')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-order />
          <ui-text-h3 v-if="!isCollapsed">Заказы</ui-text-h3>
        </router-link>

        <router-link
          v-if="canViewPreOrders"
          to="/calculate"
          :class="[
            {
              selected:
                route.name === 'calculate' || route.name === 'calculate-create',
            },
          ]"
          @click="selectedPage('calculate')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-calculate />
          <ui-text-h3 v-if="!isCollapsed">Просчёт</ui-text-h3>
        </router-link>

        <router-link
          v-if="canViewWarehouse"
          to="/warehouse"
          :class="[{ selected: route.name === 'warehouse' }]"
          @click="selectedPage('warehouse')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-warehouse />
          <ui-text-h3 v-if="!isCollapsed">Склад</ui-text-h3>
        </router-link>

        <router-link
          v-if="canViewArrival"
          to="/arrival"
          :class="[{ selected: route.name === 'arrival' }]"
          @click="selectedPage('arrival')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-arrival />
          <ui-text-h3 v-if="!isCollapsed">Приход</ui-text-h3>
        </router-link>

        <router-link
          v-if="canViewDefective"
          to="/defective"
          :class="[{ selected: route.name === 'defective' }]"
          @click="selectedPage('defective')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-defective />
          <ui-text-h3 v-if="!isCollapsed">Брак</ui-text-h3>
        </router-link>

        <router-link
          v-if="canViewMaterials"
          to="/materials"
          :class="[{ selected: route.name === 'materials' }]"
          @click="selectedPage('materials')"
          @dblclick="isCollapsed = !isCollapsed"
        >
          <icon-materials />
          <ui-text-h3 v-if="!isCollapsed">Материалы</ui-text-h3>
        </router-link>
      </ul>
    </nav>

    <div class="login">
      <router-link to="/owner">
        <div>
          <iconUser />
        </div>
      </router-link>

      <div @click="logoutUser" v-if="!isCollapsed">
        <IconLogoout />
        <q-tooltip> Выйти из системы </q-tooltip>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;

  width: 220px;
  padding: 80px 0;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  overflow: hidden;
  transition: width 0.3s;

  &.collapsed {
    width: 69px;

    .sidebar__nav ul li ui-text-h3 {
      display: none;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
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
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
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

.login {
  padding-right: 10px;
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    margin: 0;
    padding: 10px;

    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      width: 35px;
      min-width: 35px;
    }
  }

  svg {
    width: 35px;
    min-width: 35px;
  }
}

.logo {
  width: 100%;
  transition: all 0.9s ease;
}

.logo svg {
  width: 170px;
}
</style>
