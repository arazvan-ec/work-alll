<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class PlayerAlreadyHasClubException extends DomainException
{
    public function __construct(int $playerId)
    {
        parent::__construct(
            sprintf('Player %d is already associated with another club', $playerId)
        );
    }
}
