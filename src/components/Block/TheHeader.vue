<script setup>
import IconLogo from "@/assets/icons/IconLogo.vue";
import IconUser from "@/assets/icons/iconUser.vue";
import UiInput from "@/components/Ui/UiInput.vue";
import UiTextH4 from "@/components/Ui/UiTextH4.vue";
</script>

<template>
  <header>
    <icon-logo />

    <ui-input class="input" type="search" placeholder="поиск" />

    <div class="user">
      <ui-text-h4>Админа Админ</ui-text-h4>
      <icon-user />
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  padding: 10px;
  width: 100%;
  //box-shadow: 3px 9px 21px 0px rgba(0, 0, 0, 0.75
  //);
}

.input {
  width: 600px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 30px;
  }

  h4 {
    color: white;
  }
}
</style>
