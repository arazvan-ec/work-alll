<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller;

use App\Application\DTO\AssignCoachRequest;
use App\Application\DTO\AssignPlayerRequest;
use App\Application\DTO\CreateClubRequest;
use App\Application\DTO\ListClubPlayersRequest;
use App\Application\DTO\UpdateBudgetRequest;
use App\Application\UseCase\AssignCoachToClubUseCase;
use App\Application\UseCase\AssignPlayerToClubUseCase;
use App\Application\UseCase\CreateClubUseCase;
use App\Application\UseCase\GetClubUseCase;
use App\Application\UseCase\ListClubPlayersUseCase;
use App\Application\UseCase\ReleaseCoachFromClubUseCase;
use App\Application\UseCase\ReleasePlayerFromClubUseCase;
use App\Application\UseCase\UpdateClubBudgetUseCase;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ClubController extends AbstractController
{
    public function __construct(
        private CreateClubUseCase $createClubUseCase,
        private GetClubUseCase $getClubUseCase,
        private UpdateClubBudgetUseCase $updateClubBudgetUseCase,
        private AssignPlayerToClubUseCase $assignPlayerToClubUseCase,
        private AssignCoachToClubUseCase $assignCoachToClubUseCase,
        private ReleasePlayerFromClubUseCase $releasePlayerFromClubUseCase,
        private ReleaseCoachFromClubUseCase $releaseCoachFromClubUseCase,
        private ListClubPlayersUseCase $listClubPlayersUseCase
    ) {}

    #[Route('/clubs', name: 'api_create_club', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(
                ['error' => 'Name is required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!isset($data['budget']) || !is_numeric($data['budget']) || $data['budget'] <= 0) {
            return new JsonResponse(
                ['error' => 'Budget must be a positive number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new CreateClubRequest($data['name'], (int)$data['budget']);
        $club = $this->createClubUseCase->execute($dto);

        return new JsonResponse([
            'id' => $club->id(),
            'name' => $club->name(),
            'budget' => $club->budget()->amount(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/clubs/{id}', name: 'api_get_club', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $club = $this->getClubUseCase->execute($id);

        return new JsonResponse([
            'id' => $club->id(),
            'name' => $club->name(),
            'budget' => $club->budget()->amount(),
            'totalSalaries' => $club->totalSalaries()->amount(),
            'availableBudget' => $club->availableBudget()->amount(),
        ]);
    }

    #[Route('/clubs/{clubId}/budget', name: 'api_update_club_budget', methods: ['PATCH'])]
    public function updateBudget(int $clubId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['budget']) || !is_numeric($data['budget']) || $data['budget'] <= 0) {
            return new JsonResponse(
                ['error' => 'Budget must be a positive number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new UpdateBudgetRequest($clubId, (int)$data['budget']);
        $club = $this->updateClubBudgetUseCase->execute($dto);

        return new JsonResponse([
            'id' => $club->id(),
            'name' => $club->name(),
            'budget' => $club->budget()->amount(),
            'totalSalaries' => $club->totalSalaries()->amount(),
            'availableBudget' => $club->availableBudget()->amount(),
        ]);
    }

    #[Route('/clubs/{clubId}/players/{playerId}', name: 'api_assign_player', methods: ['POST'])]
    public function assignPlayer(int $clubId, int $playerId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['salary']) || !is_numeric($data['salary']) || $data['salary'] < 0) {
            return new JsonResponse(
                ['error' => 'Salary must be a non-negative number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new AssignPlayerRequest($clubId, $playerId, (int)$data['salary']);
        $player = $this->assignPlayerToClubUseCase->execute($dto);

        return new JsonResponse([
            'id' => $player->id(),
            'name' => $player->name(),
            'salary' => $player->salary()?->amount(),
            'club' => $player->club() ? [
                'id' => $player->club()->id(),
                'name' => $player->club()->name(),
            ] : null,
        ]);
    }

    #[Route('/clubs/{clubId}/players/{playerId}', name: 'api_release_player', methods: ['DELETE'])]
    public function releasePlayer(int $clubId, int $playerId): JsonResponse
    {
        $player = $this->releasePlayerFromClubUseCase->execute($clubId, $playerId);

        return new JsonResponse([
            'id' => $player->id(),
            'name' => $player->name(),
            'salary' => $player->salary()?->amount(),
            'club' => null,
        ]);
    }

    #[Route('/clubs/{clubId}/coaches/{coachId}', name: 'api_assign_coach', methods: ['POST'])]
    public function assignCoach(int $clubId, int $coachId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['salary']) || !is_numeric($data['salary']) || $data['salary'] < 0) {
            return new JsonResponse(
                ['error' => 'Salary must be a non-negative number'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new AssignCoachRequest($clubId, $coachId, (int)$data['salary']);
        $coach = $this->assignCoachToClubUseCase->execute($dto);

        return new JsonResponse([
            'id' => $coach->id(),
            'name' => $coach->name(),
            'salary' => $coach->salary()?->amount(),
            'club' => $coach->club() ? [
                'id' => $coach->club()->id(),
                'name' => $coach->club()->name(),
            ] : null,
        ]);
    }

    #[Route('/clubs/{clubId}/coaches/{coachId}', name: 'api_release_coach', methods: ['DELETE'])]
    public function releaseCoach(int $clubId, int $coachId): JsonResponse
    {
        $coach = $this->releaseCoachFromClubUseCase->execute($clubId, $coachId);

        return new JsonResponse([
            'id' => $coach->id(),
            'name' => $coach->name(),
            'salary' => $coach->salary()?->amount(),
            'club' => null,
        ]);
    }

    #[Route('/clubs/{clubId}/players', name: 'api_list_club_players', methods: ['GET'])]
    public function listPlayers(int $clubId, Request $request): JsonResponse
    {
        $name = $request->query->get('name');
        $page = (int)$request->query->get('page', 1);
        $limit = (int)$request->query->get('limit', 10);

        if ($page < 1) $page = 1;
        if ($limit < 1) $limit = 10;
        if ($limit > 100) $limit = 100;

        $dto = new ListClubPlayersRequest($clubId, $name, $page, $limit);
        $result = $this->listClubPlayersUseCase->execute($dto);

        return new JsonResponse($result);
    }
}
