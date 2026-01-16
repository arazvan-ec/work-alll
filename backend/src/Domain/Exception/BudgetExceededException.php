<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class BudgetExceededException extends DomainException
{
    private int $available;
    private int $required;

    public function __construct(int $available, int $required)
    {
        $this->available = $available;
        $this->required = $required;
        parent::__construct(
            sprintf('Budget exceeded. Available: %d, Required: %d', $available, $required)
        );
    }

    public function available(): int
    {
        return $this->available;
    }

    public function required(): int
    {
        return $this->required;
    }
}
