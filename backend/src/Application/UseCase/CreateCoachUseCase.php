<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\CreateCoachRequest;
use App\Application\Service\NotificationService;
use App\Domain\Entity\Coach;
use App\Domain\Repository\CoachRepositoryInterface;

class CreateCoachUseCase
{
    public function __construct(
        private CoachRepositoryInterface $coachRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(CreateCoachRequest $request): Coach
    {
        $coach = Coach::create($request->name);

        $this->coachRepository->save($coach);

        $this->notificationService->notifyCoachCreated($coach->name());

        return $coach;
    }
}
