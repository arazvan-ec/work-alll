<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Entity\Player;
use App\Domain\Repository\PlayerRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class DoctrinePlayerRepository implements PlayerRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function save(Player $player): void
    {
        $this->entityManager->persist($player);
        $this->entityManager->flush();
    }

    public function findById(int $id): ?Player
    {
        return $this->entityManager->find(Player::class, $id);
    }

    public function remove(Player $player): void
    {
        $this->entityManager->remove($player);
        $this->entityManager->flush();
    }

    public function findFreePlayersForSelect(): array
    {
        return $this->entityManager->createQueryBuilder()
            ->select('p')
            ->from(Player::class, 'p')
            ->where('p.club IS NULL')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
