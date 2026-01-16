import type { Player } from './player'
import type { Coach } from './coach'

export interface Club {
  id: number
  name: string
  budget: number
  players?: Player[]
  coaches?: Coach[]
}

export interface ClubWithStats extends Club {
  totalSalaries: number
  availableBudget: number
  playersCount: number
  coachesCount: number
}

export interface CreateClubDTO {
  name: string
  budget: number
}

export interface UpdateBudgetDTO {
  budget: number
}
