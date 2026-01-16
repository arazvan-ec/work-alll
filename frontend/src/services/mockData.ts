import type { Club, ClubWithStats } from '../types/club'
import type { Player } from '../types/player'
import type { Coach } from '../types/coach'

// Mock clubs data
export const mockClubs: Club[] = [
  {
    id: 1,
    name: 'FC Barcelona',
    budget: 5000000,
  },
  {
    id: 2,
    name: 'Real Madrid',
    budget: 6000000,
  },
  {
    id: 3,
    name: 'Manchester United',
    budget: 4500000,
  },
]

// Mock players data
export const mockPlayers: Player[] = [
  { id: 1, name: 'Lionel Messi', salary: 1500000, club: { id: 1, name: 'FC Barcelona' } },
  { id: 2, name: 'Pedri', salary: 800000, club: { id: 1, name: 'FC Barcelona' } },
  { id: 3, name: 'Gavi', salary: 600000, club: { id: 1, name: 'FC Barcelona' } },
  { id: 4, name: 'Cristiano Ronaldo', salary: 1800000, club: { id: 2, name: 'Real Madrid' } },
  { id: 5, name: 'Vinicius Jr', salary: 1200000, club: { id: 2, name: 'Real Madrid' } },
  { id: 6, name: 'Jude Bellingham', salary: 1000000, club: { id: 2, name: 'Real Madrid' } },
  { id: 7, name: 'Marcus Rashford', salary: 1200000, club: { id: 3, name: 'Manchester United' } },
  { id: 8, name: 'Bruno Fernandes', salary: 1100000, club: { id: 3, name: 'Manchester United' } },
  { id: 9, name: 'Wayne Rooney', salary: 900000, club: { id: 3, name: 'Manchester United' } },
  { id: 10, name: 'Neymar Jr', salary: undefined, club: undefined },
  { id: 11, name: 'Kylian Mbappe', salary: undefined, club: undefined },
  { id: 12, name: 'Erling Haaland', salary: undefined, club: undefined },
  { id: 13, name: 'Mohamed Salah', salary: undefined, club: undefined },
  { id: 14, name: 'Kevin De Bruyne', salary: undefined, club: undefined },
  { id: 15, name: 'Robert Lewandowski', salary: undefined, club: undefined },
]

// Mock coaches data
export const mockCoaches: Coach[] = [
  { id: 1, name: 'Pep Guardiola', salary: 500000, club: { id: 1, name: 'FC Barcelona' } },
  { id: 2, name: 'Carlo Ancelotti', salary: 600000, club: { id: 2, name: 'Real Madrid' } },
  { id: 3, name: 'Erik ten Hag', salary: 450000, club: { id: 3, name: 'Manchester United' } },
  { id: 4, name: 'Zinedine Zidane', salary: undefined, club: undefined },
  { id: 5, name: 'Jose Mourinho', salary: undefined, club: undefined },
]

// Helper functions
export function getClubWithStats(club: Club, players: Player[], coaches: Coach[]): ClubWithStats {
  const clubPlayers = players.filter(p => p.club?.id === club.id)
  const clubCoaches = coaches.filter(c => c.club?.id === club.id)
  const totalSalaries =
    clubPlayers.reduce((sum, p) => sum + (p.salary || 0), 0) +
    clubCoaches.reduce((sum, c) => sum + (c.salary || 0), 0)

  return {
    ...club,
    totalSalaries,
    availableBudget: club.budget - totalSalaries,
    playersCount: clubPlayers.length,
    coachesCount: clubCoaches.length,
  }
}

export function getFreePlayers(players: Player[]): Player[] {
  return players.filter(p => !p.club)
}

export function getFreeCoaches(coaches: Coach[]): Coach[] {
  return coaches.filter(c => !c.club)
}

export function getContractedPlayers(players: Player[]): Player[] {
  return players.filter(p => p.club)
}

export function getContractedCoaches(coaches: Coach[]): Coach[] {
  return coaches.filter(c => c.club)
}
