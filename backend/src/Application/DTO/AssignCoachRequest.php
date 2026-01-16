<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class AssignCoachRequest
{
    public function __construct(
        public readonly int $clubId,
        public readonly int $coachId,
        public readonly int $salary
    ) {}
}
