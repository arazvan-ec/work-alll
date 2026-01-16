import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clubsService } from '../services'
import type { CreateClubDTO, UpdateBudgetDTO } from '../types/club'
import toast from 'react-hot-toast'

export function useClubs() {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: () => clubsService.getAll(),
  })
}

export function useClub(id: number) {
  return useQuery({
    queryKey: ['clubs', id],
    queryFn: () => clubsService.getById(id),
    enabled: !!id,
  })
}

export function useClubPlayers(clubId: number) {
  return useQuery({
    queryKey: ['clubs', clubId, 'players'],
    queryFn: () => clubsService.getClubPlayers(clubId),
    enabled: !!clubId,
  })
}

export function useClubCoaches(clubId: number) {
  return useQuery({
    queryKey: ['clubs', clubId, 'coaches'],
    queryFn: () => clubsService.getClubCoaches(clubId),
    enabled: !!clubId,
  })
}

export function useCreateClub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClubDTO) => clubsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Club created successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to create club')
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubId, data }: { clubId: number; data: UpdateBudgetDTO }) =>
      clubsService.updateBudget(clubId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] })
      toast.success('Budget updated successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to update budget')
    },
  })
}

export function useAssignPlayer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubId, playerId, salary }: { clubId: number; playerId: number; salary: number }) =>
      clubsService.assignPlayer(clubId, playerId, salary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] })
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Player assigned successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to assign player')
    },
  })
}

export function useReleasePlayer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubId, playerId }: { clubId: number; playerId: number }) =>
      clubsService.releasePlayer(clubId, playerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] })
      queryClient.invalidateQueries({ queryKey: ['players'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Player released successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to release player')
    },
  })
}

export function useAssignCoach() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubId, coachId, salary }: { clubId: number; coachId: number; salary: number }) =>
      clubsService.assignCoach(clubId, coachId, salary),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] })
      queryClient.invalidateQueries({ queryKey: ['coaches'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Coach assigned successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to assign coach')
    },
  })
}

export function useReleaseCoach() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ clubId, coachId }: { clubId: number; coachId: number }) =>
      clubsService.releaseCoach(clubId, coachId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] })
      queryClient.invalidateQueries({ queryKey: ['clubs', variables.clubId] })
      queryClient.invalidateQueries({ queryKey: ['coaches'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Coach released successfully')
    },
    onError: (error: { error: string }) => {
      toast.error(error.error || 'Failed to release coach')
    },
  })
}
