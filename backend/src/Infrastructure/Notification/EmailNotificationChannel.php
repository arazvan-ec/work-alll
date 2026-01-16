<?php

declare(strict_types=1);

namespace App\Infrastructure\Notification;

use App\Domain\Service\NotificationChannelInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailNotificationChannel implements NotificationChannelInterface
{
    public function __construct(
        private MailerInterface $mailer,
        private LoggerInterface $logger,
        private string $fromEmail = 'noreply@sportian.com',
        private string $toEmail = 'admin@sportian.com'
    ) {}

    public function send(string $subject, string $message, array $context = []): void
    {
        try {
            $email = (new Email())
                ->from($this->fromEmail)
                ->to($this->toEmail)
                ->subject('[Sportian] ' . $subject)
                ->text($message)
                ->html($this->generateHtmlContent($subject, $message, $context));

            $this->mailer->send($email);

            $this->logger->info('Email notification sent', [
                'subject' => $subject,
                'context' => $context,
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Failed to send email notification', [
                'subject' => $subject,
                'error' => $e->getMessage(),
                'context' => $context,
            ]);
        }
    }

    private function generateHtmlContent(string $subject, string $message, array $context): string
    {
        $contextHtml = '';
        if (!empty($context)) {
            $contextHtml = '<hr><p><strong>Details:</strong></p><ul>';
            foreach ($context as $key => $value) {
                $contextHtml .= sprintf('<li><strong>%s:</strong> %s</li>', htmlspecialchars($key), htmlspecialchars((string)$value));
            }
            $contextHtml .= '</ul>';
        }

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{$subject}</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #333;">{$subject}</h2>
    <p>{$message}</p>
    {$contextHtml}
    <hr>
    <p style="color: #666; font-size: 12px;">This is an automated notification from Sportian Club Management System.</p>
</body>
</html>
HTML;
    }
}
