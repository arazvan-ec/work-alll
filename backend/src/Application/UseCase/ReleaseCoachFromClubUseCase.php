<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\Service\NotificationService;
use App\Domain\Entity\Coach;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Exception\CoachNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\Repository\CoachRepositoryInterface;

class ReleaseCoachFromClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private CoachRepositoryInterface $coachRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(int $clubId, int $coachId): Coach
    {
        $club = $this->clubRepository->findById($clubId);
        if ($club === null) {
            throw new ClubNotFoundException($clubId);
        }

        $coach = $this->coachRepository->findById($coachId);
        if ($coach === null) {
            throw new CoachNotFoundException($coachId);
        }

        $clubName = $club->name();
        $club->releaseCoach($coach);

        $this->clubRepository->save($club);

        $this->notificationService->notifyCoachReleased($coach->name(), $clubName);

        return $coach;
    }
}
