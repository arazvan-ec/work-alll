import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    pages: 5,
    total: 50,
    onPageChange: vi.fn(),
  }

  it('renders when there are multiple pages', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByText(/showing page/i)).toBeInTheDocument()
  })

  it('does not render when there is only one page', () => {
    render(<Pagination {...defaultProps} pages={1} />)
    expect(screen.queryByText(/showing page/i)).not.toBeInTheDocument()
  })

  it('displays current page and total pages', () => {
    render(<Pagination {...defaultProps} page={3} pages={10} />)
    expect(screen.getByText(/3/)).toBeInTheDocument()
    expect(screen.getByText(/10/)).toBeInTheDocument()
  })

  it('displays total items count', () => {
    render(<Pagination {...defaultProps} total={100} />)
    expect(screen.getByText(/100 items/i)).toBeInTheDocument()
  })

  it('calls onPageChange with previous page', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} page={3} onPageChange={onPageChange} />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0]) // Previous button
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} page={3} onPageChange={onPageChange} />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1]) // Next button
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} page={1} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} page={5} pages={5} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[1]).toBeDisabled()
  })

  it('enables both buttons on middle pages', () => {
    render(<Pagination {...defaultProps} page={3} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).not.toBeDisabled()
    expect(buttons[1]).not.toBeDisabled()
  })
})
