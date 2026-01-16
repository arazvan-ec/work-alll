<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Coach;
use App\Domain\Exception\CoachNotFoundException;
use App\Domain\Repository\CoachRepositoryInterface;

class GetCoachUseCase
{
    public function __construct(
        private CoachRepositoryInterface $coachRepository
    ) {}

    public function execute(int $coachId): Coach
    {
        $coach = $this->coachRepository->findById($coachId);
        if ($coach === null) {
            throw new CoachNotFoundException($coachId);
        }

        return $coach;
    }
}
