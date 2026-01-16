<?php

declare(strict_types=1);

namespace App\Domain\ValueObject;

use App\Domain\Exception\InvalidMoneyException;

final class Money
{
    private int $amount;

    public function __construct(int $amount)
    {
        if ($amount < 0) {
            throw new InvalidMoneyException('Money amount cannot be negative');
        }
        $this->amount = $amount;
    }

    public static function zero(): self
    {
        return new self(0);
    }

    public function amount(): int
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
            throw new InvalidMoneyException('Cannot subtract: result would be negative');
        }
        return new self($result);
    }

    public function isGreaterThan(Money $other): bool
    {
        return $this->amount > $other->amount;
    }

    public function isGreaterThanOrEqual(Money $other): bool
    {
        return $this->amount >= $other->amount;
    }

    public function isLessThan(Money $other): bool
    {
        return $this->amount < $other->amount;
    }

    public function isLessThanOrEqual(Money $other): bool
    {
        return $this->amount <= $other->amount;
    }

    public function equals(Money $other): bool
    {
        return $this->amount === $other->amount;
    }

    public function __toString(): string
    {
        return (string) $this->amount;
    }
}
