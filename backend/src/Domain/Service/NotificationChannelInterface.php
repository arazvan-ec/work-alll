<?php

declare(strict_types=1);

namespace App\Domain\Service;

interface NotificationChannelInterface
{
    public function send(string $subject, string $message, array $context = []): void;
}
