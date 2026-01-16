<?php

declare(strict_types=1);

namespace App\Domain\Exception;

use DomainException;

final class ClubNotFoundException extends DomainException
{
    public function __construct(int $clubId)
    {
        parent::__construct(sprintf('Club with ID %d not found', $clubId));
    }
}
