import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Se inyecta desde main.js para poder redirigir al login sin depender
// directamente del router (evita dependencias circulares).
let onUnauthorized = () => {}
export function registrarManejadorNoAutorizado(fn) {
  onUnauthorized = fn
}

// Adjunta el token a cada petición saliente.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Maneja errores de red y sesiones expiradas de forma centralizada.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.mensajeAmigable = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      return Promise.reject(error)
    }

    const { status, data } = error.response

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      onUnauthorized()
    }

    if (data?.errores?.length) {
      error.mensajeAmigable = data.errores.map((e) => e.msg).join(' · ')
    } else {
      error.mensajeAmigable = data?.mensaje || 'Ocurrió un error inesperado.'
    }

    return Promise.reject(error)
  }
)

export default http
