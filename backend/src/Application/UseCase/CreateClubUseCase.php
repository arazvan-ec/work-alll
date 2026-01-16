<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\CreateClubRequest;
use App\Domain\Entity\Club;
use App\Domain\Repository\ClubRepositoryInterface;
use App\Domain\ValueObject\Money;

class CreateClubUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    public function execute(CreateClubRequest $request): Club
    {
        $club = Club::create($request->name, new Money($request->budget));

        $this->clubRepository->save($club);

        return $club;
    }
}
