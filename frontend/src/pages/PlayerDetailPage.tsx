import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { usePlayer } from '../hooks'
import { formatCurrency } from '../utils'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const playerId = Number(id)

  const { data: player, isLoading } = usePlayer(playerId)

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    )
  }

  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Player not found</h2>
        <Button variant="secondary" onClick={() => navigate('/players')} className="mt-4">
          Back to Players
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/players')}
        className="mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Players
      </Button>

      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{player.name}</h1>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              {player.club ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Contracted
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Free Agent
                </span>
              )}
            </dd>
          </div>

          {player.club && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">Club</dt>
                <dd className="mt-1">
                  <Link
                    to={`/clubs/${player.club.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {player.club.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Salary</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(player.salary || 0)}
                </dd>
              </div>
            </>
          )}
        </dl>

        {player.club && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              To release this player, go to the{' '}
              <Link
                to={`/clubs/${player.club.id}`}
                className="text-primary-600 hover:text-primary-700"
              >
                club detail page
              </Link>
              .
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}
