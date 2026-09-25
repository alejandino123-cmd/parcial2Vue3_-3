<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertBanner from '@/components/AlertBanner.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: '',
})

const errores = reactive({
  email: '',
  password: '',
})

const errorGeneral = ref('')
const enviando = ref(false)

function validarEmail(valor) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(valor)
}

function validar() {
  errores.email = form.email
    ? validarEmail(form.email)
      ? ''
      : 'Ingresa un correo válido.'
    : 'El correo es obligatorio.'
  errores.password = form.password ? '' : 'La contraseña es obligatoria.'
  return !errores.email && !errores.password
}

async function enviar() {
  errorGeneral.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    await auth.login({ email: form.email, password: form.password })
    const destino = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(destino)
  } catch (err) {
    errorGeneral.value = err.mensajeAmigable || 'No se pudo iniciar sesión.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="section auth-view">
    <div class="container-narrow">
      <div class="card card-pad">
        <p class="eyebrow">Bienvenido de nuevo</p>
        <h1 class="auth-title">Inicia sesión</h1>
        <p class="auth-sub">Accede al panel para gestionar pacientes, doctores y citas.</p>

        <AlertBanner tipo="error" :mensaje="errorGeneral" @cerrar="errorGeneral = ''" />

        <form novalidate @submit.prevent="enviar">
          <div class="field">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="input"
              :class="{ 'has-error': errores.email }"
              placeholder="tucorreo@clinica.com"
              autocomplete="email"
            />
            <p v-if="errores.email" class="field-error">{{ errores.email }}</p>
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="input"
              :class="{ 'has-error': errores.password }"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <p v-if="errores.password" class="field-error">{{ errores.password }}</p>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="enviando">
            <span v-if="enviando" class="spinner" aria-hidden="true"></span>
            {{ enviando ? 'Ingresando…' : 'Iniciar sesión' }}
          </button>
        </form>

        <p class="auth-foot">
          ¿No tienes cuenta?
          <RouterLink to="/register">Regístrate aquí</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-title {
  margin-bottom: 6px;
}
.auth-sub {
  margin-bottom: 24px;
}
.auth-foot {
  text-align: center;
  margin: 20px 0 0;
  font-size: 0.9rem;
}
</style>
