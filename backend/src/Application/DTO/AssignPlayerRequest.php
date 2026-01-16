<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class AssignPlayerRequest
{
    public function __construct(
        public readonly int $clubId,
        public readonly int $playerId,
        public readonly int $salary
    ) {}
}
