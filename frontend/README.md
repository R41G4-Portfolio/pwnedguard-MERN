# Frontend - PwnedGuard

## Tecnologías

React 18, Vite, React Router DOM, React Helmet Async, Zod, CSS puro (BEM)

## Variables de entorno (.env)

VITE_API_URL=http://localhost:3000

## Instalación

```bash
pnpm install
pnpm run dev
```

## Estructura de archivos

frontend/src/
├── components/       # Componentes React (BEM)
├── pages/           # Páginas (Home, Dashboard, Login, Register)
├── contexts/        # AuthContext
├── hooks/           # useDocumentTitle
├── services/        # api.js (signup, signin, logout, checkPassword)
├── utils/           # cookieHelper.js, validation.js
├── schemas/         # authSchemas.js (Zod)
├── css/             # BEM modular (posición y layout)
├── app.css          # imports globales
├── global.css       # variables, botones, formularios, utilidades
└── main.jsx

## Metodología BEM

Las clases siguen el patrón bloque__elemento--modificador.

Ejemplo:
<div class="password-checker card">
  <h3 class="password-checker__title">Verificar contraseña</h3>
  <div class="password-checker__form">
    <input class="password-checker__input form-input" />
    <button class="password-checker__button btn btn--primary">Verificar</button>
  </div>
</div>

## CSS

- app.css: solo imports
- global.css: variables, reset, botones, badges, formularios, utilidades
- css/*.css: posición y layout específico de cada bloque BEM
- media-queries.css: responsive global

## Autenticación

- Contexto: AuthContext.jsx
- Cookies: auth_token (httpOnly), auth_meta (legible)
- Rutas protegidas: ProtectedRoute en App.jsx
- Redirecciones: /dashboard requiere login, /login y /register redirigen si hay sesión

## API HIBP

La verificación de contraseñas se hace directamente desde el frontend:

checkPassword(password) → SHA-1 → prefix(5) → fetch a api.pwnedpasswords.com/range/{prefix} → compara suffix

## Validaciones (Zod)

- email: formato válido, min 5, max 100
- password: min 6, mayúscula, minúscula, número
- name: min 2, max 50

Las validaciones se ejecutan en tiempo real (onBlur) y en submit.

## Despliegue

```bash
pnpm run buid
```