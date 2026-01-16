<?php

declare(strict_types=1);

namespace App\Tests\Unit\Domain\Entity;

use App\Domain\Entity\Club;
use App\Domain\Entity\Coach;
use App\Domain\ValueObject\Money;
use PHPUnit\Framework\TestCase;

class CoachTest extends TestCase
{
    public function testCanCreateCoach(): void
    {
        $coach = Coach::create('Pep Guardiola');

        $this->assertEquals('Pep Guardiola', $coach->name());
        $this->assertNull($coach->club());
        $this->assertNull($coach->salary());
        $this->assertTrue($coach->isFree());
        $this->assertFalse($coach->isAssociatedToClub());
    }

    public function testCannotCreateCoachWithEmptyName(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Coach::create('');
    }

    public function testCanAssignCoachToClub(): void
    {
        $coach = Coach::create('Pep Guardiola');
        $club = Club::create('FC Barcelona', new Money(5000000));
        $salary = new Money(500000);

        $coach->assignToClub($club, $salary);

        $this->assertSame($club, $coach->club());
        $this->assertEquals(500000, $coach->salary()->amount());
        $this->assertFalse($coach->isFree());
    }

    public function testCanReleaseCoachFromClub(): void
    {
        $coach = Coach::create('Pep Guardiola');
        $club = Club::create('FC Barcelona', new Money(5000000));
        $coach->assignToClub($club, new Money(500000));

        $coach->releaseFromClub();

        $this->assertNull($coach->club());
        $this->assertNull($coach->salary());
        $this->assertTrue($coach->isFree());
    }
}
