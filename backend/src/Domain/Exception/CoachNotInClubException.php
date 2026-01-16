<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class CoachNotInClubException extends DomainException
{
    public function __construct(int $coachId, int $clubId)
    {
        parent::__construct(
            sprintf('Coach %d is not associated with club %d', $coachId, $clubId)
        );
    }
}
