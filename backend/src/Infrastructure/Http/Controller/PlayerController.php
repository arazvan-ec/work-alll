<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller;

use App\Application\DTO\CreatePlayerRequest;
use App\Application\UseCase\CreatePlayerUseCase;
use App\Application\UseCase\GetPlayerUseCase;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class PlayerController extends AbstractController
{
    public function __construct(
        private CreatePlayerUseCase $createPlayerUseCase,
        private GetPlayerUseCase $getPlayerUseCase
    ) {}

    #[Route('/players', name: 'api_create_player', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(
                ['error' => 'Name is required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new CreatePlayerRequest($data['name']);
        $player = $this->createPlayerUseCase->execute($dto);

        return new JsonResponse([
            'id' => $player->id(),
            'name' => $player->name(),
            'salary' => $player->salary()?->amount(),
            'club' => null,
        ], Response::HTTP_CREATED);
    }

    #[Route('/players/{id}', name: 'api_get_player', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $player = $this->getPlayerUseCase->execute($id);

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
}
