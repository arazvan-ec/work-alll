import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber, formatPercentage } from './formatters'

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('1.000.000')
    expect(result).toContain('€')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formats small numbers correctly', () => {
    const result = formatCurrency(100)
    expect(result).toContain('100')
    expect(result).toContain('€')
  })

  it('formats large numbers with thousand separators', () => {
    const result = formatCurrency(5000000)
    expect(result).toContain('5.000.000')
    expect(result).toContain('€')
  })
})

describe('formatNumber', () => {
  it('formats integers with thousand separators', () => {
    expect(formatNumber(1000000)).toBe('1.000.000')
  })

  it('formats zero correctly', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('formats small numbers without separators', () => {
    expect(formatNumber(999)).toBe('999')
  })
})

describe('formatPercentage', () => {
  it('calculates percentage correctly', () => {
    expect(formatPercentage(50, 100)).toBe('50%')
  })

  it('returns 0% when total is zero', () => {
    expect(formatPercentage(50, 0)).toBe('0%')
  })

  it('rounds percentage to nearest integer', () => {
    expect(formatPercentage(1, 3)).toBe('33%')
  })

  it('handles 100% correctly', () => {
    expect(formatPercentage(100, 100)).toBe('100%')
  })

  it('handles value greater than total', () => {
    expect(formatPercentage(150, 100)).toBe('150%')
  })
})
