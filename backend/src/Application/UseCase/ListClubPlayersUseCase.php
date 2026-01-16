<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\ListClubPlayersRequest;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Repository\ClubRepositoryInterface;

class ListClubPlayersUseCase
{
    public function __construct(
        private ClubRepositoryInterface $clubRepository
    ) {}

    /**
     * @return array{data: array, meta: array{total: int, page: int, pages: int, limit: int}}
     */
    public function execute(ListClubPlayersRequest $request): array
    {
        $club = $this->clubRepository->findById($request->clubId);
        if ($club === null) {
            throw new ClubNotFoundException($request->clubId);
        }

        $result = $this->clubRepository->findClubPlayersWithPagination(
            $request->clubId,
            $request->name,
            $request->page,
            $request->limit
        );

        $totalPages = (int) ceil($result['total'] / $request->limit);

        return [
            'data' => $result['data'],
            'meta' => [
                'total' => $result['total'],
                'page' => $request->page,
                'pages' => $totalPages,
                'limit' => $request->limit,
            ],
        ];
    }
}
