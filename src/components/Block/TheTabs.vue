<template>
  <div>
    <ui-text-h3 :class="{ active: props.name === props.selectedTab }">
      <slot />
    </ui-text-h3>

    <div :class="{ tab: props.name === props.selectedTab }" />
  </div>
</template>

<script setup>
import UiTextH3 from "@/components/Ui/UiTextH3.vue";

const props = defineProps({
  selectedTab: {
    type: String,
    requered: true,
  },

  name: {
    type: String,
    requered: true,
  },
});
</script>

<style lang="scss" scoped>
div {
  position: relative;
  display: flex;
  flex-direction: column;

  h3 {
    white-space: nowrap;
    font-size: 16px;
    cursor: pointer;
  }
}

.tab {
  width: 100%;
  position: absolute;
  bottom: -35px;
  border: 1px solid rgba(0, 0, 0, 1);
}

.active {
  font-weight: 700;
}
</style>
