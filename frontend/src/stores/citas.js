import { defineStore } from 'pinia'
import citasService from '@/services/citasService'

export const useCitasStore = defineStore('citas', {
  state: () => ({
    lista: [],
    citaActual: null,
    filtros: {
      estado: '',
      doctorId: '',
    },
    cargando: false,
    error: null,
  }),

  getters: {
    citasFiltradas: (state) => {
      return state.lista.filter((cita) => {
        const coincideEstado = !state.filtros.estado || cita.estado === state.filtros.estado
        const coincideDoctor =
          !state.filtros.doctorId || cita.doctor_id?._id === state.filtros.doctorId
        return coincideEstado && coincideDoctor
      })
    },
  },

  actions: {
    async obtenerCitas() {
      this.cargando = true
      this.error = null
      try {
        this.lista = await citasService.listar()
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudieron cargar las citas.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async crearCita(datos) {
      this.error = null
      try {
        const nueva = await citasService.crear(datos)
        this.lista.unshift(nueva)
        return nueva
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo agendar la cita.'
        throw err
      }
    },

    async actualizarCita(id, datos) {
      this.error = null
      try {
        const actualizada = await citasService.actualizar(id, datos)
        const i = this.lista.findIndex((c) => c._id === id)
        if (i !== -1) this.lista[i] = actualizada
        return actualizada
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo actualizar la cita.'
        throw err
      }
    },

    async cambiarEstado(id, estado) {
      return this.actualizarCita(id, { estado })
    },

    async eliminarCita(id) {
      this.error = null
      try {
        await citasService.eliminar(id)
        this.lista = this.lista.filter((c) => c._id !== id)
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo eliminar la cita.'
        throw err
      }
    },

    establecerFiltros(filtros) {
      this.filtros = { ...this.filtros, ...filtros }
    },
  },
})
