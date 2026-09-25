<script setup>
defineProps({
  titulo: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['cerrar'])

function alClicarFondo(e) {
  if (e.target === e.currentTarget) emit('cerrar')
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click="alClicarFondo">
      <div class="modal-panel card" role="dialog" aria-modal="true" :aria-label="titulo">
        <div class="modal-panel__header">
          <h3>{{ titulo }}</h3>
          <button type="button" class="modal-panel__close" aria-label="Cerrar" @click="emit('cerrar')">
            ×
          </button>
        </div>
        <div class="modal-panel__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(41, 38, 32, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}

.modal-panel {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-pop);
}

.modal-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-panel__header h3 {
  margin: 0;
}

.modal-panel__close {
  background: none;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--color-text-soft);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
}

.modal-panel__close:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.modal-panel__body {
  padding: 24px;
  overflow-y: auto;
}
</style>
