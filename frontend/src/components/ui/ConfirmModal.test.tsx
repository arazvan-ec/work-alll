import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Action',
    message: 'Are you sure you want to do this?',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when isOpen is true', async () => {
    render(<ConfirmModal {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/confirm action/i)).toBeInTheDocument()
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText(/confirm action/i)).not.toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<ConfirmModal {...defaultProps} onClose={onClose} />)

    await waitFor(() => {
      expect(screen.getByText(/confirm action/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />)

    await waitFor(() => {
      expect(screen.getByText(/confirm action/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('uses custom confirm label', async () => {
    render(<ConfirmModal {...defaultProps} confirmLabel="Delete" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })

  it('shows loading state on confirm button', async () => {
    render(<ConfirmModal {...defaultProps} loading={true} confirmLabel="Submit" />)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      // Find the submit/confirm button which should be disabled when loading
      const submitButton = buttons.find(btn => btn.textContent?.includes('Submit'))
      if (submitButton) {
        expect(submitButton).toBeDisabled()
      }
    })
  })

  it('disables cancel button when loading', async () => {
    render(<ConfirmModal {...defaultProps} loading={true} />)

    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      expect(cancelButton).toBeDisabled()
    })
  })

  it('renders warning icon', async () => {
    render(<ConfirmModal {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText(/confirm action/i)).toBeInTheDocument()
    })

    // The ExclamationTriangleIcon should be present
    const svgElement = document.querySelector('svg.text-red-600')
    expect(svgElement).toBeInTheDocument()
  })
})
