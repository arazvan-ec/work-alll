<?php

declare(strict_types=1);

namespace App\Application\Service;

use App\Domain\Service\NotificationChannelInterface;

class NotificationService
{
    /** @var NotificationChannelInterface[] */
    private array $channels;

    public function __construct(iterable $channels)
    {
        $this->channels = $channels instanceof \Traversable
            ? iterator_to_array($channels)
            : $channels;
    }

    public function notify(string $subject, string $message, array $context = []): void
    {
        foreach ($this->channels as $channel) {
            $channel->send($subject, $message, $context);
        }
    }

    public function notifyPlayerCreated(string $playerName): void
    {
        $this->notify(
            'New Player Created',
            sprintf('A new free player has been registered: %s', $playerName),
            ['type' => 'player_created', 'player_name' => $playerName]
        );
    }

    public function notifyCoachCreated(string $coachName): void
    {
        $this->notify(
            'New Coach Created',
            sprintf('A new free coach has been registered: %s', $coachName),
            ['type' => 'coach_created', 'coach_name' => $coachName]
        );
    }

    public function notifyPlayerAssigned(string $playerName, string $clubName, int $salary): void
    {
        $this->notify(
            'Player Assigned to Club',
            sprintf('Player %s has been assigned to %s with a salary of %d', $playerName, $clubName, $salary),
            ['type' => 'player_assigned', 'player_name' => $playerName, 'club_name' => $clubName, 'salary' => $salary]
        );
    }

    public function notifyCoachAssigned(string $coachName, string $clubName, int $salary): void
    {
        $this->notify(
            'Coach Assigned to Club',
            sprintf('Coach %s has been assigned to %s with a salary of %d', $coachName, $clubName, $salary),
            ['type' => 'coach_assigned', 'coach_name' => $coachName, 'club_name' => $clubName, 'salary' => $salary]
        );
    }

    public function notifyPlayerReleased(string $playerName, string $clubName): void
    {
        $this->notify(
            'Player Released from Club',
            sprintf('Player %s has been released from %s', $playerName, $clubName),
            ['type' => 'player_released', 'player_name' => $playerName, 'club_name' => $clubName]
        );
    }

    public function notifyCoachReleased(string $coachName, string $clubName): void
    {
        $this->notify(
            'Coach Released from Club',
            sprintf('Coach %s has been released from %s', $coachName, $clubName),
            ['type' => 'coach_released', 'coach_name' => $coachName, 'club_name' => $clubName]
        );
    }
}
