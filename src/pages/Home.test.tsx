// @vitest-environment jsdom
import { describe, expect, it, beforeAll, afterEach } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { CartProvider } from '../context/CartContext'

const renderHome = (entry = '/') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <CartProvider>
        <Home />
      </CartProvider>
    </MemoryRouter>,
  )

describe('Home', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = () => {}
  })

  afterEach(cleanup)

  it('shows hero, category and deals sections by default', () => {
    renderHome()
    expect(screen.getByText('Shop by Category')).toBeTruthy()
    expect(screen.getByText("Today's Deals")).toBeTruthy()
    expect(screen.getByText('Featured Products')).toBeTruthy()
  })

  it('filters products by search query', () => {
    renderHome('/?q=keyboard')
    expect(screen.getByText('Results for "keyboard"')).toBeTruthy()
    expect(screen.getByText('Mechanical Keyboard')).toBeTruthy()
    expect(screen.queryByText('Wireless Bluetooth Headphones')).toBeNull()
  })

  it('shows a no-results state for unmatched queries', () => {
    renderHome('/?q=zzzzzz-no-such-thing')
    expect(screen.getByText('No results found')).toBeTruthy()
  })

  it('filters products when a category chip is clicked', () => {
    renderHome()
    fireEvent.click(screen.getByRole('button', { name: 'Wearables' }))
    expect(screen.getByText('Smart Fitness Watch')).toBeTruthy()
    expect(screen.queryByText('Mechanical Keyboard')).toBeNull()
  })
})