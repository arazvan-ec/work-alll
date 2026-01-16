import type { Club, ClubWithStats, CreateClubDTO, UpdateBudgetDTO } from '../types/club'
import type { Player } from '../types/player'
import type { Coach } from '../types/coach'
import { mockClubs, mockPlayers, mockCoaches, getClubWithStats } from './mockData'

// Simulated delay for mock API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory state for mocks
let clubs = [...mockClubs]
let players = [...mockPlayers]
let coaches = [...mockCoaches]
let nextClubId = 4

export const clubsService = {
  async getAll(): Promise<ClubWithStats[]> {
    await delay(300)
    return clubs.map(club => getClubWithStats(club, players, coaches))
  },

  async getById(id: number): Promise<ClubWithStats> {
    await delay(200)
    const club = clubs.find(c => c.id === id)
    if (!club) {
      throw { error: 'Club not found' }
    }
    return getClubWithStats(club, players, coaches)
  },

  async create(data: CreateClubDTO): Promise<Club> {
    await delay(300)
    if (!data.name || data.name.length < 3) {
      throw { error: 'Name must be at least 3 characters' }
    }
    if (data.budget <= 0) {
      throw { error: 'Budget must be greater than 0' }
    }
    const newClub: Club = {
      id: nextClubId++,
      name: data.name,
      budget: data.budget,
    }
    clubs.push(newClub)
    return newClub
  },

  async updateBudget(clubId: number, data: UpdateBudgetDTO): Promise<ClubWithStats> {
    await delay(300)
    const clubIndex = clubs.findIndex(c => c.id === clubId)
    if (clubIndex === -1) {
      throw { error: 'Club not found' }
    }

    const club = clubs[clubIndex]
    const clubWithStats = getClubWithStats(club, players, coaches)

    if (data.budget < clubWithStats.totalSalaries) {
      throw { error: `Budget cannot be lower than current salaries. Current: ${clubWithStats.totalSalaries}` }
    }

    clubs[clubIndex] = { ...club, budget: data.budget }
    return getClubWithStats(clubs[clubIndex], players, coaches)
  },

  async getClubPlayers(clubId: number): Promise<Player[]> {
    await delay(200)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }
    return players.filter(p => p.club?.id === clubId)
  },

  async getClubCoaches(clubId: number): Promise<Coach[]> {
    await delay(200)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }
    return coaches.filter(c => c.club?.id === clubId)
  },

  async assignPlayer(clubId: number, playerId: number, salary: number): Promise<Player> {
    await delay(300)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }

    const playerIndex = players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      throw { error: 'Player not found' }
    }

    const player = players[playerIndex]
    if (player.club) {
      throw { error: 'Player is already associated with another club' }
    }

    const clubWithStats = getClubWithStats(club, players, coaches)
    if (salary > clubWithStats.availableBudget) {
      throw { error: `Budget exceeded. Available: ${clubWithStats.availableBudget}, Required: ${salary}` }
    }

    players[playerIndex] = {
      ...player,
      salary,
      club: { id: club.id, name: club.name },
    }

    return players[playerIndex]
  },

  async releasePlayer(clubId: number, playerId: number): Promise<Player> {
    await delay(300)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }

    const playerIndex = players.findIndex(p => p.id === playerId)
    if (playerIndex === -1) {
      throw { error: 'Player not found' }
    }

    const player = players[playerIndex]
    if (player.club?.id !== clubId) {
      throw { error: 'Player is not in this club' }
    }

    players[playerIndex] = {
      ...player,
      salary: undefined,
      club: undefined,
    }

    return players[playerIndex]
  },

  async assignCoach(clubId: number, coachId: number, salary: number): Promise<Coach> {
    await delay(300)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }

    const coachIndex = coaches.findIndex(c => c.id === coachId)
    if (coachIndex === -1) {
      throw { error: 'Coach not found' }
    }

    const coach = coaches[coachIndex]
    if (coach.club) {
      throw { error: 'Coach is already associated with another club' }
    }

    const clubWithStats = getClubWithStats(club, players, coaches)
    if (salary > clubWithStats.availableBudget) {
      throw { error: `Budget exceeded. Available: ${clubWithStats.availableBudget}, Required: ${salary}` }
    }

    coaches[coachIndex] = {
      ...coach,
      salary,
      club: { id: club.id, name: club.name },
    }

    return coaches[coachIndex]
  },

  async releaseCoach(clubId: number, coachId: number): Promise<Coach> {
    await delay(300)
    const club = clubs.find(c => c.id === clubId)
    if (!club) {
      throw { error: 'Club not found' }
    }

    const coachIndex = coaches.findIndex(c => c.id === coachId)
    if (coachIndex === -1) {
      throw { error: 'Coach not found' }
    }

    const coach = coaches[coachIndex]
    if (coach.club?.id !== clubId) {
      throw { error: 'Coach is not in this club' }
    }

    coaches[coachIndex] = {
      ...coach,
      salary: undefined,
      club: undefined,
    }

    return coaches[coachIndex]
  },
}

// Export state accessors for other services
export const getPlayersState = () => players
export const getCoachesState = () => coaches
export const setPlayersState = (newPlayers: Player[]) => { players = newPlayers }
export const setCoachesState = (newCoaches: Coach[]) => { coaches = newCoaches }
