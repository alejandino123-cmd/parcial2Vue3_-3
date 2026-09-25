import http from './http'

export default {
  registro(datos) {
    return http.post('/register', datos).then((res) => res.data)
  },
  login(credenciales) {
    return http.post('/login', credenciales).then((res) => res.data)
  },
  logout() {
    return http.post('/logout').then((res) => res.data)
  },
}
