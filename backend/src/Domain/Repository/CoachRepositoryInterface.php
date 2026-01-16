<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Coach;

interface CoachRepositoryInterface
{
    public function save(Coach $coach): void;

    public function findById(int $id): ?Coach;

    public function remove(Coach $coach): void;

    /**
     * @return Coach[]
     */
    public function findFreeCoachesForSelect(): array;
}
