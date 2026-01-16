import type { DashboardStats } from '../types/api'
import { mockClubs, getFreePlayers, getFreeCoaches, getContractedPlayers, getContractedCoaches } from './mockData'
import { getPlayersState, getCoachesState } from './clubs'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    await delay(300)
    const players = getPlayersState()
    const coaches = getCoachesState()

    const freePlayers = getFreePlayers(players)
    const freeCoaches = getFreeCoaches(coaches)
    const contractedPlayers = getContractedPlayers(players)
    const contractedCoaches = getContractedCoaches(coaches)

    return {
      totalClubs: mockClubs.length,
      totalPlayers: players.length,
      freePlayers: freePlayers.length,
      contractedPlayers: contractedPlayers.length,
      totalCoaches: coaches.length,
      freeCoaches: freeCoaches.length,
      contractedCoaches: contractedCoaches.length,
      totalBudget: mockClubs.reduce((sum, club) => sum + club.budget, 0),
    }
  },
}
