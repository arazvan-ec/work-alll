import type { Player, CreatePlayerDTO, PlayersResponse } from '../types/player'
import { getPlayersState, setPlayersState } from './clubs'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let nextPlayerId = 16

export const playersService = {
  async getAll(params?: { name?: string; page?: number; limit?: number }): Promise<PlayersResponse> {
    await delay(300)
    let players = getPlayersState()

    // Filter by name if provided
    if (params?.name) {
      const searchTerm = params.name.toLowerCase()
      players = players.filter(p => p.name.toLowerCase().includes(searchTerm))
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const total = players.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: players.slice(start, end),
      meta: { total, page, pages, limit },
    }
  },

  async getById(id: number): Promise<Player> {
    await delay(200)
    const players = getPlayersState()
    const player = players.find(p => p.id === id)
    if (!player) {
      throw { error: 'Player not found' }
    }
    return player
  },

  async create(data: CreatePlayerDTO): Promise<Player> {
    await delay(300)
    if (!data.name || data.name.length < 3) {
      throw { error: 'Name must be at least 3 characters' }
    }

    const players = getPlayersState()
    const newPlayer: Player = {
      id: nextPlayerId++,
      name: data.name,
      salary: undefined,
      club: undefined,
    }
    setPlayersState([...players, newPlayer])
    return newPlayer
  },

  async getFreePlayers(): Promise<Player[]> {
    await delay(200)
    const players = getPlayersState()
    return players.filter(p => !p.club)
  },
}
