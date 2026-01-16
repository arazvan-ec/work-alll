<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class PlayerNotFoundException extends DomainException
{
    public function __construct(int $playerId)
    {
        parent::__construct(sprintf('Player with ID %d not found', $playerId));
    }
}
