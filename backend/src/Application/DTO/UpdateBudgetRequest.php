<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class UpdateBudgetRequest
{
    public function __construct(
        public readonly int $clubId,
        public readonly int $budget
    ) {}
}
