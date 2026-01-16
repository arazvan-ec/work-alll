import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Table } from './Table'

interface TestItem {
  id: number
  name: string
  age: number
}

const mockData: TestItem[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
]

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'age', header: 'Age' },
]

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={columns} data={mockData} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<Table columns={columns} data={mockData} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('shows empty message when no data', () => {
    render(<Table columns={columns} data={[]} />)

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('shows custom empty message', () => {
    render(<Table columns={columns} data={[]} emptyMessage="No items found" />)

    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Table columns={columns} data={[]} loading />)

    // Loading state shows skeleton
    expect(screen.queryByText('No data available')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn()
    render(<Table columns={columns} data={mockData} onRowClick={onRowClick} />)

    fireEvent.click(screen.getByText('Alice'))
    expect(onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  it('does not call onRowClick when no handler provided', () => {
    render(<Table columns={columns} data={mockData} />)

    // Should not throw error
    fireEvent.click(screen.getByText('Alice'))
  })

  it('uses custom render function for columns', () => {
    const customColumns = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age', render: (item: TestItem) => `${item.age} years old` },
    ]

    render(<Table columns={customColumns} data={mockData} />)

    expect(screen.getByText('30 years old')).toBeInTheDocument()
  })

  it('displays dash for undefined values', () => {
    const dataWithNull: TestItem[] = [
      { id: 1, name: 'Alice', age: 30 },
    ]
    const columnsWithMissing = [
      { key: 'name', header: 'Name' },
      { key: 'nonexistent', header: 'Missing' },
    ]

    render(<Table columns={columnsWithMissing} data={dataWithNull} />)

    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('applies hover styles when onRowClick is provided', () => {
    render(<Table columns={columns} data={mockData} onRowClick={() => {}} />)

    const rows = screen.getAllByRole('row')
    // First row is header, second is first data row
    expect(rows[1]).toHaveClass('cursor-pointer', 'hover:bg-gray-50')
  })
})
