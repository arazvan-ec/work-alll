<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Player;

interface PlayerRepositoryInterface
{
    public function save(Player $player): void;

    public function findById(int $id): ?Player;

    public function remove(Player $player): void;

    /**
     * @return Player[]
     */
    public function findFreePlayersForSelect(): array;
}
