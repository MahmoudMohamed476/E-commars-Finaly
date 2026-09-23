import { describe, expect, it } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats whole and decimal amounts as USD', () => {
    expect(formatPrice(49.99)).toBe('$49.99')
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('adds thousand separators', () => {
    expect(formatPrice(1299)).toBe('$1,299.00')
    expect(formatPrice(1099)).toBe('$1,099.00')
  })
})