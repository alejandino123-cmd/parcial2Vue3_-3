import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Inicio' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar sesión', soloInvitado: true },
  },
  {
    path: '/register',
    name: 'registro',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Crear cuenta', soloInvitado: true },
  },
  {
    path: '/contact',
    name: 'contacto',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contacto' },
  },
  {
    path: '/doctors',
    name: 'doctores',
    component: () => import('@/views/DoctorsView.vue'),
    meta: { title: 'Doctores', requiereAuth: true },
  },
  {
    path: '/appointments',
    name: 'citas',
    component: () => import('@/views/AppointmentsView.vue'),
    meta: { title: 'Citas', requiereAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Panel', requiereAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrado',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  document.title = to.meta.title ? `${to.meta.title} · ClinicCare` : 'ClinicCare'

  if (to.meta.requiereAuth && !auth.estaAutenticado) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.soloInvitado && auth.estaAutenticado) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
