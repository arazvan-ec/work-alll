<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class BudgetTooLowException extends DomainException
{
    private int $currentSalaries;

    public function __construct(int $currentSalaries)
    {
        $this->currentSalaries = $currentSalaries;
        parent::__construct(
            sprintf('Budget cannot be lower than current salaries. Current: %d', $currentSalaries)
        );
    }

    public function currentSalaries(): int
    {
        return $this->currentSalaries;
    }
}
