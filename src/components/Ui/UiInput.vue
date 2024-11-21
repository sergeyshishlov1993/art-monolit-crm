<script setup>
const props = defineProps({
  type: String,
  placeholder: String,
  value: String,
});
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    :value="props.value"
  />
</template>

<style lang="scss" scoped>
.input {
  padding: 10px;
  height: 50px;
  background: white;
}
</style>
