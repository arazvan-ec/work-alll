# Architecture Design - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                     React 18 + TypeScript                           │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   Pages  │  │Components│  │  Hooks   │  │ Services │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                               HTTP/REST
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│                     Symfony 6.4 + DDD                               │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Infrastructure Layer                      │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │   │
│  │  │  Controllers  │  │  Repositories │  │  Notification   │  │   │
│  │  │   (HTTP)      │  │   (Doctrine)  │  │  (Email/SMS)    │  │   │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Application Layer                         │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │   │
│  │  │   Use Cases   │  │     DTOs      │  │    Services     │  │   │
│  │  │ (Commands)    │  │ (Request/Res) │  │ (Orchestration) │  │   │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      Domain Layer                            │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │   │
│  │  │   Entities    │  │ Value Objects │  │   Exceptions    │  │   │
│  │  │ Club,Player,  │  │    Money      │  │  Domain Errors  │  │   │
│  │  │    Coach      │  │               │  │                 │  │   │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘  │   │
│  │  ┌───────────────┐                                          │   │
│  │  │  Repository   │                                          │   │
│  │  │  Interfaces   │                                          │   │
│  │  └───────────────┘                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │    Database     │
                          │  MySQL/Postgres │
                          └─────────────────┘
```

---

## 2. Backend Architecture (DDD)

### 2.1 Directory Structure

```
backend/
├── config/
│   ├── packages/
│   │   ├── doctrine.yaml
│   │   ├── framework.yaml
│   │   ├── mailer.yaml
│   │   └── nelmio_cors.yaml
│   ├── routes.yaml
│   └── services.yaml
│
├── src/
│   ├── Domain/                          # DOMAIN LAYER
│   │   ├── Club/
│   │   │   ├── Entity/
│   │   │   │   └── Club.php
│   │   │   ├── Repository/
│   │   │   │   └── ClubRepositoryInterface.php
│   │   │   └── Exception/
│   │   │       ├── ClubNotFoundException.php
│   │   │       └── BudgetExceededException.php
│   │   │
│   │   ├── Player/
│   │   │   ├── Entity/
│   │   │   │   └── Player.php
│   │   │   ├── Repository/
│   │   │   │   └── PlayerRepositoryInterface.php
│   │   │   └── Exception/
│   │   │       ├── PlayerNotFoundException.php
│   │   │       └── PlayerAlreadyHiredException.php
│   │   │
│   │   ├── Coach/
│   │   │   ├── Entity/
│   │   │   │   └── Coach.php
│   │   │   ├── Repository/
│   │   │   │   └── CoachRepositoryInterface.php
│   │   │   └── Exception/
│   │   │       ├── CoachNotFoundException.php
│   │   │       └── CoachAlreadyHiredException.php
│   │   │
│   │   └── Shared/
│   │       ├── ValueObject/
│   │       │   └── Money.php
│   │       └── Exception/
│   │           └── DomainException.php
│   │
│   ├── Application/                     # APPLICATION LAYER
│   │   ├── Club/
│   │   │   ├── UseCase/
│   │   │   │   ├── CreateClub/
│   │   │   │   │   ├── CreateClubUseCase.php
│   │   │   │   │   ├── CreateClubRequest.php
│   │   │   │   │   └── CreateClubResponse.php
│   │   │   │   ├── GetClub/
│   │   │   │   │   ├── GetClubUseCase.php
│   │   │   │   │   └── GetClubResponse.php
│   │   │   │   ├── UpdateClubBudget/
│   │   │   │   │   ├── UpdateClubBudgetUseCase.php
│   │   │   │   │   ├── UpdateClubBudgetRequest.php
│   │   │   │   │   └── UpdateClubBudgetResponse.php
│   │   │   │   ├── AssignPlayer/
│   │   │   │   │   ├── AssignPlayerToClubUseCase.php
│   │   │   │   │   ├── AssignPlayerRequest.php
│   │   │   │   │   └── AssignPlayerResponse.php
│   │   │   │   ├── ReleasePlayer/
│   │   │   │   │   ├── ReleasePlayerFromClubUseCase.php
│   │   │   │   │   └── ReleasePlayerResponse.php
│   │   │   │   ├── AssignCoach/
│   │   │   │   │   ├── AssignCoachToClubUseCase.php
│   │   │   │   │   ├── AssignCoachRequest.php
│   │   │   │   │   └── AssignCoachResponse.php
│   │   │   │   ├── ReleaseCoach/
│   │   │   │   │   ├── ReleaseCoachFromClubUseCase.php
│   │   │   │   │   └── ReleaseCoachResponse.php
│   │   │   │   └── ListClubPlayers/
│   │   │   │       ├── ListClubPlayersUseCase.php
│   │   │   │       ├── ListClubPlayersRequest.php
│   │   │   │       └── ListClubPlayersResponse.php
│   │   │   └── DTO/
│   │   │       ├── ClubDTO.php
│   │   │       └── PaginatedPlayersDTO.php
│   │   │
│   │   ├── Player/
│   │   │   └── UseCase/
│   │   │       ├── CreatePlayer/
│   │   │       │   ├── CreatePlayerUseCase.php
│   │   │       │   ├── CreatePlayerRequest.php
│   │   │       │   └── CreatePlayerResponse.php
│   │   │       └── GetPlayer/
│   │   │           ├── GetPlayerUseCase.php
│   │   │           └── GetPlayerResponse.php
│   │   │
│   │   ├── Coach/
│   │   │   └── UseCase/
│   │   │       ├── CreateCoach/
│   │   │       │   ├── CreateCoachUseCase.php
│   │   │       │   ├── CreateCoachRequest.php
│   │   │       │   └── CreateCoachResponse.php
│   │   │       └── GetCoach/
│   │   │           ├── GetCoachUseCase.php
│   │   │           └── GetCoachResponse.php
│   │   │
│   │   └── Notification/
│   │       ├── NotificationServiceInterface.php
│   │       └── NotificationService.php
│   │
│   └── Infrastructure/                  # INFRASTRUCTURE LAYER
│       ├── Persistence/
│       │   ├── Doctrine/
│       │   │   ├── Mapping/
│       │   │   │   ├── Club.orm.xml
│       │   │   │   ├── Player.orm.xml
│       │   │   │   └── Coach.orm.xml
│       │   │   └── Type/
│       │   │       └── MoneyType.php
│       │   └── Repository/
│       │       ├── DoctrineClubRepository.php
│       │       ├── DoctrinePlayerRepository.php
│       │       └── DoctrineCoachRepository.php
│       │
│       ├── Http/
│       │   ├── Controller/
│       │   │   ├── ClubController.php
│       │   │   ├── PlayerController.php
│       │   │   └── CoachController.php
│       │   └── Response/
│       │       └── ApiResponse.php
│       │
│       ├── Notification/
│       │   ├── Channel/
│       │   │   ├── NotificationChannelInterface.php
│       │   │   └── EmailNotificationChannel.php
│       │   └── Message/
│       │       ├── NotificationMessage.php
│       │       └── PlayerCreatedMessage.php
│       │
│       └── Exception/
│           └── ExceptionListener.php
│
├── tests/
│   ├── Unit/
│   │   ├── Domain/
│   │   │   ├── Club/
│   │   │   │   └── Entity/
│   │   │   │       └── ClubTest.php
│   │   │   ├── Player/
│   │   │   │   └── Entity/
│   │   │   │       └── PlayerTest.php
│   │   │   ├── Coach/
│   │   │   │   └── Entity/
│   │   │   │       └── CoachTest.php
│   │   │   └── Shared/
│   │   │       └── ValueObject/
│   │   │           └── MoneyTest.php
│   │   └── Application/
│   │       ├── Club/
│   │       │   └── UseCase/
│   │       │       ├── CreateClubUseCaseTest.php
│   │       │       ├── UpdateClubBudgetUseCaseTest.php
│   │       │       ├── AssignPlayerToClubUseCaseTest.php
│   │       │       └── ReleasePlayerFromClubUseCaseTest.php
│   │       ├── Player/
│   │       │   └── UseCase/
│   │       │       └── CreatePlayerUseCaseTest.php
│   │       └── Coach/
│   │           └── UseCase/
│   │               └── CreateCoachUseCaseTest.php
│   │
│   ├── Integration/
│   │   └── Persistence/
│   │       ├── DoctrineClubRepositoryTest.php
│   │       ├── DoctrinePlayerRepositoryTest.php
│   │       └── DoctrineCoachRepositoryTest.php
│   │
│   └── Functional/
│       ├── Controller/
│       │   ├── ClubControllerTest.php
│       │   ├── PlayerControllerTest.php
│       │   └── CoachControllerTest.php
│       └── ApiTestCase.php
│
├── fixtures/
│   └── AppFixtures.php
│
├── docker/
│   ├── php/
│   │   └── Dockerfile
│   └── nginx/
│       └── default.conf
│
├── docker-compose.yaml
├── composer.json
├── phpunit.xml.dist
└── .env.example
```

---

## 3. Domain Layer Design

### 3.1 Entity: Club

```php
<?php
namespace App\Domain\Club\Entity;

use App\Domain\Player\Entity\Player;
use App\Domain\Coach\Entity\Coach;
use App\Domain\Shared\ValueObject\Money;
use App\Domain\Club\Exception\BudgetExceededException;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

class Club
{
    private ?int $id = null;
    private string $name;
    private Money $budget;
    private Collection $players;
    private Collection $coaches;
    private \DateTimeImmutable $createdAt;

    private function __construct(string $name, Money $budget)
    {
        $this->name = $name;
        $this->budget = $budget;
        $this->players = new ArrayCollection();
        $this->coaches = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public static function create(string $name, Money $budget): self
    {
        if (strlen($name) < 3 || strlen($name) > 100) {
            throw new \InvalidArgumentException('Club name must be 3-100 characters');
        }
        return new self($name, $budget);
    }

    // Business Logic Methods
    public function getTotalSalaries(): Money
    {
        $total = Money::zero();

        foreach ($this->players as $player) {
            if ($player->getSalary() !== null) {
                $total = $total->add($player->getSalary());
            }
        }

        foreach ($this->coaches as $coach) {
            if ($coach->getSalary() !== null) {
                $total = $total->add($coach->getSalary());
            }
        }

        return $total;
    }

    public function getAvailableBudget(): Money
    {
        return $this->budget->subtract($this->getTotalSalaries());
    }

    public function canAffordSalary(Money $salary): bool
    {
        return $this->getAvailableBudget()->isGreaterOrEqual($salary);
    }

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

    public function addPlayer(Player $player): void
    {
        if (!$this->players->contains($player)) {
            $this->players->add($player);
        }
    }

    public function removePlayer(Player $player): void
    {
        $this->players->removeElement($player);
    }

    public function addCoach(Coach $coach): void
    {
        if (!$this->coaches->contains($coach)) {
            $this->coaches->add($coach);
        }
    }

    public function removeCoach(Coach $coach): void
    {
        $this->coaches->removeElement($coach);
    }

    // Getters
    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getBudget(): Money { return $this->budget; }
    public function getPlayers(): Collection { return $this->players; }
    public function getCoaches(): Collection { return $this->coaches; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

### 3.2 Entity: Player

```php
<?php
namespace App\Domain\Player\Entity;

use App\Domain\Club\Entity\Club;
use App\Domain\Shared\ValueObject\Money;
use App\Domain\Player\Exception\PlayerAlreadyHiredException;

class Player
{
    private ?int $id = null;
    private string $name;
    private ?Club $club = null;
    private ?Money $salary = null;
    private \DateTimeImmutable $createdAt;

    private function __construct(string $name)
    {
        $this->name = $name;
        $this->createdAt = new \DateTimeImmutable();
    }

    public static function createFree(string $name): self
    {
        if (strlen($name) < 3 || strlen($name) > 100) {
            throw new \InvalidArgumentException('Player name must be 3-100 characters');
        }
        return new self($name);
    }

    // Business Logic Methods
    public function isFree(): bool
    {
        return $this->club === null;
    }

    public function isHired(): bool
    {
        return $this->club !== null;
    }

    public function assignToClub(Club $club, Money $salary): void
    {
        if (!$this->isFree()) {
            throw PlayerAlreadyHiredException::create($this->id, $this->club->getId());
        }

        $this->club = $club;
        $this->salary = $salary;
        $club->addPlayer($this);
    }

    public function releaseFromClub(): void
    {
        if ($this->club !== null) {
            $this->club->removePlayer($this);
        }
        $this->club = null;
        $this->salary = null;
    }

    // Getters
    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function getClub(): ?Club { return $this->club; }
    public function getSalary(): ?Money { return $this->salary; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

### 3.3 Entity: Coach

```php
<?php
namespace App\Domain\Coach\Entity;

use App\Domain\Club\Entity\Club;
use App\Domain\Shared\ValueObject\Money;
use App\Domain\Coach\Exception\CoachAlreadyHiredException;

class Coach
{
    private ?int $id = null;
    private string $name;
    private ?Club $club = null;
    private ?Money $salary = null;
    private \DateTimeImmutable $createdAt;

    // Structure identical to Player
    // ... (same methods as Player but with Coach-specific exceptions)
}
```

### 3.4 Value Object: Money

```php
<?php
namespace App\Domain\Shared\ValueObject;

class Money
{
    private int $amount; // Store in cents/smallest unit

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
        return new self($this->amount - $other->amount);
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

---

## 4. Application Layer Design

### 4.1 Use Case: AssignPlayerToClub

```php
<?php
namespace App\Application\Club\UseCase\AssignPlayer;

use App\Domain\Club\Repository\ClubRepositoryInterface;
use App\Domain\Player\Repository\PlayerRepositoryInterface;
use App\Domain\Shared\ValueObject\Money;
use App\Domain\Club\Exception\BudgetExceededException;
use App\Domain\Club\Exception\ClubNotFoundException;
use App\Domain\Player\Exception\PlayerNotFoundException;
use App\Application\Notification\NotificationServiceInterface;

class AssignPlayerToClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private PlayerRepositoryInterface $playerRepository,
        private NotificationServiceInterface $notificationService
    ) {}

    public function execute(AssignPlayerRequest $request): AssignPlayerResponse
    {
        // 1. Find club
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw ClubNotFoundException::withId($request->clubId);
        }

        // 2. Find player
        $player = $this->playerRepository->findById($request->playerId);
        if ($player === null) {
            throw PlayerNotFoundException::withId($request->playerId);
        }

        // 3. Create salary value object
        $salary = Money::fromInteger($request->salary);

        // 4. Validate budget (RN-1)
        if (!$club->canAffordSalary($salary)) {
            throw BudgetExceededException::cannotAfford(
                $club->getAvailableBudget(),
                $salary
            );
        }

        // 5. Assign player to club (validates RN-3 internally)
        $player->assignToClub($club, $salary);

        // 6. Persist changes
        $this->playerRepository->save($player);

        // 7. Send notification (RN-4)
        $this->notificationService->notifyPlayerAssigned($player, $club);

        // 8. Return response
        return AssignPlayerResponse::fromPlayer($player);
    }
}
```

### 4.2 Use Case: UpdateClubBudget

```php
<?php
namespace App\Application\Club\UseCase\UpdateClubBudget;

class UpdateClubBudgetUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(UpdateClubBudgetRequest $request): UpdateClubBudgetResponse
    {
        // 1. Find club
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw ClubNotFoundException::withId($request->clubId);
        }

        // 2. Create new budget value object
        $newBudget = Money::fromInteger($request->budget);

        // 3. Update budget (validates RN-2 internally)
        $club->updateBudget($newBudget);

        // 4. Persist changes
        $this->clubRepository->save($club);

        // 5. Return response
        return UpdateClubBudgetResponse::fromClub($club);
    }
}
```

---

## 5. Infrastructure Layer Design

### 5.1 Controller: ClubController

```php
<?php
namespace App\Infrastructure\Http\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ClubController
{
    #[Route('/clubs', methods: ['POST'])]
    public function createClub(
        Request $request,
        CreateClubUseCase $useCase
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $dto = new CreateClubRequest(
            name: $data['name'] ?? '',
            budget: $data['budget'] ?? 0
        );

        $response = $useCase->execute($dto);

        return new JsonResponse($response->toArray(), Response::HTTP_CREATED);
    }

    #[Route('/clubs/{clubId}/players/{playerId}', methods: ['POST'])]
    public function assignPlayer(
        int $clubId,
        int $playerId,
        Request $request,
        AssignPlayerToClubUseCase $useCase
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $dto = new AssignPlayerRequest(
            clubId: $clubId,
            playerId: $playerId,
            salary: $data['salary'] ?? 0
        );

        $response = $useCase->execute($dto);

        return new JsonResponse($response->toArray(), Response::HTTP_OK);
    }

    #[Route('/clubs/{clubId}/budget', methods: ['PATCH'])]
    public function updateBudget(
        int $clubId,
        Request $request,
        UpdateClubBudgetUseCase $useCase
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $dto = new UpdateClubBudgetRequest(
            clubId: $clubId,
            budget: $data['budget'] ?? 0
        );

        $response = $useCase->execute($dto);

        return new JsonResponse($response->toArray(), Response::HTTP_OK);
    }

    // ... more endpoints
}
```

### 5.2 Notification System

```php
<?php
namespace App\Infrastructure\Notification\Channel;

interface NotificationChannelInterface
{
    public function send(NotificationMessage $message): void;
    public function supports(string $type): bool;
}
```

```php
<?php
namespace App\Infrastructure\Notification\Channel;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailNotificationChannel implements NotificationChannelInterface
{
    public function __construct(
        private MailerInterface $mailer,
        private string $fromEmail
    ) {}

    public function send(NotificationMessage $message): void
    {
        $email = (new Email())
            ->from($this->fromEmail)
            ->to($message->getRecipient())
            ->subject($message->getSubject())
            ->html($message->getBody());

        $this->mailer->send($email);
    }

    public function supports(string $type): bool
    {
        return $type === 'email';
    }
}
```

---

## 6. Frontend Architecture

### 6.1 Directory Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # Root component with routing
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx               # Main layout with nav
│   │   │   ├── Navbar.tsx               # Top navigation
│   │   │   └── Sidebar.tsx              # Side navigation
│   │   │
│   │   ├── ui/                          # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Skeleton.tsx
│   │   │
│   │   ├── clubs/
│   │   │   ├── ClubCard.tsx
│   │   │   ├── ClubForm.tsx
│   │   │   ├── ClubTable.tsx
│   │   │   ├── ClubDetail.tsx
│   │   │   ├── EditBudgetModal.tsx
│   │   │   └── ClubStats.tsx
│   │   │
│   │   ├── players/
│   │   │   ├── PlayerTable.tsx
│   │   │   ├── PlayerForm.tsx
│   │   │   ├── PlayerDetail.tsx
│   │   │   └── AssignPlayerModal.tsx
│   │   │
│   │   └── coaches/
│   │       ├── CoachTable.tsx
│   │       ├── CoachForm.tsx
│   │       ├── CoachDetail.tsx
│   │       └── AssignCoachModal.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── clubs/
│   │   │   ├── ClubsPage.tsx
│   │   │   ├── CreateClubPage.tsx
│   │   │   └── ClubDetailPage.tsx
│   │   ├── players/
│   │   │   ├── PlayersPage.tsx
│   │   │   ├── CreatePlayerPage.tsx
│   │   │   └── PlayerDetailPage.tsx
│   │   └── coaches/
│   │       ├── CoachesPage.tsx
│   │       ├── CreateCoachPage.tsx
│   │       └── CoachDetailPage.tsx
│   │
│   ├── services/
│   │   ├── api.ts                       # Axios instance
│   │   ├── clubs.service.ts
│   │   ├── players.service.ts
│   │   └── coaches.service.ts
│   │
│   ├── hooks/
│   │   ├── useClubs.ts                  # React Query hooks
│   │   ├── usePlayers.ts
│   │   ├── useCoaches.ts
│   │   └── useToast.ts
│   │
│   ├── types/
│   │   ├── club.ts
│   │   ├── player.ts
│   │   ├── coach.ts
│   │   └── api.ts
│   │
│   ├── schemas/
│   │   ├── club.schema.ts               # Zod validation schemas
│   │   ├── player.schema.ts
│   │   └── coach.schema.ts
│   │
│   └── utils/
│       ├── formatters.ts                # Currency, date formatting
│       └── constants.ts
│
├── tests/
│   ├── components/
│   │   ├── ui/
│   │   └── clubs/
│   └── setup.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

### 6.2 State Management (React Query)

```typescript
// hooks/useClubs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubsService } from '@/services/clubs.service';

export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: clubsService.getAll,
  });
};

export const useClub = (id: number) => {
  return useQuery({
    queryKey: ['clubs', id],
    queryFn: () => clubsService.getById(id),
  });
};

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
};

export const useAssignPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubsService.assignPlayer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};
```

### 6.3 API Service Pattern

```typescript
// services/clubs.service.ts
import api from './api';
import { Club, CreateClubDTO, AssignPlayerDTO } from '@/types/club';

export const clubsService = {
  getAll: async (): Promise<Club[]> => {
    const { data } = await api.get('/clubs');
    return data;
  },

  getById: async (id: number): Promise<Club> => {
    const { data } = await api.get(`/clubs/${id}`);
    return data;
  },

  create: async (dto: CreateClubDTO): Promise<Club> => {
    const { data } = await api.post('/clubs', dto);
    return data;
  },

  updateBudget: async (clubId: number, budget: number): Promise<Club> => {
    const { data } = await api.patch(`/clubs/${clubId}/budget`, { budget });
    return data;
  },

  assignPlayer: async ({ clubId, playerId, salary }: AssignPlayerDTO) => {
    const { data } = await api.post(
      `/clubs/${clubId}/players/${playerId}`,
      { salary }
    );
    return data;
  },

  releasePlayer: async (clubId: number, playerId: number) => {
    const { data } = await api.delete(`/clubs/${clubId}/players/${playerId}`);
    return data;
  },
};
```

---

## 7. Integration Points

### 7.1 API Contract

| Frontend Action | API Endpoint | HTTP Method |
|-----------------|--------------|-------------|
| List clubs | /api/clubs | GET |
| Create club | /api/clubs | POST |
| Get club details | /api/clubs/:id | GET |
| Update budget | /api/clubs/:id/budget | PATCH |
| Assign player | /api/clubs/:clubId/players/:playerId | POST |
| Release player | /api/clubs/:clubId/players/:playerId | DELETE |
| Assign coach | /api/clubs/:clubId/coaches/:coachId | POST |
| Release coach | /api/clubs/:clubId/coaches/:coachId | DELETE |
| List club players | /api/clubs/:id/players | GET |
| List all players | /api/players | GET |
| Create player | /api/players | POST |
| Get player | /api/players/:id | GET |
| List all coaches | /api/coaches | GET |
| Create coach | /api/coaches | POST |
| Get coach | /api/coaches/:id | GET |

### 7.2 CORS Configuration

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['%env(CORS_ALLOW_ORIGIN)%']
        allow_methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
        allow_headers: ['Content-Type', 'Accept']
        max_age: 3600
    paths:
        '^/api/':
            allow_origin: ['*']
            allow_headers: ['*']
            allow_methods: ['GET', 'POST', 'PATCH', 'DELETE']
```

---

## 8. Error Handling Strategy

### 8.1 Backend Exception Mapping

| Exception | HTTP Status | Error Response |
|-----------|-------------|----------------|
| ValidationException | 400 | `{"error": "Validation failed", "details": [...]}` |
| ClubNotFoundException | 404 | `{"error": "Club not found"}` |
| PlayerNotFoundException | 404 | `{"error": "Player not found"}` |
| CoachNotFoundException | 404 | `{"error": "Coach not found"}` |
| PlayerAlreadyHiredException | 409 | `{"error": "Player is already associated with another club"}` |
| CoachAlreadyHiredException | 409 | `{"error": "Coach is already associated with another club"}` |
| BudgetExceededException | 422 | `{"error": "Budget exceeded. Available: X, Required: Y"}` |

### 8.2 Frontend Error Handling

```typescript
// Axios interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error('Invalid data provided');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 409:
          toast.error(data.error || 'Conflict error');
          break;
        case 422:
          toast.error(data.error || 'Business rule violation');
          break;
        default:
          toast.error('An unexpected error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);
```

---

## 9. Testing Strategy

### 9.1 Backend Testing Pyramid

```
                    ┌─────────────────┐
                    │   Functional    │  ~10%
                    │   (E2E API)     │
                    ├─────────────────┤
                    │   Integration   │  ~20%
                    │  (Repository)   │
       ┌────────────┴─────────────────┴────────────┐
       │              Unit Tests                   │  ~70%
       │  (Entities, VOs, Use Cases)               │
       └───────────────────────────────────────────┘
```

### 9.2 Frontend Testing Strategy

```
       ┌─────────────────────────────────────────┐
       │         Integration Tests               │  ~30%
       │    (Pages, User Flows)                  │
       ├─────────────────────────────────────────┤
       │         Component Tests                 │  ~70%
       │  (UI Components, Forms, Modals)         │
       └─────────────────────────────────────────┘
```

---

**Document Status**: COMPLETE
**Ready for**: Data Model Design (15_data_model.md)
