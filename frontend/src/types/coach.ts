export interface Coach {
  id: number
  name: string
  salary?: number
  club?: {
    id: number
    name: string
  }
}

export interface CreateCoachDTO {
  name: string
}

export interface AssignCoachDTO {
  salary: number
}

export interface CoachesResponse {
  data: Coach[]
  meta: {
    total: number
    page: number
    pages: number
    limit: number
  }
}
