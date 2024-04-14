<template>
  <svg>
    <use :href="`/img/icons.svg#${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
