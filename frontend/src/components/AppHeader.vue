<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuAbierto = ref(false)

async function cerrarSesion() {
  await auth.logout()
  menuAbierto.value = false
  router.push({ name: 'inicio' })
}

function iniciales(nombre) {
  if (!nombre) return '?'
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <RouterLink to="/" class="brand" @click="menuAbierto = false">
        <span class="brand__mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v7m0 0v7m0-7h7m-7 0H5"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <span class="brand__name">ClinicCare</span>
      </RouterLink>

      <button
        class="nav-toggle"
        type="button"
        :aria-expanded="menuAbierto"
        aria-label="Abrir menú de navegación"
        @click="menuAbierto = !menuAbierto"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="app-nav" :class="{ 'app-nav--open': menuAbierto }">
        <RouterLink to="/" class="app-nav__link" @click="menuAbierto = false">Inicio</RouterLink>
        <RouterLink
          v-if="auth.estaAutenticado"
          to="/doctors"
          class="app-nav__link"
          @click="menuAbierto = false"
          >Doctores</RouterLink
        >
        <RouterLink
          v-if="auth.estaAutenticado"
          to="/appointments"
          class="app-nav__link"
          @click="menuAbierto = false"
          >Citas</RouterLink
        >
        <RouterLink
          v-if="auth.estaAutenticado"
          to="/dashboard"
          class="app-nav__link"
          @click="menuAbierto = false"
          >Panel</RouterLink
        >
        <RouterLink to="/contact" class="app-nav__link" @click="menuAbierto = false"
          >Contacto</RouterLink
        >

        <div class="app-nav__divider" aria-hidden="true"></div>

        <template v-if="auth.estaAutenticado">
          <div class="app-nav__user">
            <span class="avatar">{{ iniciales(auth.nombreUsuario) }}</span>
            <span class="app-nav__user-name">{{ auth.nombreUsuario }}</span>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" @click="cerrarSesion">
            Cerrar sesión
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-ghost btn-sm" @click="menuAbierto = false"
            >Iniciar sesión</RouterLink
          >
          <RouterLink to="/register" class="btn btn-primary btn-sm" @click="menuAbierto = false"
            >Crear cuenta</RouterLink
          >
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(246, 244, 239, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--color-accent);
  color: #fff;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.nav-toggle span {
  width: 20px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.app-nav__link {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-soft);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.app-nav__link:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.app-nav__link.router-link-exact-active {
  color: var(--color-accent-dark);
  background: var(--color-accent-soft);
}

.app-nav__divider {
  width: 1px;
  height: 22px;
  background: var(--color-border-strong);
  margin: 0 6px;
}

.app-nav__user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 4px;
}

.app-nav__user-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 860px) {
  .nav-toggle {
    display: inline-flex;
  }

  .app-nav {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    align-items: stretch;
    padding: 12px 20px 20px;
    display: none;
    box-shadow: var(--shadow-pop);
  }

  .app-nav--open {
    display: flex;
  }

  .app-nav__link {
    padding: 12px 10px;
  }

  .app-nav__divider {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }

  .app-nav__user {
    padding: 6px 10px;
  }
}
</style>
