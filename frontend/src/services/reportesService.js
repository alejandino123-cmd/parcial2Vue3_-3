import http from './http'

const BASE = '/reportes'

export default {
  citasPorEstado() {
    return http.get(`${BASE}/citas-por-estado`).then((res) => res.data)
  },
  citasPorDoctor() {
    return http.get(`${BASE}/citas-por-doctor`).then((res) => res.data)
  },
}
