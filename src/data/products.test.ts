import { describe, expect, it } from 'vitest'
import { categories, products } from './products'

describe('product data integrity', () => {
  it('has unique ids and sane prices', () => {
    const ids = new Set(products.map((p) => p.id))
    expect(ids.size).toBe(products.length)
    for (const p of products) {
      expect(p.price).toBeGreaterThan(0)
      if (p.originalPrice) expect(p.originalPrice).toBeGreaterThan(p.price)
      expect(p.rating).toBeGreaterThanOrEqual(0)
      expect(p.reviewCount).toBeGreaterThanOrEqual(0)
    }
  })

  it('every product maps to a known category', () => {
    for (const p of products) {
      expect(categories).toContain(p.category)
    }
  })

  it('has valid image urls and stock consistency', () => {
    for (const p of products) {
      expect(p.image.startsWith('https://')).toBe(true)
      expect(p.inStock).toBe(p.stockCount > 0)
    }
  })

  it('exposes enough discounted products for the deals section', () => {
    const deals = products.filter((p) => p.originalPrice)
    expect(deals.length).toBeGreaterThanOrEqual(6)
  })
})