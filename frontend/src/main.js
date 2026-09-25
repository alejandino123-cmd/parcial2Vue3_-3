import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { registrarManejadorNoAutorizado } from './services/http'
import { useAuthStore } from './stores/auth'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Si el backend responde 401 (token vencido/ inválido), limpiamos la sesión
// y mandamos al usuario a login conservando la ruta a la que intentaba entrar.
registrarManejadorNoAutorizado(() => {
  const auth = useAuthStore()
  auth.limpiarSesion()
  if (router.currentRoute.value.meta?.requiereAuth) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  }
})

useAuthStore().verificarToken()

app.mount('#app')
