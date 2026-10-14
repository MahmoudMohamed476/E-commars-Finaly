// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ProductsProvider, useProducts } from './ProductsContext'

// With no Supabase keys the provider must serve the local seed data so the
// whole catalog keeps working offline.
const wrapper = ({ children }: { children: ReactNode }) => (
  <ProductsProvider>{children}</ProductsProvider>
)

describe('ProductsContext', () => {
  it('falls back to seed products when Supabase is not configured', () => {
    const { result } = renderHook(() => useProducts(), { wrapper })
    expect(result.current.products.length).toBeGreaterThan(0)
    expect(result.current.categories.length).toBeGreaterThan(0)
    expect(result.current.loading).toBe(false)
  })

  it('resolves a product by id', () => {
    const { result } = renderHook(() => useProducts(), { wrapper })
    expect(result.current.getProduct(1)?.id).toBe(1)
    expect(result.current.getProduct(99999)).toBeUndefined()
  })
})
