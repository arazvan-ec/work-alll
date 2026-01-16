# Project-Specific Rules - Sportian

**Project**: Sportian - Sistema de Gestión de Clubes Deportivos
**Type**: Backend API REST (Symfony + DDD)
**Last Updated**: 2026-01-15
**Version**: 1.0

---

## 🎯 Descripción del Proyecto

**Sportian** es una aplicación full-stack para gestión de clubes deportivos, jugadores y entrenadores con control de presupuestos, salarios y sistema de notificaciones extensible.

**Proyecto completo** con énfasis en:
- Backend: Domain-Driven Design (DDD), reglas de negocio complejas
- Frontend: Interfaz moderna y responsive para gestión
- Sistema de notificaciones extensible
- Buenas prácticas Symfony y React

- **Backend**: Symfony 6.4+ (PHP 8.1+, DDD architecture, Doctrine ORM)
- **Frontend**: React 18+ (TypeScript, Vite, TailwindCSS)

---

## 🏗️ Estructura de Repositorio

```
./
├── .ai/                 # Sistema de workflow Claude Code
│   ├── roles/          # Definición de roles
│   ├── projects/       # Reglas y features
│   └── scripts/        # Herramientas de automatización
│
├── backend/            # API Symfony (DDD)
│   ├── config/         # Configuración Symfony
│   ├── src/
│   │   ├── Domain/             # Capa de dominio (entidades, VOs, interfaces)
│   │   ├── Application/        # Casos de uso
│   │   └── Infrastructure/     # Implementaciones (Doctrine, controllers, notificaciones)
│   ├── tests/          # Tests (Unit, Integration, Functional)
│   ├── fixtures/       # Datos de prueba
│   └── var/            # Cache, logs
│
├── frontend/           # Aplicación React
│   ├── public/         # Assets estáticos
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas/vistas
│   │   ├── services/   # API client, servicios
│   │   ├── hooks/      # Custom hooks
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utilidades
│   └── tests/          # Tests frontend
│
├── docker/             # Configuración Docker
│   ├── php/
│   ├── nginx/
│   └── mysql/
│
├── docs/               # Documentación
│   └── postman/        # Colección Postman
│
└── README.md           # Instrucciones de instalación
```

---

## 🔧 Stack Técnico Específico

### Backend (Sportian)

- **Framework**: Symfony 6.4 LTS
- **PHP**: 8.1+ (recomendado 8.2)
- **Database**: MySQL 8.0+ o PostgreSQL 14+
- **ORM**: Doctrine ORM 2.x
- **Testing**: PHPUnit 10
- **API**: REST (manual, sin API Platform)
- **Validation**: Symfony Validator Component
- **Email**: Symfony Mailer Component
- **Docker**: Docker Compose para desarrollo

### Prohibiciones

- ❌ **NO usar API Platform** (implementación manual requerida)
- ❌ **NO usar bundles que generen CRUD automático**

### Dependencias Recomendadas

**Producción**:
- `symfony/framework-bundle` - Framework base
- `doctrine/orm` - ORM
- `doctrine/doctrine-bundle` - Integración Doctrine
- `symfony/validator` - Validaciones
- `symfony/mailer` - Emails
- `symfony/serializer` - Serialización JSON
- `nelmio/cors-bundle` - CORS para API

**Desarrollo**:
- `symfony/maker-bundle` - Generadores de código
- `phpunit/phpunit` - Testing
- `symfony/profiler-pack` - Profiling y debug
- `doctrine/doctrine-fixtures-bundle` - Fixtures
- `fakerphp/faker` - Datos fake para fixtures

### Frontend (Sportian)

- **Framework**: React 18+
- **Language**: TypeScript 5+
- **Build tool**: Vite 5+
- **Styling**: TailwindCSS 3+ (utility-first CSS)
- **State management**: React Query (TanStack Query) para API state
- **Routing**: React Router 6+
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios o Fetch API
- **Testing**: Vitest + React Testing Library
- **Icons**: Heroicons o Lucide React
- **UI Components**: HeadlessUI (opcional para componentes complejos)

### Dependencias Frontend

**Producción**:
- `react` + `react-dom` - Framework UI
- `react-router-dom` - Routing
- `@tanstack/react-query` - API state management
- `axios` - HTTP client
- `react-hook-form` - Manejo de formularios
- `zod` - Validación de schemas
- `tailwindcss` - Styling
- `@headlessui/react` - UI components unstyled

**Desarrollo**:
- `typescript` - Tipado estático
- `vite` - Build tool
- `vitest` - Testing framework
- `@testing-library/react` - Testing utilities
- `@testing-library/user-event` - User interaction testing
- `eslint` + `prettier` - Linting y formatting
- `@types/*` - Type definitions

---

## 📋 Reglas Específicas del Backend (Sportian)

### API Endpoints Sportian

**Recursos principales**: `players`, `coaches`, `clubs`

**Convención REST**:
```
# Jugadores
POST   /api/players                          # Crear jugador libre
GET    /api/players/{id}                     # Obtener jugador

# Entrenadores
POST   /api/coaches                          # Crear entrenador libre
GET    /api/coaches/{id}                     # Obtener entrenador

# Clubes
POST   /api/clubs                            # Crear club con presupuesto
GET    /api/clubs/{id}                       # Obtener club
PATCH  /api/clubs/{clubId}/budget            # Modificar presupuesto

# Asociaciones
POST   /api/clubs/{clubId}/players/{playerId}    # Asociar jugador a club
DELETE /api/clubs/{clubId}/players/{playerId}    # Liberar jugador de club
POST   /api/clubs/{clubId}/coaches/{coachId}     # Asociar entrenador a club
DELETE /api/clubs/{clubId}/coaches/{coachId}     # Liberar entrenador de club

# Listados con filtros
GET    /api/clubs/{clubId}/players?name=John&page=1&limit=10
```

### Response Format (Sportian)

**Success (200, 201)**:
```json
{
  "id": 1,
  "name": "Lionel Messi",
  "salary": 1500000,
  "club": {
    "id": 1,
    "name": "FC Barcelona"
  }
}
```

**Success con paginación**:
```json
{
  "data": [ ... ],
  "meta": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  }
}
```

**Error (400, 404, 409, 422)**:
```json
{
  "error": "Budget exceeded. Available: 50000, Required: 80000"
}
```

### Códigos HTTP Sportian

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Request inválido (validación de input)
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: jugador ya tiene club)
- `422 Unprocessable Entity` - Regla de negocio violada (presupuesto, etc.)
- `500 Internal Server Error` - Error del servidor

### Authentication

**No aplica** - Esta prueba técnica no requiere autenticación.
API pública para propósitos de la prueba.

### Rate Limiting

**No aplica** - No requerido para esta prueba técnica.

---

## 📋 Reglas Específicas del Frontend (Sportian)

### Páginas y Rutas

**Aplicación de gestión** con las siguientes páginas:

```
/                           # Dashboard (vista general)
/clubs                      # Lista de clubes
/clubs/new                  # Crear nuevo club
/clubs/:id                  # Detalle de club con jugadores y entrenadores
/players                    # Lista de todos los jugadores
/players/new                # Crear nuevo jugador
/players/:id                # Detalle de jugador
/coaches                    # Lista de todos los entrenadores
/coaches/new                # Crear nuevo entrenador
/coaches/:id                # Detalle de entrenador
```

### Funcionalidades por Página

#### **Dashboard** (`/`)
- Resumen con métricas:
  - Total de clubes
  - Total de jugadores (libres vs contratados)
  - Total de entrenadores (libres vs contratados)
  - Presupuesto total de todos los clubes
- Cards con links rápidos a crear club/jugador/entrenador

#### **Lista de Clubes** (`/clubs`)
- Tabla con: Nombre, Presupuesto, Salarios Totales, Presupuesto Disponible
- Botón "Nuevo Club"
- Click en fila para ir a detalle

#### **Detalle de Club** (`/clubs/:id`)
- Información del club (nombre, presupuesto)
- Botón "Editar Presupuesto" (modal)
- Tabs:
  - **Jugadores**: Tabla con nombre, salario, botón "Dar de baja"
    - Botón "Asociar Jugador" (modal con select de jugadores libres + input salario)
  - **Entrenadores**: Tabla con nombre, salario, botón "Dar de baja"
    - Botón "Asociar Entrenador" (modal con select de entrenadores libres + input salario)
- Validaciones visuales:
  - Indicador de presupuesto disponible
  - Warning si presupuesto está casi al límite

#### **Lista de Jugadores** (`/players`)
- Tabla con: Nombre, Club (o "Libre"), Salario
- Botón "Nuevo Jugador"
- Filtro por nombre
- Paginación

#### **Detalle de Jugador** (`/players/:id`)
- Información: Nombre, Club actual, Salario
- Si está libre: Botón "Asociar a Club"
- Si está contratado: Mostrar club, botón "Dar de baja"

#### **Lista/Detalle de Entrenadores** (`/coaches`, `/coaches/:id`)
- Igual que jugadores

### Validaciones de Frontend

**Antes de enviar requests al backend**:
1. **Crear Club**:
   - Nombre no vacío (min 3 caracteres)
   - Presupuesto > 0

2. **Modificar Presupuesto**:
   - Presupuesto > 0
   - Mensaje de advertencia si reduce presupuesto

3. **Asociar Jugador/Entrenador**:
   - Salario >= 0
   - Calcular presupuesto disponible y mostrar warning si excede

4. **Crear Jugador/Entrenador**:
   - Nombre no vacío (min 3 caracteres)

### Manejo de Errores

**Errores de API mostrados con:**
- Toasts/notifications para operaciones exitosas (verde)
- Toasts/notifications para errores (rojo)
- Mensajes específicos según código HTTP:
  - 400: "Datos inválidos"
  - 404: "Recurso no encontrado"
  - 409: "Jugador/Entrenador ya tiene club"
  - 422: Mostrar mensaje de error del backend (ej: "Budget exceeded. Available: 50000, Required: 80000")

### UX Considerations

1. **Loading States**:
   - Spinners en botones durante requests
   - Skeleton loaders en listas

2. **Confirmaciones**:
   - Modal de confirmación antes de dar de baja jugador/entrenador
   - Modal de confirmación antes de reducir presupuesto

3. **Feedback Inmediato**:
   - React Query invalidation para actualizar datos automáticamente
   - Optimistic updates donde sea apropiado

4. **Responsive Design**:
   - Mobile-first approach
   - Tablas responsivas (cards en mobile)

### Estructura de Componentes

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Layout principal con nav
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx          # Componentes base reutilizables
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Toast.tsx
│   ├── clubs/
│   │   ├── ClubCard.tsx
│   │   ├── ClubForm.tsx
│   │   ├── ClubDetail.tsx
│   │   └── EditBudgetModal.tsx
│   ├── players/
│   │   ├── PlayerTable.tsx
│   │   ├── PlayerForm.tsx
│   │   └── AssignPlayerModal.tsx
│   └── coaches/
│       ├── CoachTable.tsx
│       ├── CoachForm.tsx
│       └── AssignCoachModal.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── ClubsPage.tsx
│   ├── ClubDetailPage.tsx
│   ├── PlayersPage.tsx
│   └── CoachesPage.tsx
├── services/
│   ├── api.ts              # Axios client configurado
│   ├── clubs.ts            # API calls de clubs
│   ├── players.ts          # API calls de players
│   └── coaches.ts          # API calls de coaches
├── hooks/
│   ├── useClubs.ts         # React Query hooks
│   ├── usePlayers.ts
│   └── useCoaches.ts
├── types/
│   ├── club.ts
│   ├── player.ts
│   └── coach.ts
└── utils/
    ├── formatters.ts       # Formateo de números (moneda)
    └── validators.ts       # Validaciones comunes
```

### TypeScript Types

```typescript
// types/club.ts
export interface Club {
  id: number;
  name: string;
  budget: number;
  players?: Player[];
  coaches?: Coach[];
}

// types/player.ts
export interface Player {
  id: number;
  name: string;
  salary?: number;
  club?: {
    id: number;
    name: string;
  };
}

// types/coach.ts
export interface Coach {
  id: number;
  name: string;
  salary?: number;
  club?: {
    id: number;
    name: string;
  };
}
```

---

## 🔐 Security Rules (Sportian)

### Backend Security

1. **Input Validation**:
   - Validar **todos** los inputs con Symfony Validator
   - Validar tipos de datos (integers para IDs, salarios, presupuestos)
   - Validar rangos (presupuesto > 0, salario >= 0)
   - Validar strings (nombre no vacío, longitud máxima)

2. **SQL Injection**:
   - Usar **siempre** Doctrine Query Builder o DQL
   - **NUNCA** concatenar SQL manualmente
   - Parámetros bindados automáticamente por Doctrine

3. **Business Rules Validation**:
   - Validar reglas de negocio en servicios de dominio
   - Lanzar excepciones específicas de dominio
   - Convertir excepciones a respuestas HTTP apropiadas

4. **Error Handling**:
   - No exponer detalles internos en mensajes de error
   - Logging completo de errores (con stack trace)
   - Respuestas JSON consistentes

### Secrets Management

- ✅ Credenciales de BD en `.env` (no commiteado)
- ✅ Configuración de email en `.env`
- ✅ Usar `.env.example` como template

### Frontend Security

1. **XSS Prevention**:
   - React escapa automáticamente contenido en JSX
   - **NUNCA** usar `dangerouslySetInnerHTML`
   - Validar inputs del usuario antes de renderizar

2. **API URL Configuration**:
   - URL del backend en variable de entorno (`VITE_API_URL`)
   - No hardcodear URLs en código

3. **Input Sanitization**:
   - Usar Zod para validar datos antes de enviar
   - Validar rangos numéricos (presupuesto > 0, salario >= 0)

---

## 🧪 Testing Strategy (Sportian)

### Backend Tests (Obligatorio)

**Unit Tests** (Prioridad alta):
- ✅ Todos los Use Cases (CreatePlayer, AssignPlayerToClub, UpdateClubBudget, etc.)
- ✅ Todas las Entities del Domain (Club, Player, Coach)
- ✅ Value Objects (Money, Email)
- ✅ Servicios de dominio (validaciones de reglas de negocio)

**Integration Tests** (Prioridad media):
- ✅ Repositorios (con base de datos de prueba)
- ✅ Notificaciones (EmailNotificationChannel)

**Functional Tests** (Prioridad media):
- ✅ API endpoints (Controllers) - requests HTTP completos
- ✅ Flujos completos end-to-end

**Coverage objetivo**: Mínimo 70% (valorado positivamente 80%+)

**Ejemplo**:
```bash
cd backend
# Tests unitarios
./vendor/bin/phpunit tests/Unit

# Tests de integración
./vendor/bin/phpunit tests/Integration

# Tests funcionales
./vendor/bin/phpunit tests/Functional

# Todos los tests con coverage
./vendor/bin/phpunit --coverage-html var/coverage
```

### Tests Críticos Backend

1. **Regla de negocio RN-1**: Validar que suma de salarios no supere presupuesto
2. **Regla de negocio RN-2**: Validar que presupuesto no se reduzca por debajo de salarios
3. **Regla de negocio RN-3**: Validar exclusividad de club
4. **Notificaciones**: Verificar que se envían emails en operaciones requeridas
5. **Paginación y filtros**: Validar que funcionan correctamente

### Frontend Tests (Recomendado)

**Unit/Component Tests**:
- ✅ Componentes UI base (Button, Input, Modal)
- ✅ Formularios (ClubForm, PlayerForm, CoachForm)
- ✅ Componentes de tabla con data
- ✅ Validaciones de formularios

**Integration Tests**:
- ✅ Flujos completos de usuario (crear club → asociar jugador)
- ✅ Manejo de errores de API
- ✅ Estados de loading

**Coverage objetivo**: Mínimo 60% (valorado positivamente 70%+)

**Ejemplo**:
```bash
cd frontend
# Tests unitarios
npm test

# Tests con coverage
npm test -- --coverage

# Tests en watch mode
npm test -- --watch
```

### Tests Críticos Frontend

1. **ClubForm**: Validación de presupuesto > 0
2. **AssignPlayerModal**: Cálculo de presupuesto disponible
3. **EditBudgetModal**: Warning cuando reduce presupuesto
4. **PlayerTable**: Paginación funcional
5. **Manejo de errores**: Mostrar toasts correctamente

---

## 🚀 Deployment (Sportian)

### Environments

- **Local**: Desarrollo con Docker Compose
  - `docker-compose up -d`
  - Base de datos MySQL/PostgreSQL local
  - PHP 8.1+
  - Nginx

### Instalación Local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd sportian

# 2. Configurar Backend
cp backend/.env.example backend/.env
# Editar backend/.env si es necesario

# 3. Configurar Frontend
cp frontend/.env.example frontend/.env
# Editar VITE_API_URL=http://localhost:8080

# 4. Iniciar Docker (backend + base de datos)
docker-compose up -d

# 5. Instalar dependencias backend
docker-compose exec php composer install

# 6. Crear base de datos y ejecutar migraciones
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate -n

# 7. Cargar fixtures (datos de prueba)
docker-compose exec php bin/console doctrine:fixtures:load -n

# 8. Instalar dependencias frontend
cd frontend
npm install

# 9. Iniciar servidor de desarrollo frontend
npm run dev

# 10. Verificar
# Backend: curl http://localhost:8080/api/clubs
# Frontend: Abrir http://localhost:5173 en navegador
```

### CI/CD (No aplica para prueba técnica)

Esta prueba técnica se enfoca en desarrollo local. No se requiere pipeline CI/CD.

---

## 📦 Dependencies (Ya especificadas arriba)

Ver sección "Stack Técnico Específico" para lista completa de dependencias.

**Prohibiciones críticas**:
- ❌ **API Platform** (implementación manual requerida)
- ❌ Bundles que generen CRUD automático
- ❌ Dependencias obsoletas sin mantenimiento

---

## 🔄 Workflow Específico del Proyecto (Sportian)

### Feature Development (task-breakdown workflow)

**Usando workflow task-breakdown para Sportian full-stack**:

1. **Planner** (Fase de Planning exhaustivo):
   - **00_requirements_analysis.md** - Análisis de requisitos completo
   - **10_architecture.md** - Diseño DDD (Domain, Application, Infrastructure)
   - **15_data_model.md** - Modelo de datos detallado
   - **20_api_contracts.md** - TODOS los endpoints documentados
   - **25_ui_wireframes.md** - Wireframes y flujos de UI (opcional, puede ser textual)
   - **30_tasks_backend.md** - Tareas MUY detalladas para Backend
   - **31_tasks_frontend.md** - Tareas MUY detalladas para Frontend
   - **32_tasks_qa.md** - Tareas detalladas para QA
   - Actualiza `50_state.md` → `COMPLETED`

2. **Backend** implementa:
   - Lee toda la documentación del Planner
   - Implementa según DDD (Domain → Application → Infrastructure)
   - Checkpoints frecuentes con commits
   - Actualiza `50_state.md` con progreso
   - Ejecuta tests unitarios mientras desarrolla

3. **Frontend** implementa (puede trabajar en paralelo con Backend):
   - Lee toda la documentación del Planner
   - Si Backend no está listo: mockea API con MSW o datos fake
   - Implementa componentes, páginas, servicios
   - Integra con API real cuando Backend esté listo
   - Checkpoints frecuentes con commits
   - Actualiza `50_state.md` con progreso

4. **Integración Backend + Frontend**:
   - Frontend reemplaza mocks con API real
   - Tests end-to-end del flujo completo
   - Validación de que todas las funcionalidades funcionan

5. **QA** revisa:
   - Lee documentación del Planner
   - Lee código del Backend y Frontend
   - Ejecuta tests backend y frontend
   - Prueba aplicación completa (UI + API)
   - Valida reglas de negocio desde UI
   - Decision: `APPROVED` o `REJECTED` en `50_state.md`

6. **Merge** cuando QA aprueba

### Git Workflow

- Branch de feature: `feature/sportian-club-management`
- Commits frecuentes con prefijos:
  - `[planner][sportian-club-management] Create architecture design`
  - `[backend][sportian-club-management] Add Club entity`
  - `[backend][sportian-club-management] Implement AssignPlayerToClub use case`
  - `[frontend][sportian-club-management] Add ClubDetail page`
  - `[frontend][sportian-club-management] Implement AssignPlayer modal`
  - `[qa][sportian-club-management] QA Review: APPROVED`

---

## 📊 Logging (Sportian)

### Backend Logging

- **Level**: DEBUG en desarrollo
- **Tool**: Monolog (incluido en Symfony)
- **Log crítico**:
  - Errores de validación de reglas de negocio
  - Fallos al enviar notificaciones
  - Excepciones no controladas
- **Location**: `backend/var/log/dev.log`

**No aplica**: Monitoring de producción (prueba técnica local)

---

## 📝 Documentation (Sportian)

### README.md (Obligatorio)

Debe incluir:
1. Descripción del proyecto
2. Requisitos previos (Docker, Docker Compose)
3. Instalación paso a paso
4. Comandos para cargar fixtures
5. Comandos para ejecutar tests
6. Estructura del proyecto (árbol de directorios)
7. Ejemplos de uso de la API (curl o referencia a Postman)

### API Documentation (Valorado)

- ✅ **Colección Postman** con ejemplos de todas las operaciones
- ✅ (Opcional) OpenAPI/Swagger spec

### Code Documentation

- ✅ PHPDoc en clases de dominio complejas
- ✅ Comentarios en lógica de negocio no trivial
- ✅ No sobre-documentar código obvio

---

## ✅ Definition of Done (Sportian)

El proyecto Sportian está completo cuando:

### Funcional (Backend)
- ✅ **Todas las operaciones de API implementadas y funcionando**
  - POST /api/players, POST /api/coaches, POST /api/clubs
  - Asociar/desasociar jugadores y entrenadores a clubes
  - Modificar presupuesto de club
  - Listar jugadores con filtros y paginación
- ✅ **Todas las reglas de negocio validadas correctamente**
  - RN-1: Suma de salarios no supera presupuesto
  - RN-2: Presupuesto no se reduce por debajo de salarios actuales
  - RN-3: Exclusividad de club
  - RN-4: Notificaciones enviadas
- ✅ **Sistema de notificaciones extensible implementado**
  - EmailNotificationChannel funcionando
  - Interface para agregar futuros canales (SMS, WhatsApp)

### Funcional (Frontend)
- ✅ **Todas las páginas implementadas y funcionando**
  - Dashboard con métricas
  - CRUD de clubes con detalle
  - CRUD de jugadores
  - CRUD de entrenadores
  - Asociar/desasociar desde UI
  - Editar presupuesto con validaciones
- ✅ **UX completa**
  - Loading states
  - Error handling con toasts
  - Validaciones de formularios
  - Confirmaciones antes de acciones destructivas
  - Responsive design (mobile + desktop)

### Técnico (Backend)
- ✅ **Arquitectura DDD implementada correctamente**
  - Domain / Application / Infrastructure separados
  - Entities, Value Objects, Use Cases, Repositories
- ✅ **Tests escritos y pasando** (mínimo 70% coverage)
  - Unit tests de use cases, entities, VOs
  - Integration tests de repositories
  - Functional tests de endpoints
- ✅ **Docker configurado y funcionando**
  - `docker-compose up -d` funciona
  - Aplicación accesible en `http://localhost:8080`
- ✅ **Fixtures cargados**
  - 3 clubes, 15 jugadores, 5 entrenadores
  - Datos de prueba realistas
- ✅ **Código limpio y bien estructurado**
  - PSR-12 seguido
  - Sin warnings de PHPStan
  - Código autoexplicativo

### Técnico (Frontend)
- ✅ **Arquitectura de componentes clara**
  - Componentes reutilizables (UI base)
  - Servicios de API separados
  - Hooks personalizados para lógica
  - Types de TypeScript definidos
- ✅ **Tests escritos y pasando** (mínimo 60% coverage)
  - Unit tests de componentes
  - Tests de formularios y validaciones
  - Tests de integración con API (mocked)
- ✅ **Build funcional**
  - `npm run build` sin errores
  - `npm run dev` inicia servidor correctamente
  - Sin errores de TypeScript
  - Sin warnings de ESLint críticos
- ✅ **Código limpio**
  - Componentes pequeños y focalizados
  - Props bien tipadas
  - Código autoexplicativo

### Integración
- ✅ **Backend y Frontend integrados**
  - Frontend consume API real correctamente
  - CORS configurado
  - Todas las funcionalidades end-to-end funcionan

### QA
- ✅ **QA aprobó** (`APPROVED` en `50_state.md`)
- ✅ Todas las operaciones probadas desde UI
- ✅ Reglas de negocio validadas desde frontend
- ✅ Tests backend y frontend ejecutados exitosamente
- ✅ Aplicación funciona en diferentes navegadores

### Documentación
- ✅ **README.md completo**
  - Instrucciones de instalación (backend + frontend)
  - Comandos de uso documentados
  - Estructura del proyecto explicada
  - Screenshots o video demo (valorado positivamente)
- ✅ **Dump de base de datos** con datos de prueba incluido
- ✅ **Colección Postman incluida** (valorado positivamente)
- ✅ Comentarios en código donde sea necesario

---

**Última actualización**: 2026-01-15
**Actualizado por**: Sistema (preparación inicial Sportian)
**Próxima revisión**: Después del planning del Planner
