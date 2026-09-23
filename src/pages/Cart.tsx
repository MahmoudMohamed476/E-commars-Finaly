import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

const FREE_SHIPPING_THRESHOLD = 75
const SHIPPING_RATE = 6.99

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <ShoppingCart className="mx-auto h-14 w-14 text-slate-300" strokeWidth={1} />
        <h1 className="mt-4 text-2xl font-bold text-[#0F1111]">
          Your ShopNow Cart is empty
        </h1>
        <p className="mt-2 text-slate-500">
          Check your Saved for later items or continue shopping.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-[#FCD200] bg-[#FFD814] px-6 py-2.5 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE

  return (
    <div className="mx-auto max-w-375 px-4 py-5 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-[#0F1111]">
        Shopping Cart
      </h1>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row">
        <ul className="flex-1 divide-y divide-slate-100 rounded border border-[#DDD] bg-white">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 p-4">
              <Link to={`/product/${product.id}`}>
                <div className="h-24 w-24 overflow-hidden rounded bg-[#F6F6F6]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain p-1"
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${product.id}`}
                      className="font-medium leading-snug text-[#0F1111] hover:text-[#C7511F]"
                    >
                      {product.title}
                    </Link>
                    {product.originalPrice && (
                      <>
                        <span className="mt-1 block text-sm text-[#777] line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="mt-1 block rounded bg-[#CC0C39] px-1.5 py-0.5 text-[11px] font-bold text-white">
                          -
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="rounded-full bg-[#F6F6F6] px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 hover:text-rose-600"
                    aria-label="Remove item"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center overflow-hidden rounded border border-[#CCC]">
                    <button
                      type="button"
                      className="p-2 text-slate-500 hover:bg-[#F6F6F6]"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 border-x border-[#CCC] text-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="p-2 text-slate-500 hover:bg-[#F6F6F6]"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-[#0F1111]">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit w-full rounded border border-[#DDD] bg-white p-5 lg:w-80">
          <div className="space-y-1 text-base">
            {subtotal >= FREE_SHIPPING_THRESHOLD && (
              <p className="text-sm text-emerald-700">
                Your order qualifies for FREE shipping.
              </p>
            )}
            <p className="text-[#0F1111]">
              Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items):{' '}
              <span className="font-bold">{formatPrice(subtotal)}</span>
            </p>
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-sm text-[#565959]">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for FREE
                shipping
              </p>
            )}
          </div>
          <Link
            to="/checkout"
            className="mt-4 block rounded-full border border-[#FCD200] bg-[#FFD814] py-2.5 text-center font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
          >
            Proceed to Checkout
          </Link>
          <dl className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-medium text-[#0F1111]">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}