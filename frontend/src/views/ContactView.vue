<script setup>
import { reactive, ref } from 'vue'
import http from '@/services/http'
import AlertBanner from '@/components/AlertBanner.vue'

const form = reactive({
  email: '',
  mensaje: '',
})

const errores = reactive({
  email: '',
  mensaje: '',
})

const enviando = ref(false)
const exito = ref('')
const errorGeneral = ref('')

// Endpoint configurable para el servicio de correo (por ejemplo un backend
// de Laravel dedicado a notificaciones). Si no se configura, se muestra
// un mensaje de confirmación local sin bloquear al usuario.
const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_API_URL || ''

function validarEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

function validar() {
  errores.email = !form.email
    ? 'El correo es obligatorio.'
    : validarEmail(form.email)
    ? ''
    : 'Ingresa un correo válido.'
  errores.mensaje = form.mensaje.trim().length >= 10 ? '' : 'Cuéntanos un poco más (mínimo 10 caracteres).'
  return !errores.email && !errores.mensaje
}

async function enviar() {
  errorGeneral.value = ''
  exito.value = ''
  if (!validar()) return

  enviando.value = true
  try {
    if (CONTACT_ENDPOINT) {
      await http.post(CONTACT_ENDPOINT, { email: form.email, mensaje: form.mensaje })
    }
    exito.value = 'Mensaje enviado. Te responderemos a la brevedad.'
    form.email = ''
    form.mensaje = ''
  } catch (err) {
    errorGeneral.value = err.mensajeAmigable || 'No se pudo enviar tu mensaje. Intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="section">
    <div class="container contact-grid">
      <div>
        <p class="eyebrow">Contacto</p>
        <h1>Hablemos</h1>
        <p class="contact-lead">
          ¿Dudas sobre ClinicCare o necesitas soporte para tu clínica? Escríbenos y te respondemos en
          menos de 24 horas hábiles.
        </p>

        <div class="card card-pad contact-form-card">
          <AlertBanner tipo="success" :mensaje="exito" @cerrar="exito = ''" />
          <AlertBanner tipo="error" :mensaje="errorGeneral" @cerrar="errorGeneral = ''" />

          <form novalidate @submit.prevent="enviar">
            <div class="field">
              <label for="contact-email">Correo electrónico</label>
              <input
                id="contact-email"
                v-model.trim="form.email"
                type="email"
                class="input"
                :class="{ 'has-error': errores.email }"
                placeholder="tucorreo@ejemplo.com"
              />
              <p v-if="errores.email" class="field-error">{{ errores.email }}</p>
            </div>

            <div class="field">
              <label for="contact-mensaje">Mensaje</label>
              <textarea
                id="contact-mensaje"
                v-model.trim="form.mensaje"
                class="input"
                :class="{ 'has-error': errores.mensaje }"
                rows="5"
                placeholder="Cuéntanos en qué podemos ayudarte"
              ></textarea>
              <p v-if="errores.mensaje" class="field-error">{{ errores.mensaje }}</p>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="enviando">
              <span v-if="enviando" class="spinner" aria-hidden="true"></span>
              {{ enviando ? 'Enviando…' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>
      </div>

      <div class="contact-side">
        <div class="card static-map" role="img" aria-label="Ubicación de la clínica en el mapa">
          <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="none">
            <rect width="400" height="260" fill="var(--color-accent-softer)" />
            <g stroke="var(--color-accent-soft)" stroke-width="2">
              <path d="M0 60 H400 M0 130 H400 M0 200 H400" />
              <path d="M80 0 V260 M200 0 V260 M320 0 V260" />
            </g>
            <circle cx="200" cy="120" r="10" fill="var(--color-accent)" />
            <path
              d="M200 92 c-24 0 -40 18 -40 40 0 30 40 62 40 62 s40 -32 40 -62 c0 -22 -16 -40 -40 -40Z"
              fill="var(--color-accent)"
            />
            <circle cx="200" cy="130" r="10" fill="#fff" />
          </svg>
        </div>

        <div class="card card-pad contact-info">
          <h3>Oficina central</h3>
          <p>Av. Reforma 123, Col. Centro<br />Ciudad de México, México</p>
          <hr class="divider" />
          <p><strong>Correo:</strong> contacto@cliniccare.mx</p>
          <p><strong>Teléfono:</strong> +52 55 1234 5678</p>
          <p><strong>Horario:</strong> Lun–Vie, 9:00–18:00</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

.contact-lead {
  margin-bottom: 24px;
}

.contact-form-card {
  max-width: 520px;
}

.contact-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.static-map {
  overflow: hidden;
  aspect-ratio: 16 / 10;
  padding: 0;
}

.contact-info h3 {
  margin-bottom: 10px;
}

.contact-info p {
  margin: 0 0 8px;
  max-width: none;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .contact-form-card {
    max-width: none;
  }
}
</style>
