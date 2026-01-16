<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\EventListener;

use App\Domain\Exception\BudgetExceededException;
use App\Domain\Exception\BudgetTooLowException;
use App\Domain\Exception\ClubNotFoundException;
use App\Domain\Exception\CoachAlreadyHasClubException;
use App\Domain\Exception\CoachNotFoundException;
use App\Domain\Exception\CoachNotInClubException;
use App\Domain\Exception\InvalidMoneyException;
use App\Domain\Exception\PlayerAlreadyHasClubException;
use App\Domain\Exception\PlayerNotFoundException;
use App\Domain\Exception\PlayerNotInClubException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener
{
    public function __construct(
        private LoggerInterface $logger
    ) {}

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $this->logger->error('Exception caught', [
            'message' => $exception->getMessage(),
            'exception' => get_class($exception),
            'trace' => $exception->getTraceAsString(),
        ]);

        $response = $this->createResponseForException($exception);
        $event->setResponse($response);
    }

    private function createResponseForException(\Throwable $exception): JsonResponse
    {
        // Not Found exceptions
        if ($exception instanceof PlayerNotFoundException ||
            $exception instanceof CoachNotFoundException ||
            $exception instanceof ClubNotFoundException) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                Response::HTTP_NOT_FOUND
            );
        }

        // Conflict exceptions (already has club)
        if ($exception instanceof PlayerAlreadyHasClubException ||
            $exception instanceof CoachAlreadyHasClubException) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                Response::HTTP_CONFLICT
            );
        }

        // Business rule violation (budget exceeded, not in club)
        if ($exception instanceof BudgetExceededException ||
            $exception instanceof BudgetTooLowException) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if ($exception instanceof PlayerNotInClubException ||
            $exception instanceof CoachNotInClubException) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Invalid input
        if ($exception instanceof InvalidMoneyException ||
            $exception instanceof \InvalidArgumentException) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                Response::HTTP_BAD_REQUEST
            );
        }

        // HTTP exceptions
        if ($exception instanceof HttpExceptionInterface) {
            return new JsonResponse(
                ['error' => $exception->getMessage()],
                $exception->getStatusCode()
            );
        }

        // Default: Internal server error
        return new JsonResponse(
            ['error' => 'Internal server error'],
            Response::HTTP_INTERNAL_SERVER_ERROR
        );
    }
}
