import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, StatCard } from './Card'

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card><p>Card content</p></Card>)
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
  })

  it('applies default styling', () => {
    render(<Card><p>Content</p></Card>)
    const card = screen.getByText(/content/i).parentElement
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class"><p>Content</p></Card>)
    const card = screen.getByText(/content/i).parentElement
    expect(card).toHaveClass('custom-class')
  })
})

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Players" value={15} />)
    expect(screen.getByText(/total players/i)).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<StatCard title="Players" value={15} subtitle="6 free" />)
    expect(screen.getByText(/6 free/i)).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<StatCard title="Players" value={15} />)
    expect(screen.queryByText(/free/i)).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(
      <StatCard
        title="Clubs"
        value={3}
        icon={<span data-testid="test-icon">Icon</span>}
      />
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('applies color styles correctly', () => {
    render(
      <StatCard
        title="Budget"
        value="$1M"
        icon={<span>$</span>}
        color="green"
      />
    )
    const iconContainer = screen.getByText('$').parentElement
    expect(iconContainer).toHaveClass('bg-green-100', 'text-green-600')
  })

  it('applies blue color by default', () => {
    render(
      <StatCard
        title="Budget"
        value="$1M"
        icon={<span>$</span>}
      />
    )
    const iconContainer = screen.getByText('$').parentElement
    expect(iconContainer).toHaveClass('bg-blue-100', 'text-blue-600')
  })

  it('renders string values correctly', () => {
    render(<StatCard title="Budget" value="€5,000,000" />)
    expect(screen.getByText('€5,000,000')).toBeInTheDocument()
  })
})
