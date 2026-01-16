<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Entity\Club;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;

class GetClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(int $clubId): Club
    {
        $club = $this->clubRepository->findById($clubId);
        if ($club === null) {
            throw new ClubNotFoundException($clubId);
        }

        return $club;
    }
}
