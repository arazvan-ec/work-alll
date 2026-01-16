# Backend Tasks - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner
**Target Coverage**: >= 70%

---

## Task Overview

| Phase | Tasks | Priority |
|-------|-------|----------|
| 1. Project Setup | 3 tasks | Critical |
| 2. Domain Layer | 8 tasks | Critical |
| 3. Application Layer | 12 tasks | Critical |
| 4. Infrastructure Layer | 10 tasks | Critical |
| 5. Testing | 8 tasks | High |
| 6. Fixtures & Docker | 4 tasks | Medium |

**Total**: 45 tasks

---

## Phase 1: Project Setup

### Task 1.1: Initialize Symfony Project

**Priority**: Critical
**Estimated Files**: 5+

**Actions**:
```bash
cd backend
composer create-project symfony/skeleton .
composer require symfony/orm-pack
composer require symfony/validator
composer require symfony/mailer
composer require nelmio/cors-bundle
composer require --dev symfony/maker-bundle
composer require --dev phpunit/phpunit
composer require --dev doctrine/doctrine-fixtures-bundle
composer require --dev fakerphp/faker
```

**Files to Create/Modify**:
- `backend/composer.json` - Dependencies
- `backend/.env` - Environment config
- `backend/.env.example` - Template

**Acceptance Criteria**:
- [ ] `composer install` completes without errors
- [ ] `php bin/console` runs successfully
- [ ] All dependencies installed

**Verification**:
```bash
php bin/console --version
```

---

### Task 1.2: Configure Doctrine

**Priority**: Critical

**Files to Modify**:
- `backend/config/packages/doctrine.yaml`

**Configuration**:
```yaml
doctrine:
    dbal:
        url: '%env(resolve:DATABASE_URL)%'
        charset: utf8mb4
    orm:
        auto_generate_proxy_classes: true
        naming_strategy: doctrine.orm.naming_strategy.underscore_number_aware
        auto_mapping: true
        mappings:
            Domain:
                type: xml
                dir: '%kernel.project_dir%/src/Infrastructure/Persistence/Doctrine/Mapping'
                prefix: 'App\Domain'
                is_bundle: false
```

**Acceptance Criteria**:
- [ ] Doctrine configured for XML mappings
- [ ] Database connection works

**Verification**:
```bash
php bin/console doctrine:schema:validate
```

---

### Task 1.3: Configure CORS

**Priority**: Critical

**Files to Create/Modify**:
- `backend/config/packages/nelmio_cors.yaml`

**Configuration**:
```yaml
nelmio_cors:
    defaults:
        allow_credentials: false
        allow_origin: ['*']
        allow_headers: ['Content-Type', 'Accept']
        allow_methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
        max_age: 3600
    paths:
        '^/api/':
            allow_origin: ['*']
            allow_headers: ['*']
            allow_methods: ['GET', 'POST', 'PATCH', 'DELETE']
```

**Acceptance Criteria**:
- [ ] CORS allows frontend requests
- [ ] OPTIONS preflight requests work

---

## Phase 2: Domain Layer

### Task 2.1: Create Money Value Object

**Priority**: Critical
**File**: `backend/src/Domain/Shared/ValueObject/Money.php`

**Implementation**:
```php
<?php
declare(strict_types=1);

namespace App\Domain\Shared\ValueObject;

class Money
{
    private int $amount;

    private function __construct(int $amount)
    {
        if ($amount < 0) {
            throw new \InvalidArgumentException('Money amount cannot be negative');
        }
        $this->amount = $amount;
    }

    public static function fromInteger(int $amount): self
    {
        return new self($amount);
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function getAmount(): int
    {
        return $this->amount;
    }

    public function add(Money $other): self
    {
        return new self($this->amount + $other->amount);
    }

    public function subtract(Money $other): self
    {
        $result = $this->amount - $other->amount;
        if ($result < 0) {
            throw new \InvalidArgumentException('Result cannot be negative');
        }
        return new self($result);
    }

    public function isGreaterThan(Money $other): bool
    {
        return $this->amount > $other->amount;
    }

    public function isGreaterOrEqual(Money $other): bool
    {
        return $this->amount >= $other->amount;
    }

    public function isLessThan(Money $other): bool
    {
        return $this->amount < $other->amount;
    }

    public function equals(Money $other): bool
    {
        return $this->amount === $other->amount;
    }
}
```

**Acceptance Criteria**:
- [ ] Money is immutable
- [ ] All arithmetic operations work correctly
- [ ] Negative amounts throw exception
- [ ] Unit tests pass

**Test File**: `backend/tests/Unit/Domain/Shared/ValueObject/MoneyTest.php`

---

### Task 2.2: Create Club Entity

**Priority**: Critical
**File**: `backend/src/Domain/Club/Entity/Club.php`

**Implementation Requirements**:
- Properties: id, name, budget (Money), players (Collection), coaches (Collection), createdAt
- Factory method: `create(string $name, Money $budget)`
- Business methods: `getTotalSalaries()`, `getAvailableBudget()`, `canAffordSalary()`, `updateBudget()`
- Collection methods: `addPlayer()`, `removePlayer()`, `addCoach()`, `removeCoach()`

**Key Business Logic**:
```php
public function updateBudget(Money $newBudget): void
{
    $totalSalaries = $this->getTotalSalaries();

    if ($newBudget->isLessThan($totalSalaries)) {
        throw BudgetExceededException::cannotReduceBelowSalaries(
            $newBudget,
            $totalSalaries
        );
    }

    $this->budget = $newBudget;
}
```

**Acceptance Criteria**:
- [ ] Entity validates name (3-100 chars)
- [ ] `getTotalSalaries()` sums all player and coach salaries
- [ ] `updateBudget()` validates against RN-2
- [ ] Unit tests pass

**Test File**: `backend/tests/Unit/Domain/Club/Entity/ClubTest.php`

---

### Task 2.3: Create Player Entity

**Priority**: Critical
**File**: `backend/src/Domain/Player/Entity/Player.php`

**Implementation Requirements**:
- Properties: id, name, club (nullable), salary (nullable Money), createdAt
- Factory method: `createFree(string $name)`
- State methods: `isFree()`, `isHired()`
- Business methods: `assignToClub(Club $club, Money $salary)`, `releaseFromClub()`

**Key Business Logic**:
```php
public function assignToClub(Club $club, Money $salary): void
{
    if (!$this->isFree()) {
        throw PlayerAlreadyHiredException::create($this->id, $this->club->getId());
    }

    $this->club = $club;
    $this->salary = $salary;
    $club->addPlayer($this);
}
```

**Acceptance Criteria**:
- [ ] Entity validates name (3-100 chars)
- [ ] `assignToClub()` validates RN-3 (exclusivity)
- [ ] `releaseFromClub()` sets club and salary to null
- [ ] Bi-directional relationship with Club maintained
- [ ] Unit tests pass

**Test File**: `backend/tests/Unit/Domain/Player/Entity/PlayerTest.php`

---

### Task 2.4: Create Coach Entity

**Priority**: Critical
**File**: `backend/src/Domain/Coach/Entity/Coach.php`

**Implementation**: Mirror of Player entity with Coach-specific exceptions.

**Acceptance Criteria**:
- [ ] Same structure as Player
- [ ] Uses Coach-specific exceptions
- [ ] Unit tests pass

**Test File**: `backend/tests/Unit/Domain/Coach/Entity/CoachTest.php`

---

### Task 2.5: Create Domain Exceptions

**Priority**: Critical

**Files to Create**:
- `backend/src/Domain/Shared/Exception/DomainException.php`
- `backend/src/Domain/Club/Exception/ClubNotFoundException.php`
- `backend/src/Domain/Club/Exception/BudgetExceededException.php`
- `backend/src/Domain/Player/Exception/PlayerNotFoundException.php`
- `backend/src/Domain/Player/Exception/PlayerAlreadyHiredException.php`
- `backend/src/Domain/Player/Exception/PlayerNotInClubException.php`
- `backend/src/Domain/Coach/Exception/CoachNotFoundException.php`
- `backend/src/Domain/Coach/Exception/CoachAlreadyHiredException.php`
- `backend/src/Domain/Coach/Exception/CoachNotInClubException.php`

**Example**:
```php
<?php
namespace App\Domain\Club\Exception;

use App\Domain\Shared\ValueObject\Money;

class BudgetExceededException extends \DomainException
{
    public static function cannotAfford(Money $available, Money $required): self
    {
        return new self(sprintf(
            'Budget exceeded. Available: %d, Required: %d',
            $available->getAmount(),
            $required->getAmount()
        ));
    }

    public static function cannotReduceBelowSalaries(Money $newBudget, Money $currentSalaries): self
    {
        return new self(sprintf(
            'Budget cannot be lower than current salaries. Current: %d',
            $currentSalaries->getAmount()
        ));
    }
}
```

**Acceptance Criteria**:
- [ ] All exceptions extend DomainException
- [ ] Factory methods with clear messages
- [ ] Messages match API contract

---

### Task 2.6: Create Repository Interfaces

**Priority**: Critical

**Files to Create**:
- `backend/src/Domain/Club/Repository/ClubRepositoryInterface.php`
- `backend/src/Domain/Player/Repository/PlayerRepositoryInterface.php`
- `backend/src/Domain/Coach/Repository/CoachRepositoryInterface.php`

**ClubRepositoryInterface**:
```php
<?php
namespace App\Domain\Club\Repository;

use App\Domain\Club\Entity\Club;

interface ClubRepositoryInterface
{
    public function save(Club $club): void;
    public function findById(int $id): ?Club;
    public function findAll(): array;
    public function remove(Club $club): void;
}
```

**PlayerRepositoryInterface**:
```php
<?php
namespace App\Domain\Player\Repository;

use App\Domain\Player\Entity\Player;

interface PlayerRepositoryInterface
{
    public function save(Player $player): void;
    public function findById(int $id): ?Player;
    public function findAll(): array;
    public function findFree(): array;
    public function findByClubPaginated(int $clubId, ?string $name, int $page, int $limit): array;
    public function countByClub(int $clubId, ?string $name): int;
    public function remove(Player $player): void;
}
```

**Acceptance Criteria**:
- [ ] Interfaces define all required methods
- [ ] Return types are domain entities
- [ ] No infrastructure dependencies

---

### Task 2.7: Create Doctrine Mappings

**Priority**: Critical

**Files to Create**:
- `backend/src/Infrastructure/Persistence/Doctrine/Mapping/Club.orm.xml`
- `backend/src/Infrastructure/Persistence/Doctrine/Mapping/Player.orm.xml`
- `backend/src/Infrastructure/Persistence/Doctrine/Mapping/Coach.orm.xml`

**Club.orm.xml** (see architecture doc for full mapping)

**Acceptance Criteria**:
- [ ] All entities mapped correctly
- [ ] Relationships (OneToMany, ManyToOne) correct
- [ ] Nullable fields handled
- [ ] `doctrine:schema:validate` passes

**Verification**:
```bash
php bin/console doctrine:schema:validate
```

---

### Task 2.8: Create Doctrine Repositories

**Priority**: Critical

**Files to Create**:
- `backend/src/Infrastructure/Persistence/Repository/DoctrineClubRepository.php`
- `backend/src/Infrastructure/Persistence/Repository/DoctrinePlayerRepository.php`
- `backend/src/Infrastructure/Persistence/Repository/DoctrineCoachRepository.php`

**DoctrinePlayerRepository with pagination**:
```php
public function findByClubPaginated(int $clubId, ?string $name, int $page, int $limit): array
{
    $qb = $this->entityManager->createQueryBuilder();
    $qb->select('p')
       ->from(Player::class, 'p')
       ->where('p.club = :clubId')
       ->setParameter('clubId', $clubId);

    if ($name !== null) {
        $qb->andWhere('p.name LIKE :name')
           ->setParameter('name', '%' . $name . '%');
    }

    $qb->orderBy('p.name', 'ASC')
       ->setFirstResult(($page - 1) * $limit)
       ->setMaxResults($limit);

    return $qb->getQuery()->getResult();
}
```

**Acceptance Criteria**:
- [ ] Implements repository interface
- [ ] Uses Doctrine EntityManager
- [ ] Pagination works correctly
- [ ] Filtering works correctly

---

## Phase 3: Application Layer

### Task 3.1: Create Club DTOs

**Priority**: Critical

**Files to Create**:
- `backend/src/Application/Club/DTO/CreateClubRequest.php`
- `backend/src/Application/Club/DTO/CreateClubResponse.php`
- `backend/src/Application/Club/DTO/UpdateBudgetRequest.php`
- `backend/src/Application/Club/DTO/ClubResponse.php`

**Example**:
```php
<?php
namespace App\Application\Club\DTO;

class CreateClubRequest
{
    public function __construct(
        public readonly string $name,
        public readonly int $budget
    ) {}
}

class ClubResponse
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly int $budget,
        public readonly int $totalSalaries,
        public readonly int $availableBudget,
        public readonly string $createdAt
    ) {}

    public static function fromEntity(Club $club): self
    {
        return new self(
            $club->getId(),
            $club->getName(),
            $club->getBudget()->getAmount(),
            $club->getTotalSalaries()->getAmount(),
            $club->getAvailableBudget()->getAmount(),
            $club->getCreatedAt()->format(\DateTimeInterface::ATOM)
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'budget' => $this->budget,
            'totalSalaries' => $this->totalSalaries,
            'availableBudget' => $this->availableBudget,
            'createdAt' => $this->createdAt,
        ];
    }
}
```

---

### Task 3.2: Create CreateClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/CreateClub/CreateClubUseCase.php`

```php
<?php
namespace App\Application\Club\UseCase\CreateClub;

class CreateClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(CreateClubRequest $request): ClubResponse
    {
        $budget = Money::fromInteger($request->budget);
        $club = Club::create($request->name, $budget);

        $this->clubRepository->save($club);

        return ClubResponse::fromEntity($club);
    }
}
```

**Acceptance Criteria**:
- [ ] Validates name and budget through entity
- [ ] Persists club
- [ ] Returns ClubResponse
- [ ] Unit tests pass

**Test File**: `backend/tests/Unit/Application/Club/UseCase/CreateClubUseCaseTest.php`

---

### Task 3.3: Create GetClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/GetClub/GetClubUseCase.php`

**Acceptance Criteria**:
- [ ] Returns club with players and coaches
- [ ] Throws ClubNotFoundException if not found

---

### Task 3.4: Create UpdateClubBudgetUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/UpdateClubBudget/UpdateClubBudgetUseCase.php`

**Acceptance Criteria**:
- [ ] Validates RN-2 through Club entity
- [ ] Updates and persists club
- [ ] Unit tests cover budget reduction scenarios

---

### Task 3.5: Create AssignPlayerToClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/AssignPlayer/AssignPlayerToClubUseCase.php`

**Critical Logic**:
1. Find club (404 if not found)
2. Find player (404 if not found)
3. Validate budget (RN-1)
4. Assign player (validates RN-3)
5. Save changes
6. Send notification (RN-4)

**Acceptance Criteria**:
- [ ] All business rules validated
- [ ] Notification sent on success
- [ ] Unit tests cover all scenarios

**Test Scenarios**:
- Happy path: player assigned
- Club not found
- Player not found
- Player already hired (409)
- Budget exceeded (422)

---

### Task 3.6: Create ReleasePlayerFromClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/ReleasePlayer/ReleasePlayerFromClubUseCase.php`

**Acceptance Criteria**:
- [ ] Validates player belongs to club
- [ ] Releases player (sets club and salary to null)
- [ ] Sends notification
- [ ] Unit tests pass

---

### Task 3.7: Create AssignCoachToClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/AssignCoach/AssignCoachToClubUseCase.php`

Mirror of AssignPlayerToClubUseCase.

---

### Task 3.8: Create ReleaseCoachFromClubUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/ReleaseCoach/ReleaseCoachFromClubUseCase.php`

Mirror of ReleasePlayerFromClubUseCase.

---

### Task 3.9: Create ListClubPlayersUseCase

**Priority**: Critical
**File**: `backend/src/Application/Club/UseCase/ListClubPlayers/ListClubPlayersUseCase.php`

**Requirements**:
- Pagination support (page, limit)
- Name filter (partial match)
- Return PaginatedResponse

---

### Task 3.10: Create CreatePlayerUseCase

**Priority**: Critical
**File**: `backend/src/Application/Player/UseCase/CreatePlayer/CreatePlayerUseCase.php`

**Requirements**:
- Create player as free agent
- Send notification (RN-4)

---

### Task 3.11: Create CreateCoachUseCase

**Priority**: Critical
**File**: `backend/src/Application/Coach/UseCase/CreateCoach/CreateCoachUseCase.php`

Mirror of CreatePlayerUseCase.

---

### Task 3.12: Create NotificationService

**Priority**: Critical

**Files to Create**:
- `backend/src/Application/Notification/NotificationServiceInterface.php`
- `backend/src/Application/Notification/NotificationService.php`
- `backend/src/Infrastructure/Notification/Channel/NotificationChannelInterface.php`
- `backend/src/Infrastructure/Notification/Channel/EmailNotificationChannel.php`

**Strategy Pattern Implementation**:
```php
<?php
namespace App\Application\Notification;

class NotificationService implements NotificationServiceInterface
{
    /** @var NotificationChannelInterface[] */
    private array $channels;

    public function __construct(iterable $channels)
    {
        $this->channels = iterator_to_array($channels);
    }

    public function notifyPlayerCreated(Player $player): void
    {
        $message = new NotificationMessage(
            'admin@sportian.com',
            'New Player Registered',
            sprintf('Player %s has been registered as free agent.', $player->getName())
        );

        $this->send($message);
    }

    public function notifyPlayerAssigned(Player $player, Club $club): void
    {
        $message = new NotificationMessage(
            'admin@sportian.com',
            'Player Hired',
            sprintf('Player %s has been hired by %s.', $player->getName(), $club->getName())
        );

        $this->send($message);
    }

    private function send(NotificationMessage $message): void
    {
        foreach ($this->channels as $channel) {
            if ($channel->supports('email')) {
                $channel->send($message);
            }
        }
    }
}
```

**Acceptance Criteria**:
- [ ] Extensible design (new channels can be added)
- [ ] Email channel implemented
- [ ] All required events trigger notifications
- [ ] Service registered in container

---

## Phase 4: Infrastructure Layer

### Task 4.1: Create ClubController

**Priority**: Critical
**File**: `backend/src/Infrastructure/Http/Controller/ClubController.php`

**Endpoints**:
- `POST /api/clubs` - Create club
- `GET /api/clubs` - List all clubs
- `GET /api/clubs/{id}` - Get club details
- `PATCH /api/clubs/{id}/budget` - Update budget
- `POST /api/clubs/{clubId}/players/{playerId}` - Assign player
- `DELETE /api/clubs/{clubId}/players/{playerId}` - Release player
- `POST /api/clubs/{clubId}/coaches/{coachId}` - Assign coach
- `DELETE /api/clubs/{clubId}/coaches/{coachId}` - Release coach
- `GET /api/clubs/{id}/players` - List club players

**Acceptance Criteria**:
- [ ] All endpoints implemented
- [ ] JSON responses match API contract
- [ ] HTTP status codes correct
- [ ] Error handling with proper responses

---

### Task 4.2: Create PlayerController

**Priority**: Critical
**File**: `backend/src/Infrastructure/Http/Controller/PlayerController.php`

**Endpoints**:
- `POST /api/players` - Create player
- `GET /api/players` - List all players
- `GET /api/players/{id}` - Get player details

---

### Task 4.3: Create CoachController

**Priority**: Critical
**File**: `backend/src/Infrastructure/Http/Controller/CoachController.php`

Mirror of PlayerController.

---

### Task 4.4: Create DashboardController (Optional)

**Priority**: Medium
**File**: `backend/src/Infrastructure/Http/Controller/DashboardController.php`

**Endpoint**:
- `GET /api/dashboard/stats` - Get aggregated stats

---

### Task 4.5: Create ExceptionListener

**Priority**: Critical
**File**: `backend/src/Infrastructure/Exception/ExceptionListener.php`

**Maps domain exceptions to HTTP responses**:
```php
<?php
namespace App\Infrastructure\Exception;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class ExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $response = match (true) {
            $exception instanceof ClubNotFoundException,
            $exception instanceof PlayerNotFoundException,
            $exception instanceof CoachNotFoundException => new JsonResponse(
                ['error' => $exception->getMessage()],
                404
            ),
            $exception instanceof PlayerAlreadyHiredException,
            $exception instanceof CoachAlreadyHiredException => new JsonResponse(
                ['error' => $exception->getMessage()],
                409
            ),
            $exception instanceof BudgetExceededException => new JsonResponse(
                ['error' => $exception->getMessage()],
                422
            ),
            $exception instanceof \InvalidArgumentException => new JsonResponse(
                ['error' => $exception->getMessage()],
                400
            ),
            default => null
        };

        if ($response !== null) {
            $event->setResponse($response);
        }
    }
}
```

**Register in services.yaml**:
```yaml
services:
    App\Infrastructure\Exception\ExceptionListener:
        tags:
            - { name: kernel.event_listener, event: kernel.exception }
```

---

### Task 4.6: Configure Services

**Priority**: Critical
**File**: `backend/config/services.yaml`

**Register**:
- Repository implementations
- Use cases
- Notification service with tagged channels
- Exception listener

---

### Task 4.7: Configure Routes

**Priority**: Critical
**File**: `backend/config/routes.yaml`

Or use annotations/attributes in controllers.

---

### Task 4.8: Configure Validation

**Priority**: High

Implement request validation in controllers or create validator service.

---

### Task 4.9: Configure Mailer

**Priority**: High
**File**: `backend/config/packages/mailer.yaml`

```yaml
framework:
    mailer:
        dsn: '%env(MAILER_DSN)%'
```

**.env**:
```
MAILER_DSN=smtp://localhost:1025
```

---

### Task 4.10: Create Database Migration

**Priority**: Critical

```bash
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate
```

---

## Phase 5: Testing

### Task 5.1: Unit Tests - Money Value Object

**File**: `backend/tests/Unit/Domain/Shared/ValueObject/MoneyTest.php`

**Test Cases**:
- Create money with positive amount
- Create money with zero
- Reject negative amount
- Add two money values
- Subtract money values
- Compare money values

---

### Task 5.2: Unit Tests - Club Entity

**File**: `backend/tests/Unit/Domain/Club/Entity/ClubTest.php`

**Test Cases**:
- Create club with valid data
- Reject invalid name (too short/long)
- Calculate total salaries correctly
- Calculate available budget
- Update budget successfully
- Reject budget below salaries (RN-2)
- Add/remove players and coaches

---

### Task 5.3: Unit Tests - Player Entity

**File**: `backend/tests/Unit/Domain/Player/Entity/PlayerTest.php`

**Test Cases**:
- Create free player
- Reject invalid name
- Check isFree/isHired states
- Assign to club successfully
- Reject assignment if already hired (RN-3)
- Release from club

---

### Task 5.4: Unit Tests - Use Cases

**Files**:
- `backend/tests/Unit/Application/Club/UseCase/CreateClubUseCaseTest.php`
- `backend/tests/Unit/Application/Club/UseCase/UpdateClubBudgetUseCaseTest.php`
- `backend/tests/Unit/Application/Club/UseCase/AssignPlayerToClubUseCaseTest.php`
- `backend/tests/Unit/Application/Club/UseCase/ReleasePlayerFromClubUseCaseTest.php`
- `backend/tests/Unit/Application/Player/UseCase/CreatePlayerUseCaseTest.php`

**Mock repositories and notification service**.

---

### Task 5.5: Integration Tests - Repositories

**Files**:
- `backend/tests/Integration/Persistence/DoctrineClubRepositoryTest.php`
- `backend/tests/Integration/Persistence/DoctrinePlayerRepositoryTest.php`

**Use SQLite in-memory for tests**.

---

### Task 5.6: Functional Tests - Club Endpoints

**File**: `backend/tests/Functional/Controller/ClubControllerTest.php`

**Test all endpoints with HTTP requests**.

---

### Task 5.7: Functional Tests - Player Endpoints

**File**: `backend/tests/Functional/Controller/PlayerControllerTest.php`

---

### Task 5.8: Functional Tests - Business Rules

**File**: `backend/tests/Functional/BusinessRulesTest.php`

**Critical test scenarios**:
- Assign player exceeds budget → 422
- Reduce budget below salaries → 422
- Assign already hired player → 409

---

## Phase 6: Fixtures & Docker

### Task 6.1: Create Fixtures

**Priority**: High
**File**: `backend/src/DataFixtures/AppFixtures.php`

**Data to Load**:
- 3 clubs with budgets
- 15 players (9 hired, 6 free)
- 5 coaches (3 hired, 2 free)

**Use Faker for realistic data**.

---

### Task 6.2: Create Dockerfile

**Priority**: High
**File**: `backend/docker/php/Dockerfile`

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
```

---

### Task 6.3: Create docker-compose.yaml

**Priority**: High
**File**: `backend/docker-compose.yaml`

```yaml
version: '3.8'

services:
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    volumes:
      - .:/var/www/html
    depends_on:
      - mysql

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: sportian
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

### Task 6.4: Create README.md

**Priority**: High
**File**: `backend/README.md`

**Include**:
- Project description
- Requirements
- Installation steps
- Docker commands
- Test commands
- API examples

---

## Verification Checklist

### Before Marking COMPLETED

- [ ] All 16 API endpoints functional
- [ ] All 4 business rules (RN-1 to RN-4) validated
- [ ] DDD architecture implemented (Domain/Application/Infrastructure)
- [ ] Tests passing with >= 70% coverage
- [ ] Docker setup works (`docker-compose up -d`)
- [ ] Fixtures loaded successfully
- [ ] No PHPStan errors at level 6
- [ ] PSR-12 code style followed

### Commands to Verify

```bash
# Run all tests
./vendor/bin/phpunit

# Check coverage
./vendor/bin/phpunit --coverage-html var/coverage

# Validate schema
php bin/console doctrine:schema:validate

# Load fixtures
php bin/console doctrine:fixtures:load -n

# PHPStan
./vendor/bin/phpstan analyse src --level=6
```

---

**Document Status**: COMPLETE
**Ready for**: Frontend Tasks (31_tasks_frontend.md)
