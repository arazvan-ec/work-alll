import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Card } from '../components/ui'
import { useCreateClub } from '../hooks'

const clubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
})

type ClubFormData = z.infer<typeof clubSchema>

export function CreateClubPage() {
  const navigate = useNavigate()
  const createClub = useCreateClub()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
  })

  const onSubmit = async (data: ClubFormData) => {
    try {
      const club = await createClub.mutateAsync(data)
      navigate(`/clubs/${club.id}`)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Club</h1>
        <p className="text-gray-600">Add a new club to the system</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Club Name"
            placeholder="Enter club name"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Budget"
            type="number"
            placeholder="Enter initial budget"
            error={errors.budget?.message}
            {...register('budget', { valueAsNumber: true })}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/clubs')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createClub.isPending}>
              Create Club
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
