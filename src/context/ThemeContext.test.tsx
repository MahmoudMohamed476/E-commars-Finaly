// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeContext'

function ToggleProbe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

afterEach(() => cleanup())

describe('ThemeContext', () => {
  it('defaults to light and toggles the .dark class', () => {
    render(
      <ThemeProvider>
        <ToggleProbe />
      </ThemeProvider>,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    fireEvent.click(screen.getByText('light'))
    expect(screen.getByText('dark')).toBeTruthy()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('ecom_theme')).toBe('dark')
  })

  it('restores a persisted theme', () => {
    localStorage.setItem('ecom_theme', 'dark')
    render(
      <ThemeProvider>
        <ToggleProbe />
      </ThemeProvider>,
    )
    expect(screen.getByText('dark')).toBeTruthy()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})