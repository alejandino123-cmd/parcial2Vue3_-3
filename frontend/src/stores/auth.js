import { defineStore } from 'pinia'
import authService from '@/services/authService'

function leerUsuarioGuardado() {
  try {
    const crudo = localStorage.getItem('usuario')
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: leerUsuarioGuardado(),
    token: localStorage.getItem('token') || null,
    cargando: false,
    error: null,
  }),

  getters: {
    estaAutenticado: (state) => Boolean(state.token),
    nombreUsuario: (state) => state.usuario?.nombre || '',
  },

  actions: {
    guardarSesion({ usuario, token }) {
      this.usuario = usuario
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('usuario', JSON.stringify(usuario))
    },

    async login(credenciales) {
      this.cargando = true
      this.error = null
      try {
        const data = await authService.login(credenciales)
        this.guardarSesion(data)
        return true
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo iniciar sesión.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async registro(datos) {
      this.cargando = true
      this.error = null
      try {
        const data = await authService.registro(datos)
        this.guardarSesion(data)
        return true
      } catch (err) {
        this.error = err.mensajeAmigable || 'No se pudo completar el registro.'
        throw err
      } finally {
        this.cargando = false
      }
    },

    async logout() {
      try {
        if (this.token) await authService.logout()
      } catch {
        // Si la petición falla igual limpiamos la sesión local.
      } finally {
        this.limpiarSesion()
      }
    },

    limpiarSesion() {
      this.usuario = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    },

    verificarToken() {
      // Verificación ligera de presencia/formato; el backend valida la firma.
      const token = localStorage.getItem('token')
      if (!token) {
        this.limpiarSesion()
        return false
      }
      this.token = token
      this.usuario = leerUsuarioGuardado()
      return true
    },
  },
})
