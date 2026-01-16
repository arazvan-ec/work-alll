<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\AssignCoachRequest;
use App\Application\Service\NotificationService;
use App\Domain\Entity\Coach;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Exception\CoachNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\Repository\CoachRepositoryInterface;
use App\Domain\ValueObject\Money;

class AssignCoachToClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository,
        private CoachRepositoryInterface $coachRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(AssignCoachRequest $request): Coach
    {
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw new ClubNotFoundException($request->clubId);
        }

        $coach = $this->coachRepository->findById($request->coachId);
        if ($coach === null) {
            throw new CoachNotFoundException($request->coachId);
        }

        $salary = new Money($request->salary);
        $club->assignCoach($coach, $salary);

        $this->clubRepository->save($club);

        $this->notificationService->notifyCoachAssigned(
            $coach->name(),
            $club->name(),
            $salary->amount()
        );

        return $coach;
    }
}
