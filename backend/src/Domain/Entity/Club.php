<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Exception\BudgetExceededException;
use App\Domain\Exception\PlayerAlreadyHasClubException;
use App\Domain\Exception\CoachAlreadyHasClubException;
use App\Domain\Exception\PlayerNotInClubException;
use App\Domain\Exception\CoachNotInClubException;
use App\Domain\ValueObject\Money;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class Club
{
    private ?int $id = null;
    private string $name;
    private Money $budget;
    /** @var Collection<int, Player> */
    private Collection $players;
    /** @var Collection<int, Coach> */
    private Collection $coaches;

    private function __construct(string $name, Money $budget)
    {
        $this->name = $name;
        $this->budget = $budget;
        $this->players = new ArrayCollection();
        $this->coaches = new ArrayCollection();
    }

    public static function create(string $name, Money $budget): self
    {
        if (empty(trim($name))) {
            throw new \InvalidArgumentException('Club name cannot be empty');
        }
        if ($budget->amount() <= 0) {
            throw new \InvalidArgumentException('Club budget must be greater than 0');
        }
        return new self(trim($name), $budget);
    }

    public function id(): ?int
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function budget(): Money
    {
        return $this->budget;
    }

    /** @return Collection<int, Player> */
    public function players(): Collection
    {
        return $this->players;
    }

    /** @return Collection<int, Coach> */
    public function coaches(): Collection
    {
        return $this->coaches;
    }

    public function totalSalaries(): Money
    {
        $total = Money::zero();

        foreach ($this->players as $player) {
            if ($player->salary() !== null) {
                $total = $total->add($player->salary());
            }
        }

        foreach ($this->coaches as $coach) {
            if ($coach->salary() !== null) {
                $total = $total->add($coach->salary());
            }
        }

        return $total;
    }

    public function availableBudget(): Money
    {
        return $this->budget->subtract($this->totalSalaries());
    }

    public function assignPlayer(Player $player, Money $salary): void
    {
        if ($player->isAssociatedToClub()) {
            throw new PlayerAlreadyHasClubException($player->id() ?? 0);
        }

        $this->validateBudgetForNewSalary($salary);

        $player->assignToClub($this, $salary);
        $this->players->add($player);
    }

    public function assignCoach(Coach $coach, Money $salary): void
    {
        if ($coach->isAssociatedToClub()) {
            throw new CoachAlreadyHasClubException($coach->id() ?? 0);
        }

        $this->validateBudgetForNewSalary($salary);

        $coach->assignToClub($this, $salary);
        $this->coaches->add($coach);
    }

    public function releasePlayer(Player $player): void
    {
        if ($player->club() !== $this) {
            throw new PlayerNotInClubException($player->id() ?? 0, $this->id ?? 0);
        }

        $player->releaseFromClub();
        $this->players->removeElement($player);
    }

    public function releaseCoach(Coach $coach): void
    {
        if ($coach->club() !== $this) {
            throw new CoachNotInClubException($coach->id() ?? 0, $this->id ?? 0);
        }

        $coach->releaseFromClub();
        $this->coaches->removeElement($coach);
    }

    public function updateBudget(Money $newBudget): void
    {
        $totalSalaries = $this->totalSalaries();

        if ($newBudget->isLessThan($totalSalaries)) {
            throw new BudgetExceededException(
                $newBudget->amount(),
                $totalSalaries->amount()
            );
        }

        $this->budget = $newBudget;
    }

    private function validateBudgetForNewSalary(Money $salary): void
    {
        $newTotalSalaries = $this->totalSalaries()->add($salary);

        if ($newTotalSalaries->isGreaterThan($this->budget)) {
            throw new BudgetExceededException(
                $this->availableBudget()->amount(),
                $salary->amount()
            );
        }
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }
}
