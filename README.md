# PwnedGuard - MERN Stack

## 🎯 Objetivo del proyecto

PwnedGuard es una aplicación web que permite a los usuarios verificar si sus contraseñas han sido filtradas en brechas de seguridad públicas, utilizando la API de **Have I Been Pwned (HIBP)**.

El proyecto se desarrolla como parte del bootcamp de **TripleTen** para demostrar habilidades en el stack MERN (MongoDB, Express, React, Node.js), aplicando buenas prácticas de seguridad, arquitectura limpia y metodología BEM en el frontend.

---

## ✨ Funcionalidades principales

- **Verificación de contraseñas** contra la base de datos de HIBP con más de 10 mil millones de filtraciones
- **k-anonymity**: Solo se envía un hash parcial SHA-1, la contraseña nunca abandona el navegador
- **Autenticación segura** con JWT almacenado en cookies httpOnly
- **Sesión única por dispositivo**: Al iniciar sesión en otro dispositivo, el anterior se invalida automáticamente
- **Protección de rutas** en React con redirecciones automáticas
- **Validación en tiempo real** con Zod (frontend y backend)
- **Interfaz responsive** con metodología BEM (sin librerías CSS externas)
- **Spinner de carga** para mejor experiencia de usuario
- **Modal de confirmación** para acciones críticas (logout)

---

## 🛠️ Tecnologías utilizadas

### Frontend
| Tecnología | Propósito |
| :--- | :--- |
| React 18 | Biblioteca principal |
| Vite | Bundler y servidor de desarrollo |
| React Router DOM | Navegación y rutas protegidas |
| React Helmet Async | Manejo de metaetiquetas |
| Zod | Validación de schemas |
| CSS puro + BEM | Estilos sin librerías externas |

### Backend
| Tecnología | Propósito |
| :--- | :--- |
| Node.js + Express | Servidor HTTP y API REST |
| MongoDB + Mongoose | Base de datos y ODM |
| JWT | Tokens de autenticación |
| bcrypt | Hashing de contraseñas |
| Zod | Validación de schemas |
| cookie-parser | Manejo de cookies httpOnly |
| helmet | Seguridad de headers |
| express-rate-limit | Protección contra fuerza bruta |

### APIs externas
| API | Propósito |
| :--- | :--- |
| Have I Been Pwned (HIBP) | Verificación de contraseñas filtradas |

---

## 🔐 Seguridad implementada

| Capa | Medida |
| :--- | :--- |
| **Contraseñas** | Hash bcrypt (salt rounds: 10) |
| **Tokens** | JWT almacenado en cookie httpOnly, SameSite=Strict |
| **Sesiones** | Un solo dispositivo activo por usuario |
| **Rate limiting** | 5 intentos de login/registro por 15 minutos |
| **Headers** | Helmet para proteger contra ataques conocidos |
| **Validación** | Zod en frontend y backend (schemas compartidos) |
| **CORS** | Solo permite origen específico del frontend |
| **Privacidad** | HIBP con k-anonymity, no se guardan contraseñas |

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js (v18 o superior)
- pnpm
- MongoDB (local o Atlas)

### 1. Clonar el repositorio
git clone https://github.com/R41G4-Portfolio/pwnedguard-MERN.git
cd pwnedguard-MERN

### 2. Configurar backend
```bash
cd backend
cp .env.example .env
pnpm install
```

**.env necesario:**
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pwnedguard
JWT_SECRET=tu_clave_secreta_muy_segura
FRONTEND_URL=http://localhost:5173

### 3. Ejecutar backend
```bash
pnpm run dev
# Servidor en http://localhost:3000
```
### 4. Configurar frontend
```bash
cd frontend
cp .env.example .env
pnpm install
```
**.env necesario:**
VITE_API_URL=http://localhost:3000

### 5. Ejecutar frontend
```bash
pnpm run dev
# Aplicación en http://localhost:5173
```
---

## 📡 Endpoints de la API

| Método | Endpoint | Protegido | Función |
| :--- | :--- | :--- | :--- |
| POST | /api/auth/signup | ❌ | Registrar usuario |
| POST | /api/auth/signin | ❌ | Iniciar sesión (crea cookies) |
| POST | /api/auth/logout | ✅ | Cerrar sesión (elimina cookies) |

---

## 🧪 Pruebas con cURL
```bash
curl -X POST http://localhost:3000/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test","email":"test@test.com","password":"Test123456"}'

curl -X POST http://localhost:3000/api/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@test.com","password":"Test123456"}' \\
  -c cookies.txt

curl -X POST http://localhost:3000/api/auth/logout \\
  -b cookies.txt
```
---

## 🎨 Metodología BEM en el frontend

Ejemplo de estructura de clases:

<div class="password-checker card">
  <h3 class="password-checker__title">Verificar contraseña</h3>
  <div class="password-checker__form">
    <input class="password-checker__input form-input" />
    <button class="password-checker__button btn btn--primary">Verificar</button>
  </div>
  <div class="result-card result-card--safe">
    <div class="result-card__icon">✅</div>
    <div class="result-card__content">
      <p class="result-card__message">Contraseña segura</p>
    </div>
  </div>
</div>

---

## 🧠 Decisiones técnicas destacadas

| Decisión | Justificación |
| :--- | :--- |
| HIBP directo desde frontend | Reduce latencia, evita sobrecargar el backend, la API pública no requiere autenticación |
| Cookies httpOnly para JWT | Previene ataques XSS, más seguro que localStorage |
| Un solo dispositivo activo | El nuevo token reemplaza al anterior, mejora seguridad |
| Zod con schemas compartidos | Misma validación en frontend y backend, consistencia garantizada |
| BEM sin bibliotecas CSS | Código mantenible, sin dependencias externas |
| CQS (Command-Query Separation) | Separa operaciones de lectura y escritura en el backend |

---

## 📝 Estado del proyecto

| Fase | Estado |
| :--- | :--- |
| ✅ Paso 1: Etiquetado JSX + API third-party | Completado |
| ✅ Paso 2: Backend con autenticación | Completado |
| ✅ Paso 3: Autorización con React | Completado |
| ⏳ Despliegue | Pendiente |

Me espero a que esté aprobado para subirlo a servidor de GCP.

---

## 📄 Licencia

MIT