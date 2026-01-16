<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Domain\Entity\Club;
use App\Domain\Entity\Coach;
use App\Domain\Entity\Player;
use App\Domain\ValueObject\Money;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Create clubs
        $barcelona = Club::create('FC Barcelona', new Money(5000000));
        $realMadrid = Club::create('Real Madrid', new Money(6000000));
        $manchester = Club::create('Manchester United', new Money(4500000));

        $manager->persist($barcelona);
        $manager->persist($realMadrid);
        $manager->persist($manchester);

        // Create coaches (contracted)
        $guardiola = Coach::create('Pep Guardiola');
        $ancelotti = Coach::create('Carlo Ancelotti');
        $tenHag = Coach::create('Erik ten Hag');

        // Create free coaches
        $zidane = Coach::create('Zinedine Zidane');
        $mourinho = Coach::create('José Mourinho');

        $manager->persist($guardiola);
        $manager->persist($ancelotti);
        $manager->persist($tenHag);
        $manager->persist($zidane);
        $manager->persist($mourinho);

        // Create players (contracted)
        $messi = Player::create('Lionel Messi');
        $pedri = Player::create('Pedri González');
        $gavi = Player::create('Pablo Gavi');
        $araujo = Player::create('Ronald Araujo');

        $ronaldo = Player::create('Cristiano Ronaldo');
        $bellingham = Player::create('Jude Bellingham');
        $vinicius = Player::create('Vinicius Jr');
        $modric = Player::create('Luka Modric');

        $rashford = Player::create('Marcus Rashford');
        $fernandes = Player::create('Bruno Fernandes');
        $casemiro = Player::create('Casemiro');

        // Create free players
        $neymar = Player::create('Neymar Jr');
        $mbappe = Player::create('Kylian Mbappé');
        $salah = Player::create('Mohamed Salah');
        $haaland = Player::create('Erling Haaland');
        $debruyne = Player::create('Kevin De Bruyne');

        // Persist all players
        $manager->persist($messi);
        $manager->persist($pedri);
        $manager->persist($gavi);
        $manager->persist($araujo);
        $manager->persist($ronaldo);
        $manager->persist($bellingham);
        $manager->persist($vinicius);
        $manager->persist($modric);
        $manager->persist($rashford);
        $manager->persist($fernandes);
        $manager->persist($casemiro);
        $manager->persist($neymar);
        $manager->persist($mbappe);
        $manager->persist($salah);
        $manager->persist($haaland);
        $manager->persist($debruyne);

        // Flush to get IDs
        $manager->flush();

        // Assign coaches to clubs
        $barcelona->assignCoach($guardiola, new Money(500000));
        $realMadrid->assignCoach($ancelotti, new Money(600000));
        $manchester->assignCoach($tenHag, new Money(450000));

        // Assign players to FC Barcelona
        $barcelona->assignPlayer($messi, new Money(1500000));
        $barcelona->assignPlayer($pedri, new Money(400000));
        $barcelona->assignPlayer($gavi, new Money(350000));
        $barcelona->assignPlayer($araujo, new Money(300000));

        // Assign players to Real Madrid
        $realMadrid->assignPlayer($ronaldo, new Money(1800000));
        $realMadrid->assignPlayer($bellingham, new Money(800000));
        $realMadrid->assignPlayer($vinicius, new Money(700000));
        $realMadrid->assignPlayer($modric, new Money(500000));

        // Assign players to Manchester United
        $manchester->assignPlayer($rashford, new Money(600000));
        $manchester->assignPlayer($fernandes, new Money(700000));
        $manchester->assignPlayer($casemiro, new Money(800000));

        // Final flush
        $manager->flush();
    }
}
