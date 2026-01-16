<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class CoachAlreadyHasClubException extends DomainException
{
    public function __construct(int $coachId)
    {
        parent::__construct(
            sprintf('Coach %d is already associated with another club', $coachId)
        );
    }
}
