<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useCitasStore } from '@/stores/citas'
import { useDoctoresStore } from '@/stores/doctores'
import { usePacientesStore } from '@/stores/pacientes'
import AlertBanner from '@/components/AlertBanner.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const citasStore = useCitasStore()
const doctoresStore = useDoctoresStore()
const pacientesStore = usePacientesStore()

const cargandoInicial = ref(true)

const modalAbierto = ref(false)
const editando = ref(null)
const guardando = ref(false)
const formError = ref('')

const citaAEliminar = ref(null)
const eliminando = ref(false)

const nuevoPacienteAbierto = ref(false)
const nuevoPacienteForm = reactive({ nombre: '', email: '', telefono: '', fecha_nacimiento: '' })
const nuevoPacienteError = ref('')
const creandoPaciente = ref(false)

const vacio = { paciente_id: '', doctor_id: '', fecha_cita: '', notas: '', estado: 'pendiente' }
const form = reactive({ ...vacio })
const errores = reactive({ paciente_id: '', doctor_id: '', fecha_cita: '' })

const ESTADOS = ['pendiente', 'confirmada', 'cancelada', 'completada']

onMounted(async () => {
  try {
    await Promise.all([
      citasStore.obtenerCitas(),
      doctoresStore.obtenerDoctores(),
      pacientesStore.obtenerPacientes(),
    ])
  } finally {
    cargandoInicial.value = false
  }
})

const citasVisibles = computed(() => citasStore.citasFiltradas)

function formatearFecha(valor) {
  const fecha = new Date(valor)
  return fecha.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function aInputDatetimeLocal(valor) {
  const d = new Date(valor)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

function abrirCrear() {
  editando.value = null
  Object.assign(form, vacio)
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  nuevoPacienteAbierto.value = false
  modalAbierto.value = true
}

function abrirEditar(cita) {
  editando.value = cita
  Object.assign(form, {
    paciente_id: cita.paciente_id?._id || cita.paciente_id,
    doctor_id: cita.doctor_id?._id || cita.doctor_id,
    fecha_cita: aInputDatetimeLocal(cita.fecha_cita),
    notas: cita.notas || '',
    estado: cita.estado,
  })
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  nuevoPacienteAbierto.value = false
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
}

function validar() {
  errores.paciente_id = form.paciente_id ? '' : 'Selecciona un paciente.'
  errores.doctor_id = form.doctor_id ? '' : 'Selecciona un doctor.'
  if (!form.fecha_cita) {
    errores.fecha_cita = 'Selecciona fecha y hora.'
  } else if (new Date(form.fecha_cita) < new Date()) {
    errores.fecha_cita = 'La fecha no puede ser en el pasado.'
  } else {
    errores.fecha_cita = ''
  }
  return !errores.paciente_id && !errores.doctor_id && !errores.fecha_cita
}

async function guardar() {
  formError.value = ''
  if (!validar()) return

  guardando.value = true
  try {
    const payload = {
      paciente_id: form.paciente_id,
      doctor_id: form.doctor_id,
      fecha_cita: new Date(form.fecha_cita).toISOString(),
      notas: form.notas,
    }
    if (editando.value) {
      await citasStore.actualizarCita(editando.value._id, { ...payload, estado: form.estado })
    } else {
      await citasStore.crearCita(payload)
    }
    modalAbierto.value = false
  } catch (err) {
    formError.value = err.mensajeAmigable || 'No se pudo guardar la cita.'
  } finally {
    guardando.value = false
  }
}

function pedirEliminar(cita) {
  citaAEliminar.value = cita
}

async function confirmarEliminar() {
  if (!citaAEliminar.value) return
  eliminando.value = true
  try {
    await citasStore.eliminarCita(citaAEliminar.value._id)
    citaAEliminar.value = null
  } finally {
    eliminando.value = false
  }
}

async function crearPacienteRapido() {
  nuevoPacienteError.value = ''
  if (
    !nuevoPacienteForm.nombre.trim() ||
    !nuevoPacienteForm.email.trim() ||
    !nuevoPacienteForm.telefono.trim() ||
    !nuevoPacienteForm.fecha_nacimiento
  ) {
    nuevoPacienteError.value = 'Completa todos los campos del paciente.'
    return
  }
  creandoPaciente.value = true
  try {
    const nuevo = await pacientesStore.crearPaciente({ ...nuevoPacienteForm })
    form.paciente_id = nuevo._id
    nuevoPacienteAbierto.value = false
    Object.assign(nuevoPacienteForm, { nombre: '', email: '', telefono: '', fecha_nacimiento: '' })
  } catch (err) {
    nuevoPacienteError.value = err.mensajeAmigable || 'No se pudo crear el paciente.'
  } finally {
    creandoPaciente.value = false
  }
}
</script>

<template>
  <div class="section-tight">
    <div class="container">
      <div class="row-between view-head">
        <div>
          <h1>Citas</h1>
          <p>Agenda y da seguimiento a las citas médicas.</p>
        </div>
        <button type="button" class="btn btn-primary" @click="abrirCrear">+ Agendar cita</button>
      </div>

      <AlertBanner tipo="error" :mensaje="citasStore.error" @cerrar="citasStore.error = ''" />

      <div class="toolbar">
        <select v-model="citasStore.filtros.estado" class="input toolbar__select">
          <option value="">Todos los estados</option>
          <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
        </select>
        <select v-model="citasStore.filtros.doctorId" class="input toolbar__select">
          <option value="">Todos los doctores</option>
          <option v-for="d in doctoresStore.lista" :key="d._id" :value="d._id">{{ d.nombre }}</option>
        </select>
      </div>

      <LoadingBlock v-if="cargandoInicial" texto="Cargando citas…" />

      <div v-else-if="!citasVisibles.length" class="empty-state card">
        <h3>Sin citas que mostrar</h3>
        <p>Ajusta los filtros o agenda una nueva cita.</p>
        <button type="button" class="btn btn-primary" @click="abrirCrear">+ Agendar cita</button>
      </div>

      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Fecha y hora</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in citasVisibles" :key="c._id">
              <td>{{ c.paciente_id?.nombre || '—' }}</td>
              <td>
                {{ c.doctor_id?.nombre || '—' }}
                <span v-if="c.doctor_id?.especialidad" class="td-sub">{{ c.doctor_id.especialidad }}</span>
              </td>
              <td>{{ formatearFecha(c.fecha_cita) }}</td>
              <td><span class="badge" :class="`badge-${c.estado}`">{{ c.estado }}</span></td>
              <td>
                <div class="table-actions">
                  <button type="button" class="btn btn-secondary btn-sm" @click="abrirEditar(c)">
                    Editar
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" @click="pedirEliminar(c)">
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
      :titulo="editando ? 'Editar cita' : 'Agendar cita'"
      @cerrar="cerrarModal"
    >
      <AlertBanner tipo="error" :mensaje="formError" @cerrar="formError = ''" />
      <form novalidate @submit.prevent="guardar">
        <div class="field">
          <div class="row-between">
            <label for="cita-paciente" class="no-margin">Paciente</label>
            <button
              type="button"
              class="link-btn"
              @click="nuevoPacienteAbierto = !nuevoPacienteAbierto"
            >
              {{ nuevoPacienteAbierto ? 'Cancelar' : '+ Nuevo paciente' }}
            </button>
          </div>
          <select
            id="cita-paciente"
            v-model="form.paciente_id"
            class="input"
            :class="{ 'has-error': errores.paciente_id }"
          >
            <option value="" disabled>Selecciona un paciente</option>
            <option v-for="p in pacientesStore.lista" :key="p._id" :value="p._id">{{ p.nombre }}</option>
          </select>
          <p v-if="errores.paciente_id" class="field-error">{{ errores.paciente_id }}</p>

          <div v-if="nuevoPacienteAbierto" class="quick-patient">
            <AlertBanner tipo="error" :mensaje="nuevoPacienteError" @cerrar="nuevoPacienteError = ''" />
            <div class="field-row">
              <input v-model.trim="nuevoPacienteForm.nombre" class="input" placeholder="Nombre" />
              <input v-model.trim="nuevoPacienteForm.email" class="input" placeholder="Correo" type="email" />
            </div>
            <div class="field-row">
              <input v-model.trim="nuevoPacienteForm.telefono" class="input" placeholder="Teléfono" />
              <input v-model="nuevoPacienteForm.fecha_nacimiento" class="input" type="date" />
            </div>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :disabled="creandoPaciente"
              @click="crearPacienteRapido"
            >
              <span v-if="creandoPaciente" class="spinner" aria-hidden="true"></span>
              {{ creandoPaciente ? 'Creando…' : 'Guardar paciente' }}
            </button>
          </div>
        </div>

        <div class="field">
          <label for="cita-doctor">Doctor</label>
          <select
            id="cita-doctor"
            v-model="form.doctor_id"
            class="input"
            :class="{ 'has-error': errores.doctor_id }"
          >
            <option value="" disabled>Selecciona un doctor</option>
            <option v-for="d in doctoresStore.lista" :key="d._id" :value="d._id">
              {{ d.nombre }} — {{ d.especialidad }}
            </option>
          </select>
          <p v-if="errores.doctor_id" class="field-error">{{ errores.doctor_id }}</p>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="cita-fecha">Fecha y hora</label>
            <input
              id="cita-fecha"
              v-model="form.fecha_cita"
              type="datetime-local"
              class="input"
              :class="{ 'has-error': errores.fecha_cita }"
            />
            <p v-if="errores.fecha_cita" class="field-error">{{ errores.fecha_cita }}</p>
          </div>

          <div v-if="editando" class="field">
            <label for="cita-estado">Estado</label>
            <select id="cita-estado" v-model="form.estado" class="input">
              <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label for="cita-notas">Notas (opcional)</label>
          <textarea id="cita-notas" v-model.trim="form.notas" class="input" rows="3"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="guardando">
            <span v-if="guardando" class="spinner" aria-hidden="true"></span>
            {{ guardando ? 'Guardando…' : 'Guardar cita' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <ConfirmDialog
      v-if="citaAEliminar"
      mensaje="Esto eliminará la cita de forma permanente."
      :procesando="eliminando"
      @cancelar="citaAEliminar = null"
      @confirmar="confirmarEliminar"
    />
  </div>
</template>

<style scoped>
.view-head {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar__select {
  max-width: 220px;
}

.td-sub {
  display: block;
  font-size: 0.78rem;
  color: var(--color-text-faint);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

.no-margin {
  margin-bottom: 0 !important;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-accent-dark);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.quick-patient {
  margin-top: 10px;
  padding: 14px;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
}
</style>
