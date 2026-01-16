<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Player;
use App\Domain\Exception\PlayerNotFoundException;
use App\Domain\Repository\PlayerRepositoryInterface;

class GetPlayerUseCase
{
    public function __construct(
        private PlayerRepositoryInterface $playerRepository
    ) {}

    public function execute(int $playerId): Player
    {
        $player = $this->playerRepository->findById($playerId);
        if ($player === null) {
            throw new PlayerNotFoundException($playerId);
        }

        return $player;
    }
}
