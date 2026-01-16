# Data Model - Sportian Club Management

**Feature ID**: sportian-club-management
**Document Version**: 1.0
**Created**: 2026-01-16
**Author**: Planner

---

## 1. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    ┌──────────────┐         1:N         ┌──────────────┐       │
│    │    CLUB      │◄────────────────────│   PLAYER     │       │
│    │──────────────│                     │──────────────│       │
│    │ id (PK)      │                     │ id (PK)      │       │
│    │ name         │                     │ name         │       │
│    │ budget       │                     │ club_id (FK) │       │
│    │ created_at   │                     │ salary       │       │
│    └──────┬───────┘                     │ created_at   │       │
│           │                             └──────────────┘       │
│           │                                                     │
│           │           1:N              ┌──────────────┐         │
│           └────────────────────────────│   COACH      │         │
│                                        │──────────────│         │
│                                        │ id (PK)      │         │
│                                        │ name         │         │
│                                        │ club_id (FK) │         │
│                                        │ salary       │         │
│                                        │ created_at   │         │
│                                        └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Definitions

### 2.1 Table: `clubs`

**Purpose**: Stores club information including budget for player/coach salaries.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | NO | - | Club name (3-100 chars) |
| budget | BIGINT UNSIGNED | NO | - | Budget in cents (for precision) |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | YES | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX `idx_clubs_name` (`name`) - For name searches

**Constraints**:
- `budget` must be >= 0

**SQL Definition**:
```sql
CREATE TABLE clubs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    budget BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_clubs_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.2 Table: `players`

**Purpose**: Stores player information with optional club association and salary.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | NO | - | Player name (3-100 chars) |
| club_id | INT UNSIGNED | YES | NULL | FK to clubs (NULL = free agent) |
| salary | BIGINT UNSIGNED | YES | NULL | Salary in cents (NULL if free) |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | YES | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX `idx_players_club_id` (`club_id`) - For club-player lookups
- INDEX `idx_players_name` (`name`) - For name searches
- INDEX `idx_players_club_name` (`club_id`, `name`) - For filtered queries

**Foreign Keys**:
- `fk_players_club` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE SET NULL

**Constraints**:
- If `club_id` IS NOT NULL, then `salary` should NOT be NULL (enforced at application level)
- If `club_id` IS NULL, then `salary` should be NULL (enforced at application level)

**SQL Definition**:
```sql
CREATE TABLE players (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    club_id INT UNSIGNED DEFAULT NULL,
    salary BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_players_club_id (club_id),
    INDEX idx_players_name (name),
    INDEX idx_players_club_name (club_id, name),
    CONSTRAINT fk_players_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.3 Table: `coaches`

**Purpose**: Stores coach information with optional club association and salary.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | NO | - | Coach name (3-100 chars) |
| club_id | INT UNSIGNED | YES | NULL | FK to clubs (NULL = free agent) |
| salary | BIGINT UNSIGNED | YES | NULL | Salary in cents (NULL if free) |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | YES | NULL | Last update timestamp |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX `idx_coaches_club_id` (`club_id`) - For club-coach lookups
- INDEX `idx_coaches_name` (`name`) - For name searches

**Foreign Keys**:
- `fk_coaches_club` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE SET NULL

**SQL Definition**:
```sql
CREATE TABLE coaches (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    club_id INT UNSIGNED DEFAULT NULL,
    salary BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_coaches_club_id (club_id),
    INDEX idx_coaches_name (name),
    CONSTRAINT fk_coaches_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Doctrine ORM Mappings

### 3.1 Club Entity Mapping

**File**: `src/Infrastructure/Persistence/Doctrine/Mapping/Club.orm.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<doctrine-mapping xmlns="http://doctrine-project.org/schemas/orm/doctrine-mapping"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://doctrine-project.org/schemas/orm/doctrine-mapping
                                      https://www.doctrine-project.org/schemas/orm/doctrine-mapping.xsd">

    <entity name="App\Domain\Club\Entity\Club" table="clubs">
        <id name="id" type="integer" column="id">
            <generator strategy="IDENTITY"/>
        </id>

        <field name="name" type="string" length="100" nullable="false"/>

        <embedded name="budget" class="App\Domain\Shared\ValueObject\Money" use-column-prefix="false">
            <field name="amount" type="bigint" column="budget"/>
        </embedded>

        <field name="createdAt" type="datetime_immutable" column="created_at" nullable="false"/>

        <one-to-many field="players" target-entity="App\Domain\Player\Entity\Player" mapped-by="club">
            <cascade>
                <cascade-persist/>
            </cascade>
        </one-to-many>

        <one-to-many field="coaches" target-entity="App\Domain\Coach\Entity\Coach" mapped-by="club">
            <cascade>
                <cascade-persist/>
            </cascade>
        </one-to-many>
    </entity>

</doctrine-mapping>
```

### 3.2 Player Entity Mapping

**File**: `src/Infrastructure/Persistence/Doctrine/Mapping/Player.orm.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<doctrine-mapping xmlns="http://doctrine-project.org/schemas/orm/doctrine-mapping"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://doctrine-project.org/schemas/orm/doctrine-mapping
                                      https://www.doctrine-project.org/schemas/orm/doctrine-mapping.xsd">

    <entity name="App\Domain\Player\Entity\Player" table="players">
        <id name="id" type="integer" column="id">
            <generator strategy="IDENTITY"/>
        </id>

        <field name="name" type="string" length="100" nullable="false"/>

        <many-to-one field="club" target-entity="App\Domain\Club\Entity\Club" inversed-by="players">
            <join-column name="club_id" referenced-column-name="id" nullable="true" on-delete="SET NULL"/>
        </many-to-one>

        <embedded name="salary" class="App\Domain\Shared\ValueObject\Money" use-column-prefix="false">
            <field name="amount" type="bigint" column="salary" nullable="true"/>
        </embedded>

        <field name="createdAt" type="datetime_immutable" column="created_at" nullable="false"/>
    </entity>

</doctrine-mapping>
```

### 3.3 Coach Entity Mapping

**File**: `src/Infrastructure/Persistence/Doctrine/Mapping/Coach.orm.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<doctrine-mapping xmlns="http://doctrine-project.org/schemas/orm/doctrine-mapping"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:schemaLocation="http://doctrine-project.org/schemas/orm/doctrine-mapping
                                      https://www.doctrine-project.org/schemas/orm/doctrine-mapping.xsd">

    <entity name="App\Domain\Coach\Entity\Coach" table="coaches">
        <id name="id" type="integer" column="id">
            <generator strategy="IDENTITY"/>
        </id>

        <field name="name" type="string" length="100" nullable="false"/>

        <many-to-one field="club" target-entity="App\Domain\Club\Entity\Club" inversed-by="coaches">
            <join-column name="club_id" referenced-column-name="id" nullable="true" on-delete="SET NULL"/>
        </many-to-one>

        <embedded name="salary" class="App\Domain\Shared\ValueObject\Money" use-column-prefix="false">
            <field name="amount" type="bigint" column="salary" nullable="true"/>
        </embedded>

        <field name="createdAt" type="datetime_immutable" column="created_at" nullable="false"/>
    </entity>

</doctrine-mapping>
```

---

## 4. Data Constraints and Validation

### 4.1 Database Level Constraints

| Table | Constraint Type | Columns | Description |
|-------|-----------------|---------|-------------|
| clubs | NOT NULL | name, budget | Required fields |
| clubs | CHECK | budget >= 0 | Budget cannot be negative |
| players | NOT NULL | name | Required field |
| players | FOREIGN KEY | club_id | References clubs(id) |
| coaches | NOT NULL | name | Required field |
| coaches | FOREIGN KEY | club_id | References coaches(id) |

### 4.2 Application Level Constraints

| Entity | Constraint | Description |
|--------|------------|-------------|
| Club | name length | 3-100 characters |
| Club | budget | Must be positive integer |
| Player | name length | 3-100 characters |
| Player | salary consistency | If has club, must have salary |
| Coach | name length | 3-100 characters |
| Coach | salary consistency | If has club, must have salary |

---

## 5. Money Value Object Storage

### 5.1 Storage Strategy

**Decision**: Store money as **BIGINT in cents** (smallest currency unit)

**Rationale**:
- Avoids floating point precision issues
- Simple integer arithmetic
- Standard practice for financial data

**Examples**:
- €1,000,000 → stored as `100000000` (100 million cents)
- €50,000.50 → stored as `5000050`

### 5.2 Conversion Functions

```php
// Money Value Object
class Money
{
    private int $amount; // In cents

    public static function fromEuros(float $euros): self
    {
        return new self((int) round($euros * 100));
    }

    public function toEuros(): float
    {
        return $this->amount / 100;
    }

    public function getAmount(): int
    {
        return $this->amount;
    }
}
```

---

## 6. Query Patterns

### 6.1 Get Club with Total Salaries

```sql
SELECT
    c.id,
    c.name,
    c.budget,
    COALESCE(SUM(p.salary), 0) + COALESCE(SUM(co.salary), 0) as total_salaries
FROM clubs c
LEFT JOIN players p ON p.club_id = c.id
LEFT JOIN coaches co ON co.club_id = c.id
WHERE c.id = :clubId
GROUP BY c.id, c.name, c.budget;
```

### 6.2 List Club Players with Filtering and Pagination

```sql
SELECT p.id, p.name, p.salary, c.id as club_id, c.name as club_name
FROM players p
INNER JOIN clubs c ON p.club_id = c.id
WHERE p.club_id = :clubId
  AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
ORDER BY p.name ASC
LIMIT :limit OFFSET :offset;
```

### 6.3 Count for Pagination

```sql
SELECT COUNT(*) as total
FROM players p
WHERE p.club_id = :clubId
  AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'));
```

### 6.4 List Free Players

```sql
SELECT p.id, p.name
FROM players p
WHERE p.club_id IS NULL
ORDER BY p.name ASC;
```

### 6.5 List Free Coaches

```sql
SELECT c.id, c.name
FROM coaches c
WHERE c.club_id IS NULL
ORDER BY c.name ASC;
```

---

## 7. Fixtures Data

### 7.1 Clubs Fixture Data

```sql
INSERT INTO clubs (name, budget) VALUES
('FC Barcelona', 500000000),      -- €5,000,000
('Real Madrid', 600000000),       -- €6,000,000
('Manchester United', 450000000); -- €4,500,000
```

### 7.2 Players Fixture Data

```sql
-- Players with clubs
INSERT INTO players (name, club_id, salary) VALUES
-- FC Barcelona players (club_id = 1)
('Lionel Messi', 1, 150000000),      -- €1,500,000
('Pedri', 1, 50000000),              -- €500,000
('Gavi', 1, 40000000),               -- €400,000

-- Real Madrid players (club_id = 2)
('Cristiano Ronaldo', 2, 180000000), -- €1,800,000
('Vinicius Jr', 2, 80000000),        -- €800,000
('Jude Bellingham', 2, 100000000),   -- €1,000,000

-- Manchester United players (club_id = 3)
('Wayne Rooney', 3, 120000000),      -- €1,200,000
('Marcus Rashford', 3, 70000000),    -- €700,000
('Bruno Fernandes', 3, 60000000);    -- €600,000

-- Free players
INSERT INTO players (name, club_id, salary) VALUES
('Neymar Jr', NULL, NULL),
('Kylian Mbappé', NULL, NULL),
('Erling Haaland', NULL, NULL),
('Robert Lewandowski', NULL, NULL),
('Mohamed Salah', NULL, NULL),
('Kevin De Bruyne', NULL, NULL);
```

### 7.3 Coaches Fixture Data

```sql
-- Coaches with clubs
INSERT INTO coaches (name, club_id, salary) VALUES
('Pep Guardiola', 1, 50000000),   -- €500,000 - FC Barcelona
('Carlo Ancelotti', 2, 60000000), -- €600,000 - Real Madrid
('Erik ten Hag', 3, 45000000);    -- €450,000 - Manchester United

-- Free coaches
INSERT INTO coaches (name, club_id, salary) VALUES
('Zinedine Zidane', NULL, NULL),
('José Mourinho', NULL, NULL);
```

---

## 8. Budget Summary by Club (Fixture Data)

| Club | Budget | Player Salaries | Coach Salaries | Total Salaries | Available |
|------|--------|-----------------|----------------|----------------|-----------|
| FC Barcelona | €5,000,000 | €1,940,000 | €500,000 | €2,440,000 | €2,560,000 |
| Real Madrid | €6,000,000 | €2,880,000 | €600,000 | €3,480,000 | €2,520,000 |
| Manchester United | €4,500,000 | €1,830,000 | €450,000 | €2,280,000 | €2,220,000 |

---

## 9. Migration Strategy

### 9.1 Doctrine Migration Commands

```bash
# Generate migration from entity changes
php bin/console doctrine:migrations:diff

# Run migrations
php bin/console doctrine:migrations:migrate

# Load fixtures
php bin/console doctrine:fixtures:load
```

### 9.2 Initial Migration

```php
<?php
// migrations/Version20260116000000.php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260116000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial tables for Sportian';
    }

    public function up(Schema $schema): void
    {
        // Clubs table
        $this->addSql('
            CREATE TABLE clubs (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                budget BIGINT UNSIGNED NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id),
                INDEX idx_clubs_name (name)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');

        // Players table
        $this->addSql('
            CREATE TABLE players (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                club_id INT UNSIGNED DEFAULT NULL,
                salary BIGINT UNSIGNED DEFAULT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id),
                INDEX idx_players_club_id (club_id),
                INDEX idx_players_name (name),
                CONSTRAINT fk_players_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');

        // Coaches table
        $this->addSql('
            CREATE TABLE coaches (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                club_id INT UNSIGNED DEFAULT NULL,
                salary BIGINT UNSIGNED DEFAULT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id),
                INDEX idx_coaches_club_id (club_id),
                INDEX idx_coaches_name (name),
                CONSTRAINT fk_coaches_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE coaches');
        $this->addSql('DROP TABLE players');
        $this->addSql('DROP TABLE clubs');
    }
}
```

---

**Document Status**: COMPLETE
**Ready for**: API Contracts (20_api_contracts.md)
