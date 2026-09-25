<script setup>
defineProps({
  tipo: {
    type: String,
    default: 'info', // 'info' | 'error' | 'success'
  },
  mensaje: {
    type: String,
    default: '',
  },
})

defineEmits(['cerrar'])
</script>

<template>
  <div v-if="mensaje" class="alert" :class="`alert-${tipo}`" role="status">
    <span class="alert__icon" aria-hidden="true">
      <svg
        v-if="tipo === 'success'"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 6 9 17l-5-5"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg v-else-if="tipo === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
        <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
        <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </span>
    <span class="alert__msg">{{ mensaje }}</span>
    <button
      type="button"
      class="alert__close"
      aria-label="Cerrar aviso"
      @click="$emit('cerrar')"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.alert {
  position: relative;
}
.alert__icon {
  display: inline-flex;
  margin-top: 1px;
}
.alert__msg {
  flex: 1;
}
.alert__close {
  background: none;
  border: none;
  font-size: 1.1rem;
  line-height: 1;
  color: currentColor;
  opacity: 0.6;
  cursor: pointer;
  padding: 0 2px;
}
.alert__close:hover {
  opacity: 1;
}
</style>
