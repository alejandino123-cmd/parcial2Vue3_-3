# ClinicCare — Frontend (Vue 3)

Frontend del Sistema de Gestión Médica, construido con **Vue 3 + Vite**, **Pinia** para
estado global, **Vue Router** para navegación y **Axios** para consumir la API del backend
(Node.js/Express).

## Requisitos

- Node.js 18+
- El backend corriendo (por defecto en `http://localhost:3000/api`)

## Instalación

```bash
npm install
```

Copia el archivo de variables de entorno y ajusta la URL de la API si hace falta:

```bash
cp .env.example .env
```

```
VITE_API_URL=http://localhost:3000/api
```

## Desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── assets/main.css        # Sistema de diseño (tokens, componentes base)
├── components/             # Header, footer, alertas, modal, spinner, confirmación
├── router/index.js         # Rutas + guardas de autenticación
├── services/                # Axios (interceptores) + wrappers por recurso
├── stores/                  # Pinia: auth, pacientes, doctores, citas
└── views/
    ├── HomeView.vue         # Landing (/)
    ├── LoginView.vue        # Login (/login)
    ├── RegisterView.vue     # Registro (/register)
    ├── ContactView.vue      # Contacto (/contact)
    ├── DoctorsView.vue      # CRUD de doctores (/doctors)
    ├── AppointmentsView.vue # CRUD de citas (/appointments)
    ├── DashboardView.vue    # Panel: reportes + CRUD de pacientes (/dashboard)
    └── NotFoundView.vue     # 404
```

## Notas

- El token JWT se guarda en `localStorage` y se adjunta automáticamente a cada
  petición mediante un interceptor de Axios. Si el backend responde `401`, la
  sesión se limpia y el usuario es redirigido a `/login`.
- La gestión de pacientes vive dentro del **Panel** (`/dashboard`, pestaña
  "Pacientes"), y también se pueden crear pacientes al vuelo desde el
  formulario de una cita nueva.
- El formulario de Contacto acepta un endpoint externo opcional vía
  `VITE_CONTACT_API_URL` (por ejemplo, un servicio de correo en Laravel). Si no
  se configura, solo confirma el envío localmente.
