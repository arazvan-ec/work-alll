import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('displays error message', () => {
    render(<Input label="Name" error="Name is required" />)
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    render(<Input label="Name" error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300')
  })

  it('does not apply error styling when no error', () => {
    render(<Input label="Name" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-300')
    expect(screen.getByRole('textbox')).not.toHaveClass('border-red-300')
  })

  it('accepts number type', () => {
    render(<Input type="number" label="Amount" />)
    expect(screen.getByLabelText(/amount/i)).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled label="Disabled" />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
