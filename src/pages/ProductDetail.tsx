import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronDown, ShoppingCart } from 'lucide-react'
import { getProduct, products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'

function Breadcrumbs({ category, title }: { category: string; title: string }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-xs text-[#555]">
      <Link to="/" className="hover:text-[#C7511F]">
        ShopNow
      </Link>
      <span>/</span>
      <span className="hover:text-[#C7511F]">{category}</span>
      <span>/</span>
      <span>{title}</span>
    </nav>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProduct(Number(id))
  const { addToCart, openCart } = useCart()
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [qtyOpen, setQtyOpen] = useState(false)

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0F1111]">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-[#007185] hover:text-[#C7511F] hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-375 px-4 py-5 sm:px-6">
      <Breadcrumbs category={product.category} title={product.title} />

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded border border-[#DDD] bg-white p-6">
          <img
            src={product.image}
            alt={product.title}
            className="aspect-square w-full object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            {product.badge && (
              <span className="rounded bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white">
                {product.badge}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-medium leading-tight text-[#0F1111]">
            {product.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-[#007185]">
              {product.rating} <span className="text-amber-500">★</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-[#007185] hover:text-[#C7511F]">
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="mt-3 rounded border border-[#DDD] bg-white p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-medium text-[#0F1111]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#777] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded bg-[#CC0C39] px-2 py-0.5 text-sm font-bold text-white">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
            {user && <p className="mt-1 text-xs text-[#565959]">Price includes all taxes</p>}
            {!user && (
              <p className="mt-1 text-xs text-[#565959]">
                <Link
                  to="/login"
                  state={{ from: { pathname: window.location.pathname } }}
                  className="font-semibold text-[#007185] hover:text-[#C7511F] hover:underline"
                >
                  Sign in
                </Link>{' '}
                to see lower prices
              </p>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-[#0F1111]">{product.description}</p>

          <ul className="mt-4 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="h-4 w-4 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>

          <div
            className={`mt-4 text-sm font-medium ${
              product.inStock ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {product.inStock
              ? `In Stock (${product.stockCount} available)`
              : 'Currently unavailable'}
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3">
              {product.inStock && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setQtyOpen((o) => !o)}
                    className="flex items-center gap-8 rounded-lg border border-[#CCC] bg-[#F0F2F2] px-3 py-2 text-sm shadow-sm"
                  >
                    Qty: {quantity}
                    <ChevronDown size={14} />
                  </button>
                  {qtyOpen && (
                    <div className="absolute top-full left-0 z-10 mt-1 max-h-48 w-16 overflow-y-auto rounded-lg border border-[#DDD] bg-white shadow-lg">
                      {Array.from({ length: Math.min(product.stockCount, 10) }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => {
                              setQuantity(n)
                              setQtyOpen(false)
                            }}
                            className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-[#F0F2F2] ${
                              n === quantity ? 'bg-[#F0F2F2] font-semibold' : ''
                            }`}
                          >
                            {n}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product, quantity)
                  openCart()
                }}
                className="flex-1 rounded-full border border-[#FCD200] bg-[#FFD814] px-6 py-2.5 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <span className="inline-flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </span>
              </button>
            </div>

            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => {
                addToCart(product, quantity)
                openCart()
              }}
              className="mt-2 w-full rounded-full border border-[#FBD815] bg-[#FFA41C] px-6 py-2.5 font-medium text-[#0F1111] transition-colors hover:bg-[#FA8900] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-xl font-bold text-[#0F1111]">
            Products related to this item
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={(prod) => {
                  addToCart(prod)
                  openCart()
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}