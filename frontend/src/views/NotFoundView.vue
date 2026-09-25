<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="section not-found">
    <div class="container-narrow not-found__inner">
      <p class="eyebrow">Error 404</p>
      <h1>No encontramos esta página</h1>
      <p>El enlace puede estar roto o la página fue movida.</p>
      <RouterLink to="/" class="btn btn-primary">Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  padding: 100px 0;
}
.not-found__inner {
  text-align: center;
}
.not-found__inner p {
  margin-left: auto;
  margin-right: auto;
}
</style>
