import { defineStore } from 'pinia'
import doctoresService from '@/services/doctoresService'

export const useDoctoresStore = defineStore('doctores', {
  state: () => ({
    lista: [],
    doctorActual: null,
    cargando: false,
    error: null,
  }),

  actions: {
    async obtenerDoctores() {
      this.cargando = true
      this.error = null
      try {
        this.lista = await doctoresService.listar()
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudieron cargar los doctores.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async obtenerDoctor(id) {
      this.cargando = true
      this.error = null
      try {
        this.doctorActual = await doctoresService.obtener(id)
        return this.doctorActual
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo cargar el doctor.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async crearDoctor(datos) {
      this.error = null
      try {
        const nuevo = await doctoresService.crear(datos)
        this.lista.unshift(nuevo)
        return nuevo
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo crear el doctor.'
        throw err
      }
    },

    async actualizarDoctor(id, datos) {
      this.error = null
      try {
        const actualizado = await doctoresService.actualizar(id, datos)
        const i = this.lista.findIndex((d) => d._id === id)
        if (i !== -1) this.lista[i] = actualizado
        return actualizado
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo actualizar el doctor.'
        throw err
      }
    },

    async eliminarDoctor(id) {
      this.error = null
      try {
        await doctoresService.eliminar(id)
        this.lista = this.lista.filter((d) => d._id !== id)
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo eliminar el doctor.'
        throw err
      }
    },
  },
})
