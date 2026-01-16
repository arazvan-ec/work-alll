import { Link, useNavigate } from 'react-router-dom'
import { Button, Table } from '../components/ui'
import { useClubs } from '../hooks'
import { formatCurrency } from '../utils'
import type { ClubWithStats } from '../types/club'
import { PlusIcon } from '@heroicons/react/24/outline'

export function ClubsPage() {
  const navigate = useNavigate()
  const { data: clubs, isLoading } = useClubs()

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'budget',
      header: 'Budget',
      render: (club: ClubWithStats) => formatCurrency(club.budget),
    },
    {
      key: 'totalSalaries',
      header: 'Total Salaries',
      render: (club: ClubWithStats) => formatCurrency(club.totalSalaries),
    },
    {
      key: 'availableBudget',
      header: 'Available',
      render: (club: ClubWithStats) => {
        const percentage = club.budget > 0 ? (club.availableBudget / club.budget) * 100 : 0
        return (
          <span
            className={`font-medium ${
              percentage > 20
                ? 'text-green-600'
                : percentage > 0
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {formatCurrency(club.availableBudget)}
          </span>
        )
      },
    },
    {
      key: 'members',
      header: 'Members',
      render: (club: ClubWithStats) => (
        <span className="text-gray-600">
          {club.playersCount} players, {club.coachesCount} coaches
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
          <p className="text-gray-600">Manage all clubs in the system</p>
        </div>
        <Link to="/clubs/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Club
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        data={clubs || []}
        loading={isLoading}
        onRowClick={(club) => navigate(`/clubs/${club.id}`)}
        emptyMessage="No clubs found. Create your first club!"
      />
    </div>
  )
}
