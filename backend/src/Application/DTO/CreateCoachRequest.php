<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class CreateCoachRequest
{
    public function __construct(
        public readonly string $name
    ) {}
}
