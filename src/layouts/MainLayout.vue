<script setup>
import TheHeader from "@/components/Block/TheHeader.vue";
import TheSidebar from "@/components/Block/TheSidebar.vue";
</script>

<template>
  <div class="layout">
    <the-header />

    <div class="main-container">
      <the-sidebar />

      <main class="content">
        <router-view />
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
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 30px;
}
</style>
