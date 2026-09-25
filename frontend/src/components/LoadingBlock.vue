<script setup>
defineProps({
  texto: {
    type: String,
    default: 'Cargando…',
  },
})
</script>

<template>
  <div class="loading-block">
    <span class="spinner spinner-accent" aria-hidden="true"></span>
    <span>{{ texto }}</span>
  </div>
</template>
