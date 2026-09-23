import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

const FREE_SHIPPING_THRESHOLD = 75
const navLinks = [
  "Today's Deals",
  'Customer Service',
  'Registry',
  'Gift Cards',
  'Sell',
]
const searchCategories = ['All', ...new Set(['Electronics', 'Wearables', 'Fashion', 'Home', 'Travel'])]

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { items, updateQuantity, removeFromCart, subtotal, count } = useCart()
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#DDD] px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <ShoppingCart className="h-5 w-5" />
            Cart ({count} {count === 1 ? 'item' : 'items'})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-[#F6F6F6]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingCart className="h-12 w-12 text-slate-300" strokeWidth={1} />
            <p className="font-medium text-slate-700">Your cart is empty</p>
            <p className="text-sm text-slate-500">
              Add some products to get started.
            </p>
          </div>
        ) : (
          <>
            {toFreeShipping > 0 ? (
              <div className="bg-amber-50 px-5 py-2.5 text-sm text-amber-800">
                Add {formatPrice(toFreeShipping)} more for free shipping
              </div>
            ) : (
              <div className="bg-emerald-50 px-5 py-2.5 text-sm text-emerald-700">
                You've unlocked free shipping
              </div>
            )}

            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 border-b border-slate-100 py-3 last:border-0"
                >
                  <Link to={`/product/${product.id}`} onClick={onClose}>
                    <div className="h-20 w-20 overflow-hidden rounded bg-[#F6F6F6]">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="line-clamp-2 font-medium text-slate-900 hover:text-[#C7511F]"
                    >
                      {product.title}
                    </Link>
                    <span className="mt-1 text-sm text-slate-500">
                      {formatPrice(product.price)}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center overflow-hidden rounded border border-[#CCC]">
                        <button
                          type="button"
                          className="p-1.5 text-slate-500 hover:bg-[#F6F6F6]"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 border-x border-[#CCC] text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="p-1.5 text-slate-500 hover:bg-[#F6F6F6]"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#C7511F] hover:text-rose-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#DDD] px-5 py-4">
              <div className="mb-3 flex justify-between text-base">
                <span className="text-slate-700">Subtotal ({count} items):</span>
                <span className="font-bold text-slate-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-[#FFD814] px-4 py-2.5 text-center font-semibold text-[#0F1111] border border-[#FCD200] hover:bg-[#F7CA00]"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="mt-2 flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default function Navbar() {
  const { count, openCart } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')
    navigate(q ? `/?q=${encodeURIComponent(String(q))}` : '/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-navy text-white">
        <div className="mx-auto flex max-w-375 items-center gap-2 px-3 py-2">
          <Link
            to="/"
            className="flex shrink-0 items-center rounded border border-transparent px-2 py-1 font-display text-2xl font-extrabold tracking-tight text-white transition-colors hover:border-white"
          >
            shop<span className="text-orange">now</span>
          </Link>

          <div className="hidden shrink-0 cursor-pointer flex-col rounded border border-transparent px-2 py-1 transition-colors hover:border-white lg:flex">
            <span className="text-[11px] leading-none text-[#CCC]">
              Delivering to
            </span>
            <div className="mt-0.5 flex items-center gap-1">
              <MapPin size={14} className="text-white" />
              <span className="text-sm font-semibold text-white">
                New York 10001
              </span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex min-w-0 flex-1">
            <div className="flex w-full overflow-hidden rounded">
              <div className="relative hidden md:block">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Search category"
                  className="h-full cursor-pointer appearance-none border-r border-[#999] bg-surface-dark px-3 pr-7 text-xs font-medium text-navy transition-colors hover:bg-[#C9CECE]"
                >
                  {searchCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-navy"
                />
              </div>
              <input
                type="text"
                name="q"
                defaultValue=""
                placeholder="Search ShopNow"
                className="min-w-0 flex-1 px-4 py-2.5 text-sm text-navy bg-white outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex shrink-0 items-center justify-center bg-orange px-4 transition-colors hover:bg-orange-dark"
              >
                <Search size={20} className="text-navy" />
              </button>
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-1">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex flex-col rounded border border-transparent px-2 py-1 text-left transition-colors hover:border-white"
                >
                  <span className="text-[11px] leading-none text-[#CCC]">
                    Hello, {user.name.split(' ')[0]}
                  </span>
                  <span className="mt-0.5 flex items-center gap-0.5 text-sm font-semibold text-white">
                    Account & Lists <ChevronDown size={12} />
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-60 rounded-lg border border-[#DDD] bg-white p-2 shadow-xl z-50">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        Signed in as
                      </p>
                      <p className="truncate text-sm font-bold text-[#0F1111]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <ShoppingCart className="h-4 w-4 text-slate-400" />
                        <span>My Cart ({count})</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex flex-col rounded border border-transparent px-2 py-1 transition-colors hover:border-white"
              >
                <span className="text-[11px] leading-none text-[#CCC]">
                  Hello, Sign in
                </span>
                <span className="mt-0.5 flex items-center gap-0.5 text-sm font-semibold text-white">
                  Account & Lists <ChevronDown size={12} />
                </span>
              </Link>
            )}

            <Link
              to="/cart"
              className="hidden flex-col rounded border border-transparent px-2 py-1 transition-colors hover:border-white md:flex"
            >
              <span className="text-[11px] leading-none text-[#CCC]">Returns</span>
              <span className="mt-0.5 text-sm font-semibold text-white">
                & Orders
              </span>
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart with ${count} items`}
              className="relative flex items-end gap-1 rounded border border-transparent px-2 py-1 transition-colors hover:border-white"
            >
              <div className="relative">
                <ShoppingCart size={30} className="text-white" />
                {count > 0 && (
                  <span className="absolute -top-1 left-1/2 flex h-4.5 min-w-4.5 -translate-x-1/2 items-center justify-center rounded-full bg-orange px-1 text-xs font-bold leading-none text-navy">
                    {count}
                  </span>
                )}
              </div>
              <span className="hidden pb-0.5 text-sm font-semibold text-white md:block">
                Cart
              </span>
            </button>

            <button
              type="button"
              className="p-2 text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className="px-3 pb-2 md:hidden">
          <form onSubmit={handleSearch} className="flex overflow-hidden rounded">
            <input
              type="text"
              name="q"
              placeholder="Search ShopNow"
              className="flex-1 bg-white px-4 py-2 text-sm text-navy outline-none"
            />
            <button type="submit" aria-label="Search" className="bg-orange px-4">
              <Search size={18} className="text-navy" />
            </button>
          </form>
        </div>
      </div>

      <div className="bg-navy-mid text-white">
        <div className="mx-auto max-w-375 px-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="shrink-0 whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              >
                {link}
              </a>
            ))}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="shrink-0 whitespace-nowrap rounded px-3 py-2 text-sm font-medium text-orange transition-colors hover:bg-white/10"
            >
              Prime Video
            </a>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-navy md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block border-b border-white/10 py-2 text-sm text-white"
              >
                {link}
              </a>
            ))}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block pt-2 text-sm text-white"
            >
              Returns & Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}