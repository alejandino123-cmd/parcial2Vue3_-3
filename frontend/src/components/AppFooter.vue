<script setup>
const anio = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <span>© {{ anio }} ClinicCare</span>
      <span class="app-footer__sep">·</span>
      <span>Sistema de gestión de citas médicas</span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: 22px 0;
}

.app-footer__inner {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-faint);
  font-size: 0.82rem;
  flex-wrap: wrap;
}

.app-footer__sep {
  opacity: 0.6;
}
</style>
