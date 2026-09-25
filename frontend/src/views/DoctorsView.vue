<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useDoctoresStore } from '@/stores/doctores'
import AlertBanner from '@/components/AlertBanner.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const store = useDoctoresStore()

const modalAbierto = ref(false)
const editando = ref(null) // doctor en edición, null = creando
const guardando = ref(false)
const formError = ref('')

const doctorAEliminar = ref(null)
const eliminando = ref(false)

const busqueda = ref('')

const vacio = reactive({ nombre: '', email: '', especialidad: '', telefono: '', cualificaciones: '' })
const form = reactive({ ...vacio })
const errores = reactive({ nombre: '', email: '', especialidad: '', telefono: '' })

const doctoresFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return store.lista
  return store.lista.filter(
    (d) =>
      d.nombre.toLowerCase().includes(q) ||
      d.especialidad.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
  )
})

onMounted(() => {
  store.obtenerDoctores()
})

function abrirCrear() {
  editando.value = null
  Object.assign(form, vacio)
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  modalAbierto.value = true
}

function abrirEditar(doctor) {
  editando.value = doctor
  Object.assign(form, {
    nombre: doctor.nombre,
    email: doctor.email,
    especialidad: doctor.especialidad,
    telefono: doctor.telefono,
    cualificaciones: doctor.cualificaciones || '',
  })
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
}

function validar() {
  errores.nombre = form.nombre.trim() ? '' : 'El nombre es obligatorio.'
  errores.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Ingresa un correo válido.'
  errores.especialidad = form.especialidad.trim() ? '' : 'La especialidad es obligatoria.'
  errores.telefono = form.telefono.trim() ? '' : 'El teléfono es obligatorio.'
  return !errores.nombre && !errores.email && !errores.especialidad && !errores.telefono
}

async function guardar() {
  formError.value = ''
  if (!validar()) return

  guardando.value = true
  try {
    if (editando.value) {
      await store.actualizarDoctor(editando.value._id, { ...form })
    } else {
      await store.crearDoctor({ ...form })
    }
    modalAbierto.value = false
  } catch (err) {
    formError.value = err.mensajeAmigable || 'No se pudo guardar el doctor.'
  } finally {
    guardando.value = false
  }
}

function pedirEliminar(doctor) {
  doctorAEliminar.value = doctor
}

async function confirmarEliminar() {
  if (!doctorAEliminar.value) return
  eliminando.value = true
  try {
    await store.eliminarDoctor(doctorAEliminar.value._id)
    doctorAEliminar.value = null
  } catch {
    // El error queda reflejado en store.error / banner general.
  } finally {
    eliminando.value = false
  }
}
</script>

<template>
  <div class="section-tight">
    <div class="container">
      <div class="row-between view-head">
        <div>
          <h1>Doctores</h1>
          <p>Directorio del cuerpo médico de la clínica.</p>
        </div>
        <button type="button" class="btn btn-primary" @click="abrirCrear">+ Nuevo doctor</button>
      </div>

      <AlertBanner tipo="error" :mensaje="store.error" @cerrar="store.error = ''" />

      <div class="toolbar">
        <input
          v-model="busqueda"
          type="search"
          class="input toolbar__search"
          placeholder="Buscar por nombre, especialidad o correo…"
        />
      </div>

      <LoadingBlock v-if="store.cargando && !store.lista.length" texto="Cargando doctores…" />

      <div v-else-if="!doctoresFiltrados.length" class="empty-state card">
        <h3>{{ busqueda ? 'Sin resultados' : 'Aún no hay doctores' }}</h3>
        <p>
          {{
            busqueda
              ? 'Prueba con otro término de búsqueda.'
              : 'Registra al primer doctor para empezar a agendar citas.'
          }}
        </p>
        <button v-if="!busqueda" type="button" class="btn btn-primary" @click="abrirCrear">
          + Nuevo doctor
        </button>
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in doctoresFiltrados" :key="d._id">
              <td>{{ d.nombre }}</td>
              <td>{{ d.especialidad }}</td>
              <td>{{ d.email }}</td>
              <td>{{ d.telefono }}</td>
              <td>
                <div class="table-actions">
                  <button type="button" class="btn btn-secondary btn-sm" @click="abrirEditar(d)">
                    Editar
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" @click="pedirEliminar(d)">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalDialog
      v-if="modalAbierto"
      :titulo="editando ? 'Editar doctor' : 'Nuevo doctor'"
      @cerrar="cerrarModal"
    >
      <AlertBanner tipo="error" :mensaje="formError" @cerrar="formError = ''" />
      <form novalidate @submit.prevent="guardar">
        <div class="field">
          <label for="doc-nombre">Nombre completo</label>
          <input
            id="doc-nombre"
            v-model.trim="form.nombre"
            type="text"
            class="input"
            :class="{ 'has-error': errores.nombre }"
          />
          <p v-if="errores.nombre" class="field-error">{{ errores.nombre }}</p>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="doc-email">Correo</label>
            <input
              id="doc-email"
              v-model.trim="form.email"
              type="email"
              class="input"
              :class="{ 'has-error': errores.email }"
            />
            <p v-if="errores.email" class="field-error">{{ errores.email }}</p>
          </div>
          <div class="field">
            <label for="doc-telefono">Teléfono</label>
            <input
              id="doc-telefono"
              v-model.trim="form.telefono"
              type="tel"
              class="input"
              :class="{ 'has-error': errores.telefono }"
            />
            <p v-if="errores.telefono" class="field-error">{{ errores.telefono }}</p>
          </div>
        </div>

        <div class="field">
          <label for="doc-especialidad">Especialidad</label>
          <input
            id="doc-especialidad"
            v-model.trim="form.especialidad"
            type="text"
            class="input"
            :class="{ 'has-error': errores.especialidad }"
            placeholder="Pediatría, Cardiología…"
          />
          <p v-if="errores.especialidad" class="field-error">{{ errores.especialidad }}</p>
        </div>

        <div class="field">
          <label for="doc-cualificaciones">Cualificaciones (opcional)</label>
          <textarea
            id="doc-cualificaciones"
            v-model.trim="form.cualificaciones"
            class="input"
            rows="3"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="guardando">
            <span v-if="guardando" class="spinner" aria-hidden="true"></span>
            {{ guardando ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <ConfirmDialog
      v-if="doctorAEliminar"
      :mensaje="`Esto eliminará a ${doctorAEliminar.nombre} del directorio. Esta acción no se puede deshacer.`"
      :procesando="eliminando"
      @cancelar="doctorAEliminar = null"
      @confirmar="confirmarEliminar"
    />
  </div>
</template>

<style scoped>
.view-head {
  margin-bottom: 20px;
}

.toolbar {
  margin-bottom: 16px;
}

.toolbar__search {
  max-width: 340px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}
</style>
