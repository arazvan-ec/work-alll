<?php

declare(strict_types=1);

namespace App\Tests\Unit\Domain\ValueObject;

use App\Domain\Exception\InvalidMoneyException;
use App\Domain\ValueObject\Money;
use PHPUnit\Framework\TestCase;

class MoneyTest extends TestCase
{
    public function testCanCreateMoneyWithValidAmount(): void
    {
        $money = new Money(1000);
        $this->assertEquals(1000, $money->amount());
    }

    public function testCanCreateZeroMoney(): void
    {
        $money = Money::zero();
        $this->assertEquals(0, $money->amount());
    }

    public function testCannotCreateNegativeMoney(): void
    {
        $this->expectException(InvalidMoneyException::class);
        new Money(-100);
    }

    public function testCanAddMoney(): void
    {
        $money1 = new Money(500);
        $money2 = new Money(300);
        $result = $money1->add($money2);

        $this->assertEquals(800, $result->amount());
    }

    public function testCanSubtractMoney(): void
    {
        $money1 = new Money(500);
        $money2 = new Money(300);
        $result = $money1->subtract($money2);

        $this->assertEquals(200, $result->amount());
    }

    public function testCannotSubtractToNegative(): void
    {
        $money1 = new Money(100);
        $money2 = new Money(300);

        $this->expectException(InvalidMoneyException::class);
        $money1->subtract($money2);
    }

    public function testIsGreaterThan(): void
    {
        $money1 = new Money(500);
        $money2 = new Money(300);

        $this->assertTrue($money1->isGreaterThan($money2));
        $this->assertFalse($money2->isGreaterThan($money1));
    }

    public function testIsLessThan(): void
    {
        $money1 = new Money(300);
        $money2 = new Money(500);

        $this->assertTrue($money1->isLessThan($money2));
        $this->assertFalse($money2->isLessThan($money1));
    }

    public function testEquals(): void
    {
        $money1 = new Money(500);
        $money2 = new Money(500);
        $money3 = new Money(300);

        $this->assertTrue($money1->equals($money2));
        $this->assertFalse($money1->equals($money3));
    }

    public function testToString(): void
    {
        $money = new Money(1000);
        $this->assertEquals('1000', (string)$money);
    }
}
