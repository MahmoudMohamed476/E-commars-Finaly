// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CartProvider, useCart } from './CartContext'
import type { Product } from '../types'

const makeProduct = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  price: id * 10,
  rating: 4,
  reviewCount: 100,
  category: 'Electronics',
  description: 'desc',
  image: 'https://example.com/p.jpg',
  inStock: true,
  stockCount: 5,
  features: [],
  tags: [],
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

function useCartTest() {
  return useCart()
}

function useCartResult() {
  return renderHook(useCartTest, { wrapper })
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts empty', () => {
    const { result } = useCartResult()
    expect(result.current.items).toEqual([])
    expect(result.current.count).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('adds a product and updates count/subtotal', () => {
    const { result } = useCartResult()
    act(() => result.current.addToCart(makeProduct(1)))
    expect(result.current.count).toBe(1)
    expect(result.current.subtotal).toBe(10)
  })

  it('merges quantity when the same product is added again', () => {
    const { result } = useCartResult()
    act(() => result.current.addToCart(makeProduct(1)))
    act(() => result.current.addToCart(makeProduct(1), 2))
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.subtotal).toBe(30)
  })

  it('removes an item with removeFromCart', () => {
    const { result } = useCartResult()
    act(() => result.current.addToCart(makeProduct(1)))
    act(() => result.current.addToCart(makeProduct(2)))
    act(() => result.current.removeFromCart(1))
    expect(result.current.items.map((i) => i.product.id)).toEqual([2])
  })

  it('drops the item when quantity is set to zero or below', () => {
    const { result } = useCartResult()
    act(() => result.current.addToCart(makeProduct(1)))
    act(() => result.current.updateQuantity(1, 0))
    expect(result.current.items).toEqual([])
  })

  it('persists items to localStorage', () => {
    const { result } = useCartResult()
    act(() => result.current.addToCart(makeProduct(1)))
    const stored = JSON.parse(localStorage.getItem('ecom-cart') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].quantity).toBe(1)
  })
})