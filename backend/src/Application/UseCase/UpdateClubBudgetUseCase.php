<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\UpdateBudgetRequest;
use App\Domain\Entity\Club;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\ValueObject\Money;

class UpdateClubBudgetUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(UpdateBudgetRequest $request): Club
    {
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw new ClubNotFoundException($request->clubId);
        }

        $club->updateBudget(new Money($request->budget));

        $this->clubRepository->save($club);

        return $club;
    }
}
