<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AlertBanner from '@/components/AlertBanner.vue'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  confirmacion: '',
})

const errores = reactive({
  nombre: '',
  email: '',
  password: '',
  confirmacion: '',
})

const errorGeneral = ref('')
const enviando = ref(false)

function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

function fortalezaPassword(valor) {
  // Al menos 6 caracteres (regla del backend) + al menos una letra y un número.
  return valor.length >= 6 && /[a-zA-Z]/.test(valor) && /\d/.test(valor)
}

function validar() {
  errores.nombre = form.nombre.trim() ? '' : 'Escribe tu nombre completo.'
  errores.email = !form.email
    ? 'El correo es obligatorio.'
    : validarEmail(form.email)
    ? ''
    : 'Ingresa un correo válido.'
  errores.password = !form.password
    ? 'La contraseña es obligatoria.'
    : fortalezaPassword(form.password)
    ? ''
    : 'Usa al menos 6 caracteres, con letras y números.'
  errores.confirmacion =
    form.confirmacion === form.password ? '' : 'Las contraseñas no coinciden.'

  return !errores.nombre && !errores.email && !errores.password && !errores.confirmacion
}

async function enviar() {
  errorGeneral.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    await auth.registro({ nombre: form.nombre.trim(), email: form.email, password: form.password })
    router.push('/dashboard')
  } catch (err) {
    errorGeneral.value = err.mensajeAmigable || 'No se pudo completar el registro.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="section auth-view">
    <div class="container-narrow">
      <div class="card card-pad">
        <p class="eyebrow">Únete al equipo</p>
        <h1 class="auth-title">Crea tu cuenta</h1>
        <p class="auth-sub">Regístrate para administrar pacientes, doctores y citas.</p>

        <AlertBanner tipo="error" :mensaje="errorGeneral" @cerrar="errorGeneral = ''" />

        <form novalidate @submit.prevent="enviar">
          <div class="field">
            <label for="nombre">Nombre completo</label>
            <input
              id="nombre"
              v-model.trim="form.nombre"
              type="text"
              class="input"
              :class="{ 'has-error': errores.nombre }"
              placeholder="Ana Martínez"
              autocomplete="name"
            />
            <p v-if="errores.nombre" class="field-error">{{ errores.nombre }}</p>
          </div>

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
            <p v-else class="field-hint">Debe ser único: se usará para iniciar sesión.</p>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="password">Contraseña</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="input"
                :class="{ 'has-error': errores.password }"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
              />
              <p v-if="errores.password" class="field-error">{{ errores.password }}</p>
            </div>

            <div class="field">
              <label for="confirmacion">Confirmar contraseña</label>
              <input
                id="confirmacion"
                v-model="form.confirmacion"
                type="password"
                class="input"
                :class="{ 'has-error': errores.confirmacion }"
                placeholder="Repite tu contraseña"
                autocomplete="new-password"
              />
              <p v-if="errores.confirmacion" class="field-error">{{ errores.confirmacion }}</p>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="enviando">
            <span v-if="enviando" class="spinner" aria-hidden="true"></span>
            {{ enviando ? 'Creando cuenta…' : 'Crear cuenta' }}
          </button>
        </form>

        <p class="auth-foot">
          ¿Ya tienes cuenta?
          <RouterLink to="/login">Inicia sesión</RouterLink>
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
