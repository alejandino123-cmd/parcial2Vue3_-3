<script setup>
defineProps({
  titulo: { type: String, default: '¿Confirmar acción?' },
  mensaje: { type: String, required: true },
  textoConfirmar: { type: String, default: 'Eliminar' },
  procesando: { type: Boolean, default: false },
})
const emit = defineEmits(['confirmar', 'cancelar'])
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('cancelar')">
      <div class="confirm-panel card card-pad" role="alertdialog" aria-modal="true">
        <h3>{{ titulo }}</h3>
        <p>{{ mensaje }}</p>
        <div class="confirm-panel__actions">
          <button type="button" class="btn btn-secondary" :disabled="procesando" @click="emit('cancelar')">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger" :disabled="procesando" @click="emit('confirmar')">
            <span v-if="procesando" class="spinner" aria-hidden="true"></span>
            {{ textoConfirmar }}
          </button>
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
  z-index: 110;
}

.confirm-panel {
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-pop);
}

.confirm-panel p {
  max-width: none;
}

.confirm-panel__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
