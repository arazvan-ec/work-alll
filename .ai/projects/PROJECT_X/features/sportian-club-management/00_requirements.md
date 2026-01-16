# Sportian - Prueba Técnica Backend
## Sistema de Gestión de Clubes, Jugadores y Entrenadores

**Feature ID**: `sportian-club-management`
**Workflow**: `task-breakdown`
**Fecha**: 2026-01-15

---

## 📋 Descripción General

Desarrollar una aplicación Symfony (API REST) para la gestión de clubes deportivos, jugadores y entrenadores con control de presupuestos y salarios.

---

## 🎯 Objetivos

- API REST completa para gestión de entidades deportivas
- Sistema de asociación de jugadores/entrenadores con clubes
- Control de presupuestos y validación de salarios
- Sistema de notificaciones extensible (email + preparado para SMS/WhatsApp)
- Aplicación de DDD y buenas prácticas Symfony

---

## 📊 Entidades del Dominio

### 1. **Club**
- **Atributos**:
  - ID (generado automáticamente)
  - Nombre
  - Presupuesto (numérico, definido al crear el club)
  - Lista de jugadores asociados
  - Lista de entrenadores asociados
- **Restricciones**:
  - Presupuesto no puede reducirse por debajo de la suma de salarios actuales
  - Suma de salarios (jugadores + entrenadores) no puede superar presupuesto

### 2. **Jugador (Player)**
- **Atributos**:
  - ID (generado automáticamente)
  - Nombre
  - Club asociado (nullable - puede estar libre)
  - Salario (numérico, solo si está asociado a un club)
- **Estados**:
  - **Libre**: Sin club asociado, sin salario
  - **Contratado**: Con club asociado y salario asignado
- **Restricciones**:
  - No puede pertenecer a más de un club al mismo tiempo
  - Debe tener salario si está asociado a un club

### 3. **Entrenador (Coach)**
- **Atributos**:
  - ID (generado automáticamente)
  - Nombre
  - Club asociado (nullable - puede estar libre)
  - Salario (numérico, solo si está asociado a un club)
- **Estados**:
  - **Libre**: Sin club asociado, sin salario
  - **Contratado**: Con club asociado y salario asignado
- **Restricciones**:
  - No puede pertenecer a más de un club al mismo tiempo
  - Debe tener salario si está asociado a un club

---

## 🔄 Operaciones de la API

### Jugadores

#### **POST /api/players**
- Alta de un nuevo jugador libre (sin club)
- Request: `{ "name": "John Doe" }`
- Response: `201 Created` con datos del jugador
- Notificación: Enviar email al crear jugador

### Entrenadores

#### **POST /api/coaches**
- Alta de un nuevo entrenador libre (sin club)
- Request: `{ "name": "Jane Smith" }`
- Response: `201 Created` con datos del entrenador
- Notificación: Enviar email al crear entrenador

### Clubes

#### **POST /api/clubs**
- Alta de un nuevo club con presupuesto inicial
- Request: `{ "name": "FC Barcelona", "budget": 1000000 }`
- Response: `201 Created` con datos del club

#### **POST /api/clubs/{clubId}/players/{playerId}**
- Asociar un jugador libre a un club
- Request: `{ "salary": 50000 }`
- Response: `200 OK` con jugador actualizado
- Validaciones:
  - Jugador debe estar libre
  - Suma de salarios no puede superar presupuesto
- Notificación: Enviar email al asociar jugador

#### **POST /api/clubs/{clubId}/coaches/{coachId}**
- Asociar un entrenador libre a un club
- Request: `{ "salary": 80000 }`
- Response: `200 OK` con entrenador actualizado
- Validaciones:
  - Entrenador debe estar libre
  - Suma de salarios no puede superar presupuesto
- Notificación: Enviar email al asociar entrenador

#### **DELETE /api/clubs/{clubId}/players/{playerId}**
- Dar de baja a un jugador del club (pasa a estar libre)
- Response: `200 OK` con jugador actualizado (sin club, sin salario)
- Notificación: Enviar email al dar de baja jugador

#### **DELETE /api/clubs/{clubId}/coaches/{coachId}**
- Dar de baja a un entrenador del club (pasa a estar libre)
- Response: `200 OK` con entrenador actualizado (sin club, sin salario)
- Notificación: Enviar email al dar de baja entrenador

#### **PATCH /api/clubs/{clubId}/budget**
- Modificar el presupuesto de un club
- Request: `{ "budget": 1200000 }`
- Response: `200 OK` con club actualizado
- Validaciones:
  - Nuevo presupuesto no puede ser menor que suma de salarios actuales

#### **GET /api/clubs/{clubId}/players**
- Listar jugadores de un club
- Query params:
  - `?name=John` - Filtrar por nombre (búsqueda parcial)
  - `?page=1&limit=10` - Paginación
- Response: `200 OK` con lista paginada de jugadores

---

## ⚠️ Reglas de Negocio (Críticas)

### RN-1: Control de Presupuesto al Contratar
**Descripción**: La suma total de salarios (jugadores + entrenadores) no puede superar el presupuesto del club.

**Validación**: Al asociar un jugador o entrenador:
```
SUM(salarios_jugadores) + SUM(salarios_entrenadores) + nuevo_salario <= presupuesto_club
```

**Respuesta en caso de error**:
- Status: `422 Unprocessable Entity`
- Body: `{ "error": "Budget exceeded. Available: 50000, Required: 80000" }`

### RN-2: Control de Presupuesto al Modificar
**Descripción**: No se puede reducir el presupuesto del club por debajo de la suma actual de salarios.

**Validación**: Al modificar presupuesto:
```
nuevo_presupuesto >= SUM(salarios_jugadores) + SUM(salarios_entrenadores)
```

**Respuesta en caso de error**:
- Status: `422 Unprocessable Entity`
- Body: `{ "error": "Budget cannot be lower than current salaries. Current: 500000" }`

### RN-3: Exclusividad de Club
**Descripción**: Un jugador o entrenador no puede pertenecer a más de un club al mismo tiempo.

**Validación**: Al asociar a un club:
- Verificar que `club_id IS NULL` antes de asignar

**Respuesta en caso de error**:
- Status: `409 Conflict`
- Body: `{ "error": "Player is already associated with another club" }`

### RN-4: Notificaciones Obligatorias
**Descripción**: Enviar notificaciones por email en las siguientes operaciones:
- Alta de jugador libre
- Alta de entrenador libre
- Asociar jugador a club
- Asociar entrenador a club
- Dar de baja jugador de club
- Dar de baja entrenador de club

**Implementación**:
- Sistema de notificaciones **extensible** (preparado para SMS, WhatsApp en el futuro)
- Patrón Strategy o Chain of Responsibility
- Interface `NotificationChannelInterface` con implementación `EmailNotificationChannel`

---

## 🏗️ Requisitos Técnicos

### Stack Obligatorio
- **Framework**: Symfony 5.4 o superior (recomendado 6.4 LTS)
- **ORM**: Doctrine
- **PHP**: 8.1 o superior
- **Base de datos**: MySQL 8.0+ o PostgreSQL 14+
- **Content-Type**: `application/json` en todas las respuestas

### Prohibiciones
- ❌ **NO usar API Platform** (debe ser implementación manual con controllers)

### Valorado Positivamente
- ✅ Docker + docker-compose para desarrollo
- ✅ Colección de Postman con ejemplos de todas las operaciones
- ✅ Tests unitarios (PHPUnit)
- ✅ Código limpio y bien estructurado
- ✅ Patrones de diseño (Strategy, Repository, Factory, etc.)
- ✅ Uso correcto de verbos HTTP según REST
- ✅ Validación de datos con Symfony Validator
- ✅ Manejo de errores centralizado
- ✅ Logging de operaciones críticas

### Entregables
1. **README.md** con instrucciones de instalación detalladas
2. **Dump de base de datos** con datos de prueba (fixtures)
3. Código fuente completo
4. (Opcional) Colección Postman

---

## 🎨 Arquitectura Esperada

### Domain-Driven Design (DDD)

```
backend/
├── src/
│   ├── Domain/              # Capa de dominio
│   │   ├── Entity/          # Entidades: Club, Player, Coach
│   │   ├── ValueObject/     # Value Objects: Money (salario, presupuesto), Email
│   │   ├── Repository/      # Interfaces de repositorios
│   │   ├── Service/         # Servicios de dominio
│   │   └── Exception/       # Excepciones de dominio
│   ├── Application/         # Capa de aplicación
│   │   ├── UseCase/         # Casos de uso
│   │   │   ├── CreatePlayer/
│   │   │   ├── CreateCoach/
│   │   │   ├── CreateClub/
│   │   │   ├── AssignPlayerToClub/
│   │   │   ├── AssignCoachToClub/
│   │   │   ├── ReleasePlayerFromClub/
│   │   │   ├── ReleaseCoachFromClub/
│   │   │   ├── UpdateClubBudget/
│   │   │   └── ListClubPlayers/
│   │   ├── DTO/             # Data Transfer Objects
│   │   └── Service/         # Servicios de aplicación
│   │       └── NotificationService/
│   └── Infrastructure/      # Capa de infraestructura
│       ├── Persistence/     # Implementación Doctrine
│       │   ├── Entity/      # Doctrine entities (mapping)
│       │   └── Repository/  # Implementación de repositorios
│       ├── Http/            # Controllers REST
│       │   └── Controller/
│       └── Notification/    # Implementación de notificaciones
│           ├── EmailNotificationChannel.php
│           └── NotificationChannelInterface.php
└── tests/
    ├── Unit/
    ├── Integration/
    └── Functional/
```

---

## 📝 Casos de Uso Detallados

### UC-1: Crear Jugador Libre
**Actor**: Sistema
**Precondiciones**: Ninguna
**Flujo Principal**:
1. Recibir request con nombre del jugador
2. Validar que el nombre no esté vacío
3. Crear entidad Player con estado "libre" (sin club, sin salario)
4. Persistir en base de datos
5. Enviar notificación por email
6. Devolver respuesta 201 con datos del jugador

**Excepciones**:
- Nombre vacío → 400 Bad Request

---

### UC-2: Asociar Jugador a Club
**Actor**: Sistema
**Precondiciones**:
- Jugador existe y está libre
- Club existe

**Flujo Principal**:
1. Recibir clubId, playerId y salario
2. Validar que jugador esté libre (club_id IS NULL)
3. Validar que salario + suma_salarios_actuales <= presupuesto_club (RN-1)
4. Asignar club y salario al jugador
5. Actualizar suma de salarios del club
6. Persistir cambios
7. Enviar notificación por email
8. Devolver respuesta 200 con jugador actualizado

**Excepciones**:
- Jugador no existe → 404 Not Found
- Club no existe → 404 Not Found
- Jugador ya tiene club → 409 Conflict (RN-3)
- Presupuesto insuficiente → 422 Unprocessable Entity (RN-1)

---

### UC-3: Modificar Presupuesto de Club
**Actor**: Sistema
**Precondiciones**: Club existe

**Flujo Principal**:
1. Recibir clubId y nuevo presupuesto
2. Calcular suma de salarios actuales (jugadores + entrenadores)
3. Validar que nuevo_presupuesto >= suma_salarios (RN-2)
4. Actualizar presupuesto del club
5. Persistir cambios
6. Devolver respuesta 200 con club actualizado

**Excepciones**:
- Club no existe → 404 Not Found
- Presupuesto insuficiente → 422 Unprocessable Entity (RN-2)
- Presupuesto negativo → 400 Bad Request

---

### UC-4: Listar Jugadores de Club con Filtros
**Actor**: Sistema
**Precondiciones**: Club existe

**Flujo Principal**:
1. Recibir clubId, filtro de nombre (opcional), página y límite
2. Validar que club exista
3. Construir query con filtros:
   - WHERE club_id = :clubId
   - AND (opcional) name LIKE :name
   - ORDER BY name ASC
   - LIMIT :limit OFFSET :offset
4. Ejecutar query
5. Devolver respuesta 200 con:
   - Lista de jugadores
   - Metadatos de paginación (total, page, pages, limit)

**Formato de respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "salary": 50000,
      "club": {
        "id": 1,
        "name": "FC Barcelona"
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "pages": 3,
    "limit": 10
  }
}
```

---

## 🧪 Datos de Prueba (Fixtures)

### Clubes
1. **FC Barcelona** - Presupuesto: 5,000,000
2. **Real Madrid** - Presupuesto: 6,000,000
3. **Manchester United** - Presupuesto: 4,500,000

### Jugadores
- **Contratados** (10):
  - Lionel Messi (FC Barcelona, 1,500,000)
  - Cristiano Ronaldo (Real Madrid, 1,800,000)
  - Wayne Rooney (Manchester United, 1,200,000)
  - ...
- **Libres** (5):
  - Neymar Jr (sin club)
  - Kylian Mbappé (sin club)
  - ...

### Entrenadores
- **Contratados** (3):
  - Pep Guardiola (FC Barcelona, 500,000)
  - Carlo Ancelotti (Real Madrid, 600,000)
  - Erik ten Hag (Manchester United, 450,000)
- **Libres** (2):
  - Zinedine Zidane (sin club)
  - José Mourinho (sin club)

---

## ✅ Definition of Done

### Funcional
- ✅ Todas las operaciones de la API implementadas y funcionando
- ✅ Todas las reglas de negocio validadas correctamente
- ✅ Sistema de notificaciones extensible implementado
- ✅ Emails enviados en todas las operaciones requeridas
- ✅ Filtros y paginación funcionando correctamente

### Técnico
- ✅ Arquitectura DDD implementada correctamente
- ✅ Tests unitarios con cobertura mínima del 70%
- ✅ Docker configurado y funcionando
- ✅ README.md con instrucciones completas
- ✅ Dump de BD con fixtures incluido
- ✅ Colección Postman incluida
- ✅ Código siguiendo PSR-12
- ✅ Sin warnings ni errores de PHPStan nivel 6

### Documentación
- ✅ README.md con:
  - Descripción del proyecto
  - Requisitos previos
  - Instalación paso a paso (con Docker)
  - Comandos para cargar fixtures
  - Comandos para ejecutar tests
  - Estructura del proyecto
  - Ejemplos de uso de la API
- ✅ Comentarios en código donde sea necesario
- ✅ Colección Postman documentada

---

## 🎓 Consideraciones de Diseño

### Patrones a Aplicar
1. **Repository Pattern** - Acceso a datos abstraído
2. **Strategy Pattern** - Sistema de notificaciones extensible
3. **Value Objects** - Money (salario, presupuesto), Email
4. **Use Case Pattern** - Casos de uso independientes
5. **DTO Pattern** - Transferencia de datos entre capas
6. **Dependency Injection** - Todo a través del container de Symfony

### Validaciones
- **Request validation**: Symfony Validator en DTOs
- **Business rules validation**: En servicios de dominio o use cases
- **Database constraints**: Unique, Not Null, Foreign Keys

### Manejo de Errores
- Excepciones personalizadas por tipo de error
- Exception listener para convertir excepciones a respuestas JSON
- Logging de errores con Monolog

### Testing
- **Unit tests**: Lógica de negocio (servicios de dominio, use cases)
- **Integration tests**: Repositorios con base de datos de prueba
- **Functional tests**: Endpoints REST completos

---

## 📚 Referencias

- Symfony Documentation: https://symfony.com/doc/current/index.html
- Doctrine ORM: https://www.doctrine-project.org/projects/orm.html
- REST API Best Practices: https://restfulapi.net/
- DDD in PHP: https://github.com/dddinphp

---

**Listo para comenzar el desarrollo siguiendo el workflow task-breakdown.**
