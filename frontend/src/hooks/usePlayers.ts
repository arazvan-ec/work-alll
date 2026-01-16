import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { playersService } from '../services'
import type { CreatePlayerDTO } from '../types/player'
import toast from 'react-hot-toast'

export function usePlayers(params?: { name?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['players', params],
    queryFn: () => playersService.getAll(params),
  })
}

export function usePlayer(id: number) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => playersService.getById(id),
    enabled: !!id,
  })
}

export function useFreePlayers() {
  return useQuery({
    queryKey: ['players', 'free'],
    queryFn: () => playersService.getFreePlayers(),
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlayerDTO) => playersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Player created successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to create player')
    },
  })
}
