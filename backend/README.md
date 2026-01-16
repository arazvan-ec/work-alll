# Sportian Backend API

Sistema de Gestión de Clubes Deportivos, Jugadores y Entrenadores.

## Descripción

API REST para gestionar clubes deportivos con control de presupuestos y salarios. Implementado con Symfony 6.4 siguiendo Domain-Driven Design (DDD).

### Características principales

- **Gestión de Clubes**: Crear clubes con presupuesto inicial, modificar presupuesto
- **Gestión de Jugadores**: Alta de jugadores libres, asociar/liberar a clubes
- **Gestión de Entrenadores**: Alta de entrenadores libres, asociar/liberar a clubes
- **Control de Presupuesto**: Validación automática de que los salarios no excedan el presupuesto
- **Notificaciones**: Sistema extensible de notificaciones (email)
- **Listados paginados**: Filtros y paginación en listados

## Requisitos

- Docker y Docker Compose
- (Alternativa) PHP 8.1+, Composer, MySQL 8.0+

## Instalación con Docker

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd sportian/backend

# 2. Copiar archivo de entorno
cp .env.example .env

# 3. Iniciar los contenedores
docker-compose up -d

# 4. Instalar dependencias
docker-compose exec php composer install

# 5. Crear base de datos y ejecutar migraciones
docker-compose exec php bin/console doctrine:database:create --if-not-exists
docker-compose exec php bin/console doctrine:schema:create

# 6. Cargar datos de prueba (fixtures)
docker-compose exec php bin/console doctrine:fixtures:load --no-interaction

# 7. Verificar la instalación
curl http://localhost:8080/api/clubs/1
```

## Instalación local (sin Docker)

```bash
# 1. Instalar dependencias
composer install

# 2. Configurar base de datos en .env
# DATABASE_URL="mysql://user:password@127.0.0.1:3306/sportian"

# 3. Crear base de datos
php bin/console doctrine:database:create

# 4. Crear esquema
php bin/console doctrine:schema:create

# 5. Cargar fixtures
php bin/console doctrine:fixtures:load --no-interaction

# 6. Iniciar servidor de desarrollo
symfony server:start
# o
php -S localhost:8080 -t public
```

## Estructura del Proyecto

```
backend/
├── config/                    # Configuración Symfony
│   └── doctrine/              # Doctrine XML mappings
├── docker/                    # Configuración Docker
│   ├── nginx/
│   └── php/
├── src/
│   ├── Domain/                # Capa de Dominio (DDD)
│   │   ├── Entity/            # Club, Player, Coach
│   │   ├── ValueObject/       # Money
│   │   ├── Repository/        # Interfaces de repositorios
│   │   ├── Exception/         # Excepciones de dominio
│   │   └── Service/           # NotificationChannelInterface
│   ├── Application/           # Capa de Aplicación
│   │   ├── UseCase/           # Casos de uso
│   │   ├── DTO/               # Data Transfer Objects
│   │   └── Service/           # NotificationService
│   ├── Infrastructure/        # Capa de Infraestructura
│   │   ├── Persistence/       # Doctrine repositories
│   │   ├── Http/              # Controllers REST
│   │   └── Notification/      # EmailNotificationChannel
│   └── DataFixtures/          # Datos de prueba
├── tests/                     # Tests unitarios y funcionales
├── .env.example               # Template de configuración
├── docker-compose.yaml        # Configuración Docker
└── README.md
```

## API Endpoints

### Jugadores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/players` | Crear jugador libre |
| GET | `/api/players/{id}` | Obtener jugador |

### Entrenadores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/coaches` | Crear entrenador libre |
| GET | `/api/coaches/{id}` | Obtener entrenador |

### Clubes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/clubs` | Crear club |
| GET | `/api/clubs/{id}` | Obtener club |
| PATCH | `/api/clubs/{clubId}/budget` | Modificar presupuesto |
| POST | `/api/clubs/{clubId}/players/{playerId}` | Asociar jugador |
| DELETE | `/api/clubs/{clubId}/players/{playerId}` | Liberar jugador |
| POST | `/api/clubs/{clubId}/coaches/{coachId}` | Asociar entrenador |
| DELETE | `/api/clubs/{clubId}/coaches/{coachId}` | Liberar entrenador |
| GET | `/api/clubs/{clubId}/players` | Listar jugadores del club |

## Ejemplos de Uso

### Crear un jugador

```bash
curl -X POST http://localhost:8080/api/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Neymar Jr"}'
```

### Crear un club

```bash
curl -X POST http://localhost:8080/api/clubs \
  -H "Content-Type: application/json" \
  -d '{"name": "PSG", "budget": 8000000}'
```

### Asociar jugador a club

```bash
curl -X POST http://localhost:8080/api/clubs/1/players/5 \
  -H "Content-Type: application/json" \
  -d '{"salary": 1000000}'
```

### Modificar presupuesto

```bash
curl -X PATCH http://localhost:8080/api/clubs/1/budget \
  -H "Content-Type: application/json" \
  -d '{"budget": 6000000}'
```

### Listar jugadores con filtros

```bash
curl "http://localhost:8080/api/clubs/1/players?name=Messi&page=1&limit=10"
```

## Reglas de Negocio

### RN-1: Control de Presupuesto al Contratar
La suma de salarios no puede superar el presupuesto del club.
- Código HTTP: `422 Unprocessable Entity`
- Error: `"Budget exceeded. Available: X, Required: Y"`

### RN-2: Control de Presupuesto al Modificar
No se puede reducir el presupuesto por debajo de la suma actual de salarios.
- Código HTTP: `422 Unprocessable Entity`
- Error: `"Budget cannot be lower than current salaries. Current: X"`

### RN-3: Exclusividad de Club
Un jugador o entrenador no puede pertenecer a más de un club.
- Código HTTP: `409 Conflict`
- Error: `"Player is already associated with another club"`

### RN-4: Notificaciones
Se envían notificaciones por email en:
- Alta de jugador/entrenador
- Asociación a club
- Liberación de club

## Ejecutar Tests

```bash
# Todos los tests
./vendor/bin/phpunit

# Solo tests unitarios
./vendor/bin/phpunit tests/Unit

# Con cobertura
./vendor/bin/phpunit --coverage-html var/coverage
```

## Fixtures

Los datos de prueba incluyen:

**Clubes (3)**:
- FC Barcelona (presupuesto: 5,000,000)
- Real Madrid (presupuesto: 6,000,000)
- Manchester United (presupuesto: 4,500,000)

**Jugadores (16)**:
- 11 contratados en los clubes
- 5 libres (Neymar, Mbappé, Salah, Haaland, De Bruyne)

**Entrenadores (5)**:
- 3 contratados (Guardiola, Ancelotti, Ten Hag)
- 2 libres (Zidane, Mourinho)

## Arquitectura DDD

El proyecto sigue Domain-Driven Design con tres capas:

1. **Domain**: Entidades, Value Objects, interfaces de repositorio, excepciones
2. **Application**: Casos de uso, DTOs, servicios de aplicación
3. **Infrastructure**: Implementaciones de repositorios, controllers, notificaciones

## Tecnologías

- PHP 8.1+
- Symfony 6.4 LTS
- Doctrine ORM
- MySQL 8.0
- PHPUnit 12
- Docker & Docker Compose

## Licencia

Prueba técnica - Uso privado
