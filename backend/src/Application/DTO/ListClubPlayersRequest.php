<?php

declare(strict_types=1);

namespace App\Application\DTO;

final class ListClubPlayersRequest
{
    public function __construct(
        public readonly int $clubId,
        public readonly ?string $name = null,
        public readonly int $page = 1,
        public readonly int $limit = 10
    ) {}
}
