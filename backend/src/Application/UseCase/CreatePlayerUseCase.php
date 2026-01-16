<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\CreatePlayerRequest;
use App\Application\Service\NotificationService;
use App\Domain\Entity\Player;
use App\Domain\Repository\PlayerRepositoryInterface;

class CreatePlayerUseCase
{
    public function __construct(
        private PlayerRepositoryInterface $playerRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(CreatePlayerRequest $request): Player
    {
        $player = Player::create($request->name);

        $this->playerRepository->save($player);

        $this->notificationService->notifyPlayerCreated($player->name());

        return $player;
    }
}
