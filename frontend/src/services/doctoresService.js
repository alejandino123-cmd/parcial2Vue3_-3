import http from './http'

const BASE = '/doctores'

export default {
  listar() {
    return http.get(BASE).then((res) => res.data)
  },
  obtener(id) {
    return http.get(`${BASE}/${id}`).then((res) => res.data)
  },
  crear(datos) {
    return http.post(BASE, datos).then((res) => res.data)
  },
  actualizar(id, datos) {
    return http.put(`${BASE}/${id}`, datos).then((res) => res.data)
  },
  eliminar(id) {
    return http.delete(`${BASE}/${id}`).then((res) => res.data)
  },
}
