import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Card } from '../components/ui'
import { useCreatePlayer } from '../hooks'

const playerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
})

type PlayerFormData = z.infer<typeof playerSchema>

export function CreatePlayerPage() {
  const navigate = useNavigate()
  const createPlayer = useCreatePlayer()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
  })

  const onSubmit = async (data: PlayerFormData) => {
    try {
      await createPlayer.mutateAsync(data)
      navigate('/players')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Player</h1>
        <p className="text-gray-600">Add a new free agent player to the system</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Player Name"
            placeholder="Enter player name"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/players')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createPlayer.isPending}>
              Create Player
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
