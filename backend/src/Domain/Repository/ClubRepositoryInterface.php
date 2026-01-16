<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Club;

interface ClubRepositoryInterface
{
    public function save(Club $club): void;

    public function findById(int $id): ?Club;

    public function remove(Club $club): void;

    /**
     * @return Club[]
     */
    public function findAll(): array;

    /**
     * Find players of a club with optional filters and pagination
     * @return array{data: array, total: int}
     */
    public function findClubPlayersWithPagination(
        int $clubId,
        ?string $nameFilter = null,
        int $page = 1,
        int $limit = 10
    ): array;
}
