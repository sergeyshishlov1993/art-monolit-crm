<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import TheSidebar from "@/components/Block/TheSidebar.vue";
import { usePermissionStore } from "@/stores/PermissionStore";

const permissionStore = usePermissionStore();
const isTransitioning = ref(false);
</script>

<template>
  <div class="layout">
    <div class="main-container" @click="permissionStore.isCollapsed = true">
      <the-sidebar @click.stop />

      <main class="content" :class="{ fading: isTransitioning }">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overscroll-behavior: contain;
}

.header {
  background-color: #f8f9fa;
  padding: 10px;
}

.main-container {
  padding-top: 100px;
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 30px;
  margin-left: 70px;
  transition: opacity 0.3s ease;
}

.content.fading {
  opacity: 0.5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
