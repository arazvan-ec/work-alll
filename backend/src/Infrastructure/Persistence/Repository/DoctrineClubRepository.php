<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Repository;

use App\Domain\Entity\Club;
use App\Domain\Entity\Player;
use App\Domain\Repository\ClubRepositoryInterface;
use Doctrine\ORM\EntityManagerInterface;

class DoctrineClubRepository implements ClubRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function save(Club $club): void
    {
        $this->entityManager->persist($club);
        $this->entityManager->flush();
    }

    public function findById(int $id): ?Club
    {
        return $this->entityManager->find(Club::class, $id);
    }

    public function remove(Club $club): void
    {
        $this->entityManager->remove($club);
        $this->entityManager->flush();
    }

    public function findAll(): array
    {
        return $this->entityManager->createQueryBuilder()
            ->select('c')
            ->from(Club::class, 'c')
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findClubPlayersWithPagination(
        int $clubId,
        ?string $nameFilter = null,
        int $page = 1,
        int $limit = 10
    ): array {
        $qb = $this->entityManager->createQueryBuilder()
            ->select('p')
            ->from(Player::class, 'p')
            ->where('p.club = :clubId')
            ->setParameter('clubId', $clubId)
            ->orderBy('p.name', 'ASC');

        if ($nameFilter !== null && $nameFilter !== '') {
            $qb->andWhere('p.name LIKE :name')
                ->setParameter('name', '%' . $nameFilter . '%');
        }

        // Count total
        $countQb = clone $qb;
        $countQb->select('COUNT(p.id)');
        $total = (int) $countQb->getQuery()->getSingleScalarResult();

        // Apply pagination
        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)->setMaxResults($limit);

        $players = $qb->getQuery()->getResult();

        // Transform to array for response
        $data = array_map(function (Player $player) {
            return [
                'id' => $player->id(),
                'name' => $player->name(),
                'salary' => $player->salary()?->amount(),
                'club' => $player->club() ? [
                    'id' => $player->club()->id(),
                    'name' => $player->club()->name(),
                ] : null,
            ];
        }, $players);

        return [
            'data' => $data,
            'total' => $total,
        ];
    }
}
