<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\ValueObject\Money;

class Coach
{
    private ?int $id = null;
    private string $name;
    private ?Club $club = null;
    private ?Money $salary = null;

    private function __construct(string $name)
    {
        $this->name = $name;
    }

    public static function create(string $name): self
    {
        if (empty(trim($name))) {
            throw new \InvalidArgumentException('Coach name cannot be empty');
        }
        return new self(trim($name));
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function club(): ?Club
    {
        return $this->club;
    }

    public function salary(): ?Money
    {
        return $this->salary;
    }

    public function isAssociatedToClub(): bool
    {
        return $this->club !== null;
    }

    public function isFree(): bool
    {
        return $this->club === null;
    }

    public function assignToClub(Club $club, Money $salary): void
    {
        $this->club = $club;
        $this->salary = $salary;
    }

    public function releaseFromClub(): void
    {
        $this->club = null;
        $this->salary = null;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }
}
