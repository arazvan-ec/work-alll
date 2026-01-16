<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class PlayerNotInClubException extends DomainException
{
    public function __construct(int $playerId, int $clubId)
    {
        parent::__construct(
            sprintf('Player %d is not associated with club %d', $playerId, $clubId)
        );
    }
}
