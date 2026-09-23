import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { formatPrice } from '../utils/format'
import type { Product } from '../types'

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= Math.round(rating)
                ? 'fill-[#FF9900] text-[#FF9900]'
                : 'fill-[#CCC] text-[#CCC]'
            }
          />
        ))}
      </div>
      <span className="text-xs text-[#007185]">{count.toLocaleString()}</span>
    </div>
  )
}

function Discount({ price, original }: { price: number; original: number }) {
  const pct = Math.round((1 - price / original) * 100)
  return (
    <span className="rounded bg-[#CC0C39] px-1.5 py-0.5 text-[11px] font-bold text-white">
      -{pct}%
    </span>
  )
}

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product
  onAdd: (product: Product) => void
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded border border-[#DDD] bg-white transition-shadow duration-200 hover:shadow-md">
      <button
        type="button"
        aria-label="Add to wishlist"
        className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 hover:text-red-500"
      >
        <Heart size={16} className="text-[#555]" />
      </button>

      {product.badge && (
        <div className="absolute left-2 top-2 z-10">
          <span className="rounded bg-[#CC0C39] px-2 py-0.5 text-[10px] font-bold text-white">
            {product.badge}
          </span>
        </div>
      )}

      <Link to={`/product/${product.id}`} className="relative block overflow-hidden">
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#F6F6F6] p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900">
              Sold out
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm leading-snug text-[#0F1111] hover:text-[#C7511F]"
        >
          {product.title}
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold text-[#0F1111]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-[#777] line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Discount price={product.price} original={product.originalPrice} />
            </>
          )}
        </div>

        <span className="text-xs text-[#555]">
          {product.inStock ? 'FREE delivery' : 'Out of stock'}
        </span>

        <button
          type="button"
          onClick={() => onAdd(product)}
          disabled={!product.inStock}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-full border border-[#FCD200] bg-[#FFD814] py-2 text-sm font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}