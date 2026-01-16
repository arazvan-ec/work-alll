import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Table, Input, Pagination } from '../components/ui'
import { useCoaches } from '../hooks'
import { formatCurrency } from '../utils'
import type { Coach } from '../types/coach'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function CoachesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading } = useCoaches({ name: search || undefined, page, limit })

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'club',
      header: 'Club',
      render: (coach: Coach) =>
        coach.club ? (
          <span className="text-gray-900">{coach.club.name}</span>
        ) : (
          <span className="text-green-600 font-medium">Free Agent</span>
        ),
    },
    {
      key: 'salary',
      header: 'Salary',
      render: (coach: Coach) =>
        coach.salary !== undefined ? formatCurrency(coach.salary) : '-',
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coaches</h1>
          <p className="text-gray-600">Manage all coaches in the system</p>
        </div>
        <Link to="/coaches/new">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Coach
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search coaches..."
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
        onRowClick={(coach) => navigate(`/coaches/${coach.id}`)}
        emptyMessage="No coaches found"
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
