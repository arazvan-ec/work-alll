import { Link } from 'react-router-dom'
import { StatCard } from '../components/ui'
import { useDashboard } from '../hooks'
import { formatCurrency } from '../utils'
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  BanknotesIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export function Dashboard() {
  const { data: stats, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your sports management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clubs"
          value={stats?.totalClubs || 0}
          icon={<BuildingOffice2Icon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Total Players"
          value={stats?.totalPlayers || 0}
          subtitle={`${stats?.contractedPlayers || 0} contracted, ${stats?.freePlayers || 0} free`}
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Coaches"
          value={stats?.totalCoaches || 0}
          subtitle={`${stats?.contractedCoaches || 0} contracted, ${stats?.freeCoaches || 0} free`}
          icon={<AcademicCapIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(stats?.totalBudget || 0)}
          icon={<BanknotesIcon className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/clubs/new"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Club</span>
          </Link>
          <Link
            to="/players/new"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Player</span>
          </Link>
          <Link
            to="/coaches/new"
            className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Coach</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
