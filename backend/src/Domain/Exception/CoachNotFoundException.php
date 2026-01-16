<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class CoachNotFoundException extends DomainException
{
    public function __construct(int $coachId)
    {
        parent::__construct(sprintf('Coach with ID %d not found', $coachId));
    }
}
