<?php

declare(strict_types=1);

namespace App\Tests\Unit\Domain\Entity;

use App\Domain\Entity\Club;
use App\Domain\Entity\Coach;
use App\Domain\Entity\Player;
use App\Domain\Exception\BudgetExceededException;
use App\Domain\Exception\BudgetTooLowException;
use App\Domain\Exception\PlayerAlreadyHasClubException;
use App\Domain\Exception\CoachAlreadyHasClubException;
use App\Domain\Exception\PlayerNotInClubException;
use App\Domain\Exception\CoachNotInClubException;
use App\Domain\ValueObject\Money;
use PHPUnit\Framework\TestCase;

class ClubTest extends TestCase
{
    public function testCanCreateClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));

        $this->assertEquals('FC Barcelona', $club->name());
        $this->assertEquals(5000000, $club->budget()->amount());
        $this->assertEquals(0, $club->totalSalaries()->amount());
        $this->assertEquals(5000000, $club->availableBudget()->amount());
    }

    public function testCannotCreateClubWithEmptyName(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Club::create('', new Money(5000000));
    }

    public function testCannotCreateClubWithZeroBudget(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Club::create('FC Barcelona', new Money(0));
    }

    public function testCanAssignPlayerToClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player = Player::create('Lionel Messi');

        $club->assignPlayer($player, new Money(1500000));

        $this->assertTrue($player->isAssociatedToClub());
        $this->assertSame($club, $player->club());
        $this->assertEquals(1500000, $club->totalSalaries()->amount());
        $this->assertEquals(3500000, $club->availableBudget()->amount());
    }

    public function testCannotAssignPlayerThatAlreadyHasClub(): void
    {
        $club1 = Club::create('FC Barcelona', new Money(5000000));
        $club2 = Club::create('Real Madrid', new Money(5000000));
        $player = Player::create('Lionel Messi');

        $club1->assignPlayer($player, new Money(1000000));

        $this->expectException(PlayerAlreadyHasClubException::class);
        $club2->assignPlayer($player, new Money(1500000));
    }

    public function testCannotAssignPlayerWhenBudgetExceeded(): void
    {
        $club = Club::create('FC Barcelona', new Money(1000000));
        $player = Player::create('Lionel Messi');

        $this->expectException(BudgetExceededException::class);
        $club->assignPlayer($player, new Money(1500000));
    }

    public function testCanAssignCoachToClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $coach = Coach::create('Pep Guardiola');

        $club->assignCoach($coach, new Money(500000));

        $this->assertTrue($coach->isAssociatedToClub());
        $this->assertSame($club, $coach->club());
        $this->assertEquals(500000, $club->totalSalaries()->amount());
    }

    public function testCannotAssignCoachThatAlreadyHasClub(): void
    {
        $club1 = Club::create('FC Barcelona', new Money(5000000));
        $club2 = Club::create('Real Madrid', new Money(5000000));
        $coach = Coach::create('Pep Guardiola');

        $club1->assignCoach($coach, new Money(500000));

        $this->expectException(CoachAlreadyHasClubException::class);
        $club2->assignCoach($coach, new Money(600000));
    }

    public function testCanReleasePlayerFromClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player = Player::create('Lionel Messi');
        $club->assignPlayer($player, new Money(1500000));

        $club->releasePlayer($player);

        $this->assertTrue($player->isFree());
        $this->assertNull($player->club());
        $this->assertEquals(0, $club->totalSalaries()->amount());
    }

    public function testCannotReleasePlayerNotInClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player = Player::create('Lionel Messi');

        $this->expectException(PlayerNotInClubException::class);
        $club->releasePlayer($player);
    }

    public function testCanReleaseCoachFromClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $coach = Coach::create('Pep Guardiola');
        $club->assignCoach($coach, new Money(500000));

        $club->releaseCoach($coach);

        $this->assertTrue($coach->isFree());
        $this->assertNull($coach->club());
        $this->assertEquals(0, $club->totalSalaries()->amount());
    }

    public function testCannotReleaseCoachNotInClub(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $coach = Coach::create('Pep Guardiola');

        $this->expectException(CoachNotInClubException::class);
        $club->releaseCoach($coach);
    }

    public function testCanUpdateBudget(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));

        $club->updateBudget(new Money(6000000));

        $this->assertEquals(6000000, $club->budget()->amount());
    }

    public function testCannotReduceBudgetBelowTotalSalaries(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player = Player::create('Lionel Messi');
        $club->assignPlayer($player, new Money(1500000));

        $this->expectException(BudgetTooLowException::class);
        $this->expectExceptionMessage('Budget cannot be lower than current salaries. Current: 1500000');
        $club->updateBudget(new Money(1000000));
    }

    public function testTotalSalariesIncludesPlayersAndCoaches(): void
    {
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player = Player::create('Lionel Messi');
        $coach = Coach::create('Pep Guardiola');

        $club->assignPlayer($player, new Money(1500000));
        $club->assignCoach($coach, new Money(500000));

        $this->assertEquals(2000000, $club->totalSalaries()->amount());
        $this->assertEquals(3000000, $club->availableBudget()->amount());
    }
}
