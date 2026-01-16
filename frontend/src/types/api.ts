export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pages: number
    limit: number
  }
}

export interface ApiError {
  error: string
}

export interface DashboardStats {
  totalClubs: number
  totalPlayers: number
  freePlayers: number
  contractedPlayers: number
  totalCoaches: number
  freeCoaches: number
  contractedCoaches: number
  totalBudget: number
}
