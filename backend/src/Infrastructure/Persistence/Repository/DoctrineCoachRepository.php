<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Entity\Coach;
use App\Domain\Repository\CoachRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class DoctrineCoachRepository implements CoachRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function save(Coach $coach): void
    {
        $this->entityManager->persist($coach);
        $this->entityManager->flush();
    }

    public function findById(int $id): ?Coach
    {
        return $this->entityManager->find(Coach::class, $id);
    }

    public function remove(Coach $coach): void
    {
        $this->entityManager->remove($coach);
        $this->entityManager->flush();
    }

    public function findFreeCoachesForSelect(): array
    {
        return $this->entityManager->createQueryBuilder()
            ->select('c')
            ->from(Coach::class, 'c')
            ->where('c.club IS NULL')
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
