import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tab } from '@headlessui/react'
import { Button, Card, Table, ConfirmModal } from '../components/ui'
import { EditBudgetModal } from '../components/clubs/EditBudgetModal'
import { AssignPlayerModal } from '../components/clubs/AssignPlayerModal'
import { AssignCoachModal } from '../components/clubs/AssignCoachModal'
import {
  useClub,
  useClubPlayers,
  useClubCoaches,
  useReleasePlayer,
  useReleaseCoach,
} from '../hooks'
import { formatCurrency } from '../utils'
import type { Player } from '../types/player'
import type { Coach } from '../types/coach'
import { PencilIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const clubId = Number(id)

  const { data: club, isLoading } = useClub(clubId)
  const { data: players } = useClubPlayers(clubId)
  const { data: coaches } = useClubCoaches(clubId)
  const releasePlayer = useReleasePlayer()
  const releaseCoach = useReleaseCoach()

  const [editBudgetOpen, setEditBudgetOpen] = useState(false)
  const [assignPlayerOpen, setAssignPlayerOpen] = useState(false)
  const [assignCoachOpen, setAssignCoachOpen] = useState(false)
  const [releasePlayerConfirm, setReleasePlayerConfirm] = useState<Player | null>(null)
  const [releaseCoachConfirm, setReleaseCoachConfirm] = useState<Coach | null>(null)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-32 bg-gray-200 rounded-lg mb-6" />
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    )
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Club not found</h2>
        <Button variant="secondary" onClick={() => navigate('/clubs')} className="mt-4">
          Back to Clubs
        </Button>
      </div>
    )
  }

  const availablePercentage = club.budget > 0 ? (club.availableBudget / club.budget) * 100 : 0
  const budgetColorClass =
    availablePercentage > 20
      ? 'text-green-600 bg-green-100'
      : availablePercentage > 0
      ? 'text-yellow-600 bg-yellow-100'
      : 'text-red-600 bg-red-100'

  const playerColumns = [
    { key: 'name', header: 'Name' },
    {
      key: 'salary',
      header: 'Salary',
      render: (player: Player) => formatCurrency(player.salary || 0),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (player: Player) => (
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setReleasePlayerConfirm(player)
          }}
        >
          Release
        </Button>
      ),
    },
  ]

  const coachColumns = [
    { key: 'name', header: 'Name' },
    {
      key: 'salary',
      header: 'Salary',
      render: (coach: Coach) => formatCurrency(coach.salary || 0),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (coach: Coach) => (
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setReleaseCoachConfirm(coach)
          }}
        >
          Release
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/clubs')}
        className="mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Clubs
      </Button>

      {/* Club Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Budget:</span>{' '}
                <span className="font-semibold">{formatCurrency(club.budget)}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Salaries:</span>{' '}
                <span className="font-semibold">{formatCurrency(club.totalSalaries)}</span>
              </div>
              <div>
                <span className="text-gray-500">Available:</span>{' '}
                <span className={`font-semibold px-2 py-0.5 rounded ${budgetColorClass}`}>
                  {formatCurrency(club.availableBudget)}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={() => setEditBudgetOpen(true)}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Budget
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-primary-600'
                  : 'text-gray-600 hover:bg-white/[0.5] hover:text-gray-900'
              )
            }
          >
            Players ({players?.length || 0})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-primary-600'
                  : 'text-gray-600 hover:bg-white/[0.5] hover:text-gray-900'
              )
            }
          >
            Coaches ({coaches?.length || 0})
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setAssignPlayerOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Assign Player
              </Button>
            </div>
            <Table
              columns={playerColumns}
              data={players || []}
              emptyMessage="No players assigned to this club"
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setAssignCoachOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Assign Coach
              </Button>
            </div>
            <Table
              columns={coachColumns}
              data={coaches || []}
              emptyMessage="No coaches assigned to this club"
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Modals */}
      <EditBudgetModal
        isOpen={editBudgetOpen}
        onClose={() => setEditBudgetOpen(false)}
        club={club}
      />

      <AssignPlayerModal
        isOpen={assignPlayerOpen}
        onClose={() => setAssignPlayerOpen(false)}
        clubId={clubId}
        availableBudget={club.availableBudget}
      />

      <AssignCoachModal
        isOpen={assignCoachOpen}
        onClose={() => setAssignCoachOpen(false)}
        clubId={clubId}
        availableBudget={club.availableBudget}
      />

      <ConfirmModal
        isOpen={!!releasePlayerConfirm}
        onClose={() => setReleasePlayerConfirm(null)}
        onConfirm={() => {
          if (releasePlayerConfirm) {
            releasePlayer.mutate(
              { clubId, playerId: releasePlayerConfirm.id },
              { onSuccess: () => setReleasePlayerConfirm(null) }
            )
          }
        }}
        title="Release Player"
        message={`Are you sure you want to release ${releasePlayerConfirm?.name}? They will become a free agent and their salary will be removed.`}
        confirmLabel="Release"
        loading={releasePlayer.isPending}
      />

      <ConfirmModal
        isOpen={!!releaseCoachConfirm}
        onClose={() => setReleaseCoachConfirm(null)}
        onConfirm={() => {
          if (releaseCoachConfirm) {
            releaseCoach.mutate(
              { clubId, coachId: releaseCoachConfirm.id },
              { onSuccess: () => setReleaseCoachConfirm(null) }
            )
          }
        }}
        title="Release Coach"
        message={`Are you sure you want to release ${releaseCoachConfirm?.name}? They will become a free agent and their salary will be removed.`}
        confirmLabel="Release"
        loading={releaseCoach.isPending}
      />
    </div>
  )
}
