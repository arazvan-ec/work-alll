import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when isOpen is true', async () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    await waitFor(() => {
      expect(screen.getByText(/test modal/i)).toBeInTheDocument()
    })
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.queryByText(/test modal/i)).not.toBeInTheDocument()
  })

  it('renders children content when open', async () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal">
        <div data-testid="custom-content">
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </div>
      </Modal>
    )
    await waitFor(() => {
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByText(/first paragraph/i)).toBeInTheDocument()
    })
  })

  it('displays the correct title', async () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Custom Title">
        <p>Content</p>
      </Modal>
    )
    await waitFor(() => {
      expect(screen.getByText(/my custom title/i)).toBeInTheDocument()
    })
  })

  it('renders content inside modal panel', async () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Modal body content</p>
      </Modal>
    )
    await waitFor(() => {
      expect(screen.getByText(/modal body content/i)).toBeInTheDocument()
    })
  })
})
