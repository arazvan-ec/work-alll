import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useFreeCoaches, useAssignCoach } from '../../hooks'
import { formatCurrency } from '../../utils'

interface AssignCoachModalProps {
  isOpen: boolean
  onClose: () => void
  clubId: number
  availableBudget: number
}

const assignSchema = z.object({
  coachId: z.string().min(1, 'Please select a coach'),
  salary: z.number().min(0, 'Salary must be 0 or greater'),
})

type AssignFormData = z.infer<typeof assignSchema>

export function AssignCoachModal({
  isOpen,
  onClose,
  clubId,
  availableBudget,
}: AssignCoachModalProps) {
  const { data: freeCoaches, isLoading } = useFreeCoaches()
  const assignCoach = useAssignCoach()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssignFormData>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      coachId: '',
      salary: 0,
    },
  })

  const salary = watch('salary') || 0
  const exceedsBudget = salary > availableBudget

  const onSubmit = async (data: AssignFormData) => {
    try {
      await assignCoach.mutateAsync({
        clubId,
        coachId: Number(data.coachId),
        salary: data.salary,
      })
      reset()
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Assign Coach">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-gray-600">
          Available Budget: <span className="font-semibold">{formatCurrency(availableBudget)}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Coach
          </label>
          {isLoading ? (
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          ) : freeCoaches?.length === 0 ? (
            <p className="text-sm text-gray-500">No free coaches available</p>
          ) : (
            <select
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('coachId')}
            >
              <option value="">Select a coach...</option>
              {freeCoaches?.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name} (Free Agent)
                </option>
              ))}
            </select>
          )}
          {errors.coachId && (
            <p className="mt-1 text-sm text-red-600">{errors.coachId.message}</p>
          )}
        </div>

        <Input
          label="Salary"
          type="number"
          error={errors.salary?.message}
          helperText={`Remaining after assignment: ${formatCurrency(availableBudget - salary)}`}
          {...register('salary', { valueAsNumber: true })}
        />

        {exceedsBudget && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            Error: Salary ({formatCurrency(salary)}) exceeds available budget ({formatCurrency(availableBudget)}).
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={assignCoach.isPending}
            disabled={exceedsBudget || !freeCoaches?.length}
          >
            Assign Coach
          </Button>
        </div>
      </form>
    </Modal>
  )
}
