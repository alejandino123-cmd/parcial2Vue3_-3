<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCitasStore } from '@/stores/citas'
import { useDoctoresStore } from '@/stores/doctores'
import { usePacientesStore } from '@/stores/pacientes'
import reportesService from '@/services/reportesService'
import AlertBanner from '@/components/AlertBanner.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const auth = useAuthStore()
const citasStore = useCitasStore()
const doctoresStore = useDoctoresStore()
const pacientesStore = usePacientesStore()

const pestana = ref('resumen') // 'resumen' | 'pacientes'

const cargandoReportes = ref(true)
const errorReportes = ref('')
const porEstado = ref([])
const porDoctor = ref([])

const ETIQUETAS_ESTADO = {
  pendiente: 'Pendientes',
  confirmada: 'Confirmadas',
  cancelada: 'Canceladas',
  completada: 'Completadas',
}

async function cargarReportes() {
  cargandoReportes.value = true
  errorReportes.value = ''
  try {
    const [estado, doctor] = await Promise.all([
      reportesService.citasPorEstado(),
      reportesService.citasPorDoctor(),
    ])
    porEstado.value = estado
    porDoctor.value = doctor
  } catch (err) {
    errorReportes.value = err.mensajeAmigable || 'No se pudieron cargar los reportes.'
  } finally {
    cargandoReportes.value = false
  }
}

const totalCitasReporte = computed(() => porEstado.value.reduce((acc, r) => acc + r.total, 0))
const maxPorDoctor = computed(() => Math.max(1, ...porDoctor.value.map((d) => d.total_citas)))

// ---- Pestaña de pacientes (CRUD) ----
const modalAbierto = ref(false)
const editando = ref(null)
const guardando = ref(false)
const formError = ref('')

const pacienteAEliminar = ref(null)
const eliminando = ref(false)

const vacio = { nombre: '', email: '', telefono: '', fecha_nacimiento: '', historial_medico: '' }
const form = reactive({ ...vacio })
const errores = reactive({ nombre: '', email: '', telefono: '', fecha_nacimiento: '' })

function formatearFechaCorta(valor) {
  return new Date(valor).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function aInputDate(valor) {
  return new Date(valor).toISOString().slice(0, 10)
}

function abrirCrear() {
  editando.value = null
  Object.assign(form, vacio)
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  modalAbierto.value = true
}

function abrirEditar(paciente) {
  editando.value = paciente
  Object.assign(form, {
    nombre: paciente.nombre,
    email: paciente.email,
    telefono: paciente.telefono,
    fecha_nacimiento: aInputDate(paciente.fecha_nacimiento),
    historial_medico: paciente.historial_medico || '',
  })
  Object.keys(errores).forEach((k) => (errores[k] = ''))
  formError.value = ''
  modalAbierto.value = true
}

function validar() {
  errores.nombre = form.nombre.trim() ? '' : 'El nombre es obligatorio.'
  errores.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Ingresa un correo válido.'
  errores.telefono = form.telefono.trim() ? '' : 'El teléfono es obligatorio.'
  errores.fecha_nacimiento = form.fecha_nacimiento ? '' : 'Selecciona la fecha de nacimiento.'
  return !errores.nombre && !errores.email && !errores.telefono && !errores.fecha_nacimiento
}

async function guardar() {
  formError.value = ''
  if (!validar()) return

  guardando.value = true
  try {
    if (editando.value) {
      await pacientesStore.actualizarPaciente(editando.value._id, { ...form })
    } else {
      await pacientesStore.crearPaciente({ ...form })
    }
    modalAbierto.value = false
  } catch (err) {
    formError.value = err.mensajeAmigable || 'No se pudo guardar el paciente.'
  } finally {
    guardando.value = false
  }
}

function pedirEliminar(paciente) {
  pacienteAEliminar.value = paciente
}

async function confirmarEliminar() {
  if (!pacienteAEliminar.value) return
  eliminando.value = true
  try {
    await pacientesStore.eliminarPaciente(pacienteAEliminar.value._id)
    pacienteAEliminar.value = null
  } finally {
    eliminando.value = false
  }
}

onMounted(() => {
  cargarReportes()
  doctoresStore.obtenerDoctores()
  pacientesStore.obtenerPacientes()
  citasStore.obtenerCitas()
})
</script>

<template>
  <div class="section-tight">
    <div class="container">
      <div class="view-head">
        <h1>Hola, {{ auth.nombreUsuario.split(' ')[0] || auth.nombreUsuario }}</h1>
        <p>Este es el panorama de tu clínica hoy.</p>
      </div>

      <div class="stats-grid">
        <div class="card card-pad stat-card">
          <span class="stat-value">{{ pacientesStore.lista.length }}</span>
          <span class="stat-label">Pacientes</span>
        </div>
        <div class="card card-pad stat-card">
          <span class="stat-value">{{ doctoresStore.lista.length }}</span>
          <span class="stat-label">Doctores</span>
        </div>
        <div class="card card-pad stat-card">
          <span class="stat-value">{{ citasStore.lista.length }}</span>
          <span class="stat-label">Citas totales</span>
        </div>
        <div class="card card-pad stat-card">
          <span class="stat-value">{{ totalCitasReporte }}</span>
          <span class="stat-label">Citas registradas</span>
        </div>
      </div>

      <div class="tabs">
        <button
          type="button"
          class="tab"
          :class="{ 'tab--active': pestana === 'resumen' }"
          @click="pestana = 'resumen'"
        >
          Resumen
        </button>
        <button
          type="button"
          class="tab"
          :class="{ 'tab--active': pestana === 'pacientes' }"
          @click="pestana = 'pacientes'"
        >
          Pacientes
        </button>
      </div>

      <!-- ---------- RESUMEN / REPORTES ---------- -->
      <div v-if="pestana === 'resumen'">
        <AlertBanner tipo="error" :mensaje="errorReportes" @cerrar="errorReportes = ''" />
        <LoadingBlock v-if="cargandoReportes" texto="Cargando reportes…" />

        <div v-else class="reports-grid">
          <div class="card card-pad">
            <h3>Citas por estado</h3>
            <div v-if="!porEstado.length" class="empty-state">
              <p>Aún no hay citas registradas.</p>
            </div>
            <ul v-else class="bar-list">
              <li v-for="r in porEstado" :key="r.estado" class="bar-row">
                <span class="bar-row__label">
                  <span class="badge" :class="`badge-${r.estado}`">{{
                    ETIQUETAS_ESTADO[r.estado] || r.estado
                  }}</span>
                </span>
                <span class="bar-row__track">
                  <span
                    class="bar-row__fill"
                    :style="{ width: (r.total / Math.max(1, totalCitasReporte)) * 100 + '%' }"
                  ></span>
                </span>
                <span class="bar-row__value">{{ r.total }}</span>
              </li>
            </ul>
          </div>

          <div class="card card-pad">
            <h3>Citas por doctor</h3>
            <div v-if="!porDoctor.length" class="empty-state">
              <p>Aún no hay citas asignadas a doctores.</p>
            </div>
            <ul v-else class="bar-list">
              <li v-for="d in porDoctor" :key="d.doctor_id" class="bar-row">
                <span class="bar-row__label bar-row__label--name">{{ d.nombre }}</span>
                <span class="bar-row__track">
                  <span
                    class="bar-row__fill bar-row__fill--alt"
                    :style="{ width: (d.total_citas / maxPorDoctor) * 100 + '%' }"
                  ></span>
                </span>
                <span class="bar-row__value">{{ d.total_citas }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ---------- PACIENTES ---------- -->
      <div v-else>
        <div class="row-between pacientes-head">
          <p class="pacientes-sub">Registro de pacientes de la clínica.</p>
          <button type="button" class="btn btn-primary" @click="abrirCrear">+ Nuevo paciente</button>
        </div>

        <AlertBanner tipo="error" :mensaje="pacientesStore.error" @cerrar="pacientesStore.error = ''" />

        <LoadingBlock v-if="pacientesStore.cargando && !pacientesStore.lista.length" texto="Cargando pacientes…" />

        <div v-else-if="!pacientesStore.lista.length" class="empty-state card">
          <h3>Aún no hay pacientes</h3>
          <p>Registra al primer paciente de la clínica.</p>
          <button type="button" class="btn btn-primary" @click="abrirCrear">+ Nuevo paciente</button>
        </div>

        <div v-else class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Nacimiento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in pacientesStore.lista" :key="p._id">
                <td>{{ p.nombre }}</td>
                <td>{{ p.email }}</td>
                <td>{{ p.telefono }}</td>
                <td>{{ formatearFechaCorta(p.fecha_nacimiento) }}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" class="btn btn-secondary btn-sm" @click="abrirEditar(p)">
                      Editar
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" @click="pedirEliminar(p)">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ModalDialog
      v-if="modalAbierto"
      :titulo="editando ? 'Editar paciente' : 'Nuevo paciente'"
      @cerrar="modalAbierto = false"
    >
      <AlertBanner tipo="error" :mensaje="formError" @cerrar="formError = ''" />
      <form novalidate @submit.prevent="guardar">
        <div class="field">
          <label for="pac-nombre">Nombre completo</label>
          <input
            id="pac-nombre"
            v-model.trim="form.nombre"
            type="text"
            class="input"
            :class="{ 'has-error': errores.nombre }"
          />
          <p v-if="errores.nombre" class="field-error">{{ errores.nombre }}</p>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="pac-email">Correo</label>
            <input
              id="pac-email"
              v-model.trim="form.email"
              type="email"
              class="input"
              :class="{ 'has-error': errores.email }"
            />
            <p v-if="errores.email" class="field-error">{{ errores.email }}</p>
          </div>
          <div class="field">
            <label for="pac-telefono">Teléfono</label>
            <input
              id="pac-telefono"
              v-model.trim="form.telefono"
              type="tel"
              class="input"
              :class="{ 'has-error': errores.telefono }"
            />
            <p v-if="errores.telefono" class="field-error">{{ errores.telefono }}</p>
          </div>
        </div>

        <div class="field">
          <label for="pac-nacimiento">Fecha de nacimiento</label>
          <input
            id="pac-nacimiento"
            v-model="form.fecha_nacimiento"
            type="date"
            class="input"
            :class="{ 'has-error': errores.fecha_nacimiento }"
          />
          <p v-if="errores.fecha_nacimiento" class="field-error">{{ errores.fecha_nacimiento }}</p>
        </div>

        <div class="field">
          <label for="pac-historial">Historial médico (opcional)</label>
          <textarea id="pac-historial" v-model.trim="form.historial_medico" class="input" rows="3"></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="modalAbierto = false">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="guardando">
            <span v-if="guardando" class="spinner" aria-hidden="true"></span>
            {{ guardando ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </ModalDialog>

    <ConfirmDialog
      v-if="pacienteAEliminar"
      :mensaje="`Esto eliminará a ${pacienteAEliminar.nombre} del registro. Esta acción no se puede deshacer.`"
      :procesando="eliminando"
      @cancelar="pacienteAEliminar = null"
      @confirmar="confirmarEliminar"
    />
  </div>
</template>

<style scoped>
.view-head {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-accent-dark);
}

.stat-label {
  font-size: 0.82rem;
  color: var(--color-text-soft);
}

.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 22px;
}

.tab {
  background: none;
  border: none;
  padding: 10px 4px;
  margin-right: 20px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text-faint);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab--active {
  color: var(--color-accent-dark);
  border-bottom-color: var(--color-accent);
}

.reports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.reports-grid h3 {
  margin-bottom: 16px;
}

.bar-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bar-row {
  display: grid;
  grid-template-columns: 120px 1fr 32px;
  align-items: center;
  gap: 12px;
}

.bar-row__label--name {
  font-size: 0.85rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-row__track {
  height: 8px;
  border-radius: 999px;
  background: var(--color-surface-muted);
  overflow: hidden;
}

.bar-row__fill {
  display: block;
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
}

.bar-row__fill--alt {
  background: var(--color-info);
}

.bar-row__value {
  text-align: right;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-soft);
}

.pacientes-head {
  margin-bottom: 16px;
}

.pacientes-sub {
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .bar-row {
    grid-template-columns: 90px 1fr 28px;
  }
}
</style>
