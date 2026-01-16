import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Card } from '../components/ui'
import { useCreateCoach } from '../hooks'

const coachSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
})

type CoachFormData = z.infer<typeof coachSchema>

export function CreateCoachPage() {
  const navigate = useNavigate()
  const createCoach = useCreateCoach()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoachFormData>({
    resolver: zodResolver(coachSchema),
  })

  const onSubmit = async (data: CoachFormData) => {
    try {
      await createCoach.mutateAsync(data)
      navigate('/coaches')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Coach</h1>
        <p className="text-gray-600">Add a new free agent coach to the system</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Coach Name"
            placeholder="Enter coach name"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/coaches')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createCoach.isPending}>
              Create Coach
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
