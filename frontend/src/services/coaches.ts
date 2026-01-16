import type { Coach, CreateCoachDTO, CoachesResponse } from '../types/coach'
import { getCoachesState, setCoachesState } from './clubs'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let nextCoachId = 6

export const coachesService = {
  async getAll(params?: { name?: string; page?: number; limit?: number }): Promise<CoachesResponse> {
    await delay(300)
    let coaches = getCoachesState()

    // Filter by name if provided
    if (params?.name) {
      const searchTerm = params.name.toLowerCase()
      coaches = coaches.filter(c => c.name.toLowerCase().includes(searchTerm))
    }

    const page = params?.page || 1
    const limit = params?.limit || 10
    const total = coaches.length
    const pages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit

    return {
      data: coaches.slice(start, end),
      meta: { total, page, pages, limit },
    }
  },

  async getById(id: number): Promise<Coach> {
    await delay(200)
    const coaches = getCoachesState()
    const coach = coaches.find(c => c.id === id)
    if (!coach) {
      throw { error: 'Coach not found' }
    }
    return coach
  },

  async create(data: CreateCoachDTO): Promise<Coach> {
    await delay(300)
    if (!data.name || data.name.length < 3) {
      throw { error: 'Name must be at least 3 characters' }
    }

    const coaches = getCoachesState()
    const newCoach: Coach = {
      id: nextCoachId++,
      name: data.name,
      salary: undefined,
      club: undefined,
    }
    setCoachesState([...coaches, newCoach])
    return newCoach
  },

  async getFreeCoaches(): Promise<Coach[]> {
    await delay(200)
    const coaches = getCoachesState()
    return coaches.filter(c => !c.club)
  },
}
