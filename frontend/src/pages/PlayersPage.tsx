import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Table, Input, Pagination } from '../components/ui'
import { usePlayers } from '../hooks'
import { formatCurrency } from '../utils'
import type { Player } from '../types/player'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function PlayersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = usePlayers({ name: search || undefined, page, limit })

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'club',
      header: 'Club',
      render: (player: Player) =>
        player.club ? (
          <span className="text-gray-900">{player.club.name}</span>
        ) : (
          <span className="text-green-600 font-medium">Free Agent</span>
        ),
    },
    {
      key: 'salary',
      header: 'Salary',
      render: (player: Player) =>
        player.salary !== undefined ? formatCurrency(player.salary) : '-',
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players</h1>
          <p className="text-gray-600">Manage all players in the system</p>
        </div>
        <Link to="/players/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Player
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search players..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        onRowClick={(player) => navigate(`/players/${player.id}`)}
        emptyMessage="No players found"
      />

      {data && (
        <Pagination
          page={data.meta.page}
          pages={data.meta.pages}
          total={data.meta.total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
