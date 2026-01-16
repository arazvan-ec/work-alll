export interface Player {
  id: number
  name: string
  salary?: number
  club?: {
    id: number
    name: string
  }
}

export interface CreatePlayerDTO {
  name: string
}

export interface AssignPlayerDTO {
  salary: number
}

export interface PlayersResponse {
  data: Player[]
  meta: {
    total: number
    page: number
    pages: number
    limit: number
  }
}
