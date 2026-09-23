// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App (full tree)', () => {
  beforeEach(() => {
    localStorage.clear()
    Element.prototype.scrollIntoView = () => {}
  })

  afterEach(cleanup)

  it('renders header, homepage sections and footer', () => {
    render(<App />)
    expect(
      screen.getAllByPlaceholderText('Search ShopNow').length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByText('Delivering to').length).toBeGreaterThan(0)
    expect(screen.getAllByText("Today's Deals").length).toBeGreaterThan(0)
    expect(screen.getAllByText('Back to top').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Add to Cart').length).toBeGreaterThan(0)
  })

  it('opens the cart drawer when a product is added', () => {
    render(<App />)
    fireEvent.click(screen.getAllByRole('button', { name: /add to cart/i })[0])
    expect(screen.getByText('Cart (1 item)')).toBeTruthy()
    expect(screen.getByText('Proceed to Checkout')).toBeTruthy()
  })
})