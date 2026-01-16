import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useUpdateBudget } from '../../hooks'
import { formatCurrency } from '../../utils'
import type { ClubWithStats } from '../../types/club'

interface EditBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  club: ClubWithStats
}

const budgetSchema = z.object({
  budget: z.number().min(1, 'Budget must be greater than 0'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

export function EditBudgetModal({ isOpen, onClose, club }: EditBudgetModalProps) {
  const updateBudget = useUpdateBudget()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: club.budget,
    },
  })

  const newBudget = watch('budget') || 0
  const isReducing = newBudget < club.budget
  const isBelowSalaries = newBudget < club.totalSalaries

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await updateBudget.mutateAsync({
        clubId: club.id,
        data: { budget: data.budget },
      })
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Budget">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p>Current Budget: <span className="font-semibold">{formatCurrency(club.budget)}</span></p>
          <p>Total Salaries: <span className="font-semibold">{formatCurrency(club.totalSalaries)}</span></p>
        </div>

        <Input
          label="New Budget"
          type="number"
          error={errors.budget?.message}
          {...register('budget', { valueAsNumber: true })}
        />

        {isReducing && !isBelowSalaries && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Warning: You are reducing the budget from {formatCurrency(club.budget)} to {formatCurrency(newBudget)}.
          </div>
        )}

        {isBelowSalaries && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            Error: Budget cannot be lower than current salaries ({formatCurrency(club.totalSalaries)}).
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={updateBudget.isPending}
            disabled={isBelowSalaries}
          >
            Update Budget
          </Button>
        </div>
      </form>
    </Modal>
  )
}
