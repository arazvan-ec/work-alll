# Project-Specific Rules - Sportian

**Project**: Sportian - Sistema de Gestión de Clubes Deportivos
**Type**: Backend API REST (Symfony + DDD)
**Last Updated**: 2026-01-15
**Version**: 1.0

---

## 🎯 Descripción del Proyecto

**Sportian** es una API REST para gestión de clubes deportivos, jugadores y entrenadores con control de presupuestos, salarios y sistema de notificaciones extensible.

**Prueba técnica backend** con énfasis en:
- Domain-Driven Design (DDD)
- Reglas de negocio complejas
- Sistema de notificaciones extensible
- Buenas prácticas Symfony

- **Backend**: Symfony 6.4+ (PHP 8.1+, DDD architecture, Doctrine ORM)
- **Frontend**: No aplica (solo API REST)

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

### Tests Críticos a Implementar

1. **Regla de negocio RN-1**: Validar que suma de salarios no supere presupuesto
2. **Regla de negocio RN-2**: Validar que presupuesto no se reduzca por debajo de salarios
3. **Regla de negocio RN-3**: Validar exclusividad de club
4. **Notificaciones**: Verificar que se envían emails en operaciones requeridas
5. **Paginación y filtros**: Validar que funcionan correctamente

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

# 2. Copiar .env y configurar
cp backend/.env.example backend/.env

# 3. Iniciar Docker
docker-compose up -d

# 4. Instalar dependencias
docker-compose exec php composer install

# 5. Crear base de datos y ejecutar migraciones
docker-compose exec php bin/console doctrine:database:create
docker-compose exec php bin/console doctrine:migrations:migrate -n

# 6. Cargar fixtures (datos de prueba)
docker-compose exec php bin/console doctrine:fixtures:load -n

# 7. Verificar
curl http://localhost:8080/api/clubs
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

**Usando workflow task-breakdown para Sportian**:

1. **Planner** (Fase de Planning exhaustivo):
   - **00_requirements_analysis.md** - Análisis de requisitos completo
   - **10_architecture.md** - Diseño DDD (Domain, Application, Infrastructure)
   - **15_data_model.md** - Modelo de datos detallado
   - **20_api_contracts.md** - TODOS los endpoints documentados
   - **30_tasks_backend.md** - Tareas MUY detalladas para Backend
   - **32_tasks_qa.md** - Tareas detalladas para QA
   - Actualiza `50_state.md` → `COMPLETED`

2. **Backend** implementa:
   - Lee toda la documentación del Planner
   - Implementa según DDD (Domain → Application → Infrastructure)
   - Checkpoints frecuentes con commits
   - Actualiza `50_state.md` con progreso
   - Ejecuta tests unitarios mientras desarrolla

3. **QA** revisa:
   - Lee documentación del Planner
   - Lee código del Backend
   - Ejecuta tests
   - Prueba API con Postman/curl
   - Valida reglas de negocio
   - Decision: `APPROVED` o `REJECTED` en `50_state.md`

4. **Merge** cuando QA aprueba

### Git Workflow

- Branch de feature: `feature/sportian-club-management`
- Commits frecuentes con prefijos:
  - `[backend][sportian-club-management] Add Club entity`
  - `[backend][sportian-club-management] Implement AssignPlayerToClub use case`
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

### Funcional
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

### Técnico
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
- ✅ **README.md completo**
  - Instrucciones de instalación claras
  - Comandos de uso documentados
  - Estructura del proyecto explicada
- ✅ **Colección Postman incluida** (valorado positivamente)
- ✅ **Código limpio y bien estructurado**
  - PSR-12 seguido
  - Sin warnings de PHPStan
  - Código autoexplicativo

### QA
- ✅ **QA aprobó** (`APPROVED` en `50_state.md`)
- ✅ Todas las operaciones probadas manualmente
- ✅ Reglas de negocio validadas
- ✅ Tests ejecutados exitosamente

### Documentación
- ✅ **Dump de base de datos** con datos de prueba incluido
- ✅ Comentarios en código donde sea necesario
- ✅ API documentada (Postman o README)

---

**Última actualización**: 2026-01-15
**Actualizado por**: Sistema (preparación inicial Sportian)
**Próxima revisión**: Después del planning del Planner
