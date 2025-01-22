<template>
  <div class="hello-wrapper">
    <UiTextH1 class="title">Добро пожаловать</UiTextH1>

    <div class="logo">
      <IconLogo />
    </div>

    <UiTextH1 class="text-subtitle1 q-mt-sm">
      Добро пожаловать в нашу систему! Начните работу, используя меню слева.
    </UiTextH1>
  </div>
</template>

<script setup>
import UiTextH1 from "@/components/Ui/UiTextH1.vue";
import IconLogo from "@/assets/icons/IconLogo.vue";
</script>

<style lang="scss" scoped>
.hello-wrapper {
  display: flex;
  flex-direction: column;
  gap: 100px;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: center;
  font-weight: 400;
  font-size: 50px;
}

.text-subtitle1 {
  font-weight: 400;
}

.logo {
  background: #000;
  width: 400px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 4s ease-in-out infinite; /* Более медленная и плавная анимация */

  svg {
    width: 400px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  50% {
    transform: scale(1.1); /* Лёгкое увеличение */
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.7); /* Более мягкая тень */
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
