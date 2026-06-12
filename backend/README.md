# PwnedGuard - Documentación técnica

## Tecnologías

| Capa | Tecnologías |
| :--- | :--- |
| Backend | Node.js, Express, MongoDB, JWT, bcrypt, Zod |
| Seguridad | Helmet, CORS, Rate limiting, Cookies httpOnly, XSS escape |

## Variables de entorno

Backend (.env)
- NODE_ENV=development
- PORT=3000
- MONGODB_URI=mongodb://localhost:27017/pwnedguard
- JWT_SECRET=tu_clave_secreta
- FRONTEND_URL=http://localhost:5173

Frontend (.env)
- VITE_API_URL=http://localhost:3000

## Instalación

Backend: cd backend → pnpm install → pnpm run dev
Frontend: cd frontend → pnpm install → pnpm run dev

## Endpoints de la API

- POST /api/auth/signup → Registro (público)
- POST /api/auth/signin → Login (público)
- POST /api/auth/logout → Logout (requiere autenticación)

## Pruebas con curl
```bash
Registro:
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"LuisG","email":"abc@ahu.com.mx","password":"Luis123456"}'

Login:
curl -X POST http://localhost:3000/api/auth/signin -H "Content-Type: application/json" -d '{"email":"abc@ahu.com.mx","password":"Luis123456"}' -c cookies.txt

Logout:
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

## Autenticación

- Cookie auth_token: httpOnly, JWT firmado
- Cookie auth_meta: legible, contiene name, email, rid, exp
- Sesión única: el nuevo token reemplaza al anterior en BD
- Hash del token: se guarda SHA-256 del jti, no el token completo

## Seguridad implementada

- XSS: escape HTML en salidas (sanitizeOutput)
- NoSQL injection: bloqueo de $ en strings
- CSRF: SameSite=Strict en cookies
- Rate limiting: 5 intentos de login/registro por IP
- Contraseñas: bcrypt (10 rounds)

## CQS (Command-Query Separation)

- Commands → AuthCommands.js (register, login, logout)
- Queries → AuthQueries.js (getUserByEmail, verifySession)
- DAO → UserDAO.js (acceso a MongoDB)
- DTO → UserDTO.js (formateo de respuestas)

## Estructura de archivos

backend/
├── src/
│   ├── commands/
│   ├── queries/
│   ├── repository/
│   │   ├── dao/
│   │   └── dto/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── schemas/
├── server.js
└── .env