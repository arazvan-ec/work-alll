<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\Service\NotificationService;
use App\Domain\Entity\Player;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Exception\PlayerNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\Repository\PlayerRepositoryInterface;

class ReleasePlayerFromClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private PlayerRepositoryInterface $playerRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(int $clubId, int $playerId): Player
    {
        $club = $this->clubRepository->findById($clubId);
        if ($club === null) {
            throw new ClubNotFoundException($clubId);
        }

        $player = $this->playerRepository->findById($playerId);
        if ($player === null) {
            throw new PlayerNotFoundException($playerId);
        }

        $clubName = $club->name();
        $club->releasePlayer($player);

        $this->clubRepository->save($club);

        $this->notificationService->notifyPlayerReleased($player->name(), $clubName);

        return $player;
    }
}
