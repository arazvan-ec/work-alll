<?php

declare(strict_types=1);

namespace App\Tests\Unit\Domain\Entity;

use App\Domain\Entity\Club;
use App\Domain\Entity\Player;
use App\Domain\ValueObject\Money;
use PHPUnit\Framework\TestCase;

class PlayerTest extends TestCase
{
    public function testCanCreatePlayer(): void
    {
        $player = Player::create('Lionel Messi');

        $this->assertEquals('Lionel Messi', $player->name());
        $this->assertNull($player->club());
        $this->assertNull($player->salary());
        $this->assertTrue($player->isFree());
        $this->assertFalse($player->isAssociatedToClub());
    }

    public function testCannotCreatePlayerWithEmptyName(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Player::create('');
    }

    public function testCannotCreatePlayerWithWhitespaceName(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        Player::create('   ');
    }

    public function testTrimsPlayerName(): void
    {
        $player = Player::create('  Lionel Messi  ');
        $this->assertEquals('Lionel Messi', $player->name());
    }

    public function testCanAssignPlayerToClub(): void
    {
        $player = Player::create('Lionel Messi');
        $club = Club::create('FC Barcelona', new Money(5000000));
        $salary = new Money(1500000);

        $player->assignToClub($club, $salary);

        $this->assertSame($club, $player->club());
        $this->assertEquals(1500000, $player->salary()->amount());
        $this->assertFalse($player->isFree());
        $this->assertTrue($player->isAssociatedToClub());
    }

    public function testCanReleasePlayerFromClub(): void
    {
        $player = Player::create('Lionel Messi');
        $club = Club::create('FC Barcelona', new Money(5000000));
        $player->assignToClub($club, new Money(1500000));

        $player->releaseFromClub();

        $this->assertNull($player->club());
        $this->assertNull($player->salary());
        $this->assertTrue($player->isFree());
    }
}
