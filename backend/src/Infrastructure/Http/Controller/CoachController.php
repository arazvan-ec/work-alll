<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller;

use App\Application\DTO\CreateCoachRequest;
use App\Application\UseCase\CreateCoachUseCase;
use App\Application\UseCase\GetCoachUseCase;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class CoachController extends AbstractController
{
    public function __construct(
        private CreateCoachUseCase $createCoachUseCase,
        private GetCoachUseCase $getCoachUseCase
    ) {}

    #[Route('/coaches', name: 'api_create_coach', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || empty(trim($data['name']))) {
            return new JsonResponse(
                ['error' => 'Name is required'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $dto = new CreateCoachRequest($data['name']);
        $coach = $this->createCoachUseCase->execute($dto);

        return new JsonResponse([
            'id' => $coach->id(),
            'name' => $coach->name(),
            'salary' => $coach->salary()?->amount(),
            'club' => null,
        ], Response::HTTP_CREATED);
    }

    #[Route('/coaches/{id}', name: 'api_get_coach', methods: ['GET'])]
    public function get(int $id): JsonResponse
    {
        $coach = $this->getCoachUseCase->execute($id);

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
}
