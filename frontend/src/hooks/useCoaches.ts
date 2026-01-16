import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coachesService } from '../services'
import type { CreateCoachDTO } from '../types/coach'
import toast from 'react-hot-toast'

export function useCoaches(params?: { name?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['coaches', params],
    queryFn: () => coachesService.getAll(params),
  })
}

export function useCoach(id: number) {
  return useQuery({
    queryKey: ['coaches', id],
    queryFn: () => coachesService.getById(id),
    enabled: !!id,
  })
}

export function useFreeCoaches() {
  return useQuery({
    queryKey: ['coaches', 'free'],
    queryFn: () => coachesService.getFreeCoaches(),
  })
}

export function useCreateCoach() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCoachDTO) => coachesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Coach created successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to create coach')
    },
  })
}
