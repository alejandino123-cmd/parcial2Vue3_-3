import { defineStore } from 'pinia'
import pacientesService from '@/services/pacientesService'

export const usePacientesStore = defineStore('pacientes', {
  state: () => ({
    lista: [],
    pacienteActual: null,
    cargando: false,
    error: null,
  }),

  actions: {
    async obtenerPacientes() {
      this.cargando = true
      this.error = null
      try {
        this.lista = await pacientesService.listar()
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudieron cargar los pacientes.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async obtenerPaciente(id) {
      this.cargando = true
      this.error = null
      try {
        this.pacienteActual = await pacientesService.obtener(id)
        return this.pacienteActual
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo cargar el paciente.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async crearPaciente(datos) {
      this.error = null
      try {
        const nuevo = await pacientesService.crear(datos)
        this.lista.unshift(nuevo)
        return nuevo
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo crear el paciente.'
        throw err
      }
    },

    async actualizarPaciente(id, datos) {
      this.error = null
      try {
        const actualizado = await pacientesService.actualizar(id, datos)
        const i = this.lista.findIndex((p) => p._id === id)
        if (i !== -1) this.lista[i] = actualizado
        return actualizado
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo actualizar el paciente.'
        throw err
      }
    },

    async eliminarPaciente(id) {
      this.error = null
      try {
        await pacientesService.eliminar(id)
        this.lista = this.lista.filter((p) => p._id !== id)
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo eliminar el paciente.'
        throw err
      }
    },
  },
})
