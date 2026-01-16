<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class CreateClubRequest
{
    public function __construct(
        public readonly string $name,
        public readonly int $budget
    ) {}
}
