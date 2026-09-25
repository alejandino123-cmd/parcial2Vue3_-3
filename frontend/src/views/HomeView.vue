<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const modulos = [
  {
    titulo: 'Pacientes',
    texto:
      'Historial médico, datos de contacto y fecha de nacimiento en un registro centralizado y siempre a mano.',
  },
  {
    titulo: 'Doctores',
    texto: 'Directorio del cuerpo médico por especialidad, con teléfono y cualificaciones al detalle.',
  },
  {
    titulo: 'Citas',
    texto:
      'Agenda, confirma y da seguimiento a cada cita, con detección automática de choques de horario.',
  },
  {
    titulo: 'Reportes',
    texto: 'Panorama de citas por estado y por doctor para entender la carga de trabajo de un vistazo.',
  },
]
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">Sistema de gestión médica</p>
          <h1>El consultorio, ordenado en un solo lugar.</h1>
          <p class="hero__lead">
            ClinicCare reúne pacientes, doctores y citas en un flujo de trabajo simple, para que tu
            equipo pase menos tiempo en hojas sueltas y más tiempo con las personas.
          </p>
          <div class="hero__actions">
            <RouterLink v-if="!auth.estaAutenticado" to="/register" class="btn btn-primary"
              >Crear cuenta</RouterLink
            >
            <RouterLink v-if="!auth.estaAutenticado" to="/login" class="btn btn-secondary"
              >Iniciar sesión</RouterLink
            >
            <RouterLink v-else to="/dashboard" class="btn btn-primary">Ir al panel</RouterLink>
            <RouterLink to="/contact" class="btn btn-ghost">Hablar con nosotros</RouterLink>
          </div>
        </div>

        <div class="hero__art" aria-hidden="true">
          <svg viewBox="0 0 360 360" width="100%" height="100%">
            <circle cx="180" cy="180" r="150" fill="var(--color-accent-softer)" />
            <circle cx="180" cy="180" r="104" fill="var(--color-accent-soft)" />
            <path
              d="M60 190 h60 l18-46 26 92 22-64 14 34 h60"
              fill="none"
              stroke="var(--color-accent)"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head">
          <h2>Todo el flujo clínico, en cuatro módulos</h2>
          <p>Cada módulo se conecta con los demás: agenda una cita y ya sabes quién, con quién y cuándo.</p>
        </div>

        <div class="modules-grid">
          <div v-for="m in modulos" :key="m.titulo" class="card card-pad module-card">
            <h3>{{ m.titulo }}</h3>
            <p>{{ m.texto }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="container">
        <div class="card cta-card">
          <div>
            <h2>¿Lista tu clínica para empezar?</h2>
            <p>Crea una cuenta de recepción y agenda tu primera cita en minutos.</p>
          </div>
          <RouterLink :to="auth.estaAutenticado ? '/appointments' : '/register'" class="btn btn-primary">
            {{ auth.estaAutenticado ? 'Agendar una cita' : 'Empezar ahora' }}
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 64px 0 20px;
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}

.hero__lead {
  font-size: 1.05rem;
  max-width: 46ch;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.hero__art {
  max-width: 340px;
  margin: 0 auto;
}

.section__head {
  max-width: 56ch;
  margin-bottom: 32px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.module-card h3 {
  margin-bottom: 8px;
}

.module-card p {
  font-size: 0.9rem;
  margin: 0;
}

.cta-card {
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  background: var(--color-accent-softer);
  border-color: var(--color-accent-soft);
}

.cta-card h2 {
  margin-bottom: 4px;
}

.cta-card p {
  margin: 0;
}

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
  .hero__art {
    order: -1;
    max-width: 220px;
  }
  .modules-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }
  .cta-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
