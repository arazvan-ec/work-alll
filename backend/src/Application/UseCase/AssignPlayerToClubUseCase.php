<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\AssignPlayerRequest;
use App\Application\Service\NotificationService;
use App\Domain\Entity\Player;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Exception\PlayerNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\Repository\PlayerRepositoryInterface;
use App\Domain\ValueObject\Money;

class AssignPlayerToClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private PlayerRepositoryInterface $playerRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(AssignPlayerRequest $request): Player
    {
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw new ClubNotFoundException($request->clubId);
        }

        $player = $this->playerRepository->findById($request->playerId);
        if ($player === null) {
            throw new PlayerNotFoundException($request->playerId);
        }

        $salary = new Money($request->salary);
        $club->assignPlayer($player, $salary);

        $this->clubRepository->save($club);

        $this->notificationService->notifyPlayerAssigned(
            $player->name(),
            $club->name(),
            $salary->amount()
        );

        return $player;
    }
}
