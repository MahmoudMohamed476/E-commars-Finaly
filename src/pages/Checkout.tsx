import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/format'
import type { OrderDetails } from '../types'

const SHIPPING_RATE = 6.99
const FREE_SHIPPING_OVER = 75

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [order, setOrder] = useState<OrderDetails | null>(null)

  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_RATE
  const total = subtotal + shipping

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 font-display text-2xl font-bold text-[#0F1111]">
          Thank you, {order.customerName.split(' ')[0]}!
        </h1>
        <p className="mt-2 text-slate-600">
          Your order <span className="font-semibold">{order.orderId}</span> has
          been placed. A confirmation was sent to {order.email}.
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded border border-[#DDD] bg-white p-6 text-left text-sm">
          <h2 className="font-bold text-[#0F1111]">Order Summary</h2>
          <ul className="mt-3 space-y-1.5">
            {order.items.map((i) => (
              <li key={i.product.id} className="flex justify-between text-slate-600">
                <span>
                  {i.product.title} × {i.quantity}
                </span>
                <span>{formatPrice(i.product.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between font-bold text-[#0F1111]">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full border border-[#FCD200] bg-[#FFD814] px-6 py-2.5 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <ShoppingCart className="mx-auto h-14 w-14 text-slate-300" strokeWidth={1} />
        <h1 className="mt-4 text-2xl font-bold text-[#0F1111]">
          Nothing to check out
        </h1>
        <p className="mt-2 text-slate-500">Add some products to your cart first.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-[#FCD200] bg-[#FFD814] px-6 py-2.5 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
        >
          Start shopping
        </Link>
      </div>
    )
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const orderId = `SH-${Date.now().toString(36).toUpperCase()}`
    setOrder({
      orderId,
      customerName: String(form.get('name')),
      email: String(form.get('email')),
      address: String(form.get('address')),
      city: String(form.get('city')),
      postalCode: String(form.get('postal')),
      paymentMethod: String(form.get('payment')),
      items,
      subtotal,
      discount: 0,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    })
    clearCart()
    window.scrollTo(0, 0)
  }

  const inputClass =
    'w-full rounded-lg border border-[#888C8C] bg-white px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/30'
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#0F1111]'

  return (
    <div className="mx-auto max-w-375 px-4 py-5 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-[#0F1111]">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-8 lg:flex-row"
      >
        <div className="flex-1 space-y-6">
          <section className="rounded border border-[#DDD] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-[#0F1111]">Shipping Details</h2>
              {!user && (
                <Link
                  to="/login"
                  state={{ from: { pathname: '/checkout' } }}
                  className="text-xs font-semibold text-[#007185] hover:text-[#C7511F]"
                >
                  Already have an account? Sign in
                </Link>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="name">
                  Full name
                </label>
                <input
                  key={`name-${user?.id ?? 'guest'}`}
                  id="name"
                  name="name"
                  defaultValue={user?.name ?? ''}
                  required
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input
                  key={`email-${user?.id ?? 'guest'}`}
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user?.email ?? ''}
                  required
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="address">
                  Address
                </label>
                <input id="address" name="address" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="city">
                  City
                </label>
                <input id="city" name="city" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="postal">
                  Postal code
                </label>
                <input id="postal" name="postal" required className={inputClass} />
              </div>
            </div>
          </section>

          <section className="rounded border border-[#DDD] bg-white p-6">
            <h2 className="mb-4 font-bold text-[#0F1111]">Payment</h2>
            <div className="space-y-2">
              {['Credit / Debit card', 'PayPal', 'Cash on delivery'].map((m) => (
                <label
                  key={m}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#DDD] p-3.5 text-sm font-medium text-slate-800 has-checked:border-orange has-checked:bg-[#FFF7E6]"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    defaultChecked={m === 'Credit / Debit card'}
                    className="accent-orange"
                  />
                  {m}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit w-full rounded border border-[#DDD] bg-white p-6 lg:w-80">
          <h2 className="mb-4 font-display text-lg font-bold text-[#0F1111]">
            Order Summary
          </h2>
          <ul className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded bg-[#F6F6F6]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 font-medium text-slate-800">
                    {product.title}
                  </p>
                  <p className="text-slate-400">× {quantity}</p>
                </div>
                <span className="font-medium">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-medium text-[#0F1111]">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-medium text-[#0F1111]">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
              <dt className="font-semibold text-[#0F1111]">Total</dt>
              <dd className="font-bold text-[#0F1111]">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="mt-5 w-full rounded-full border border-[#FCD200] bg-[#FFD814] py-3 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
          >
            Place Order
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Demo checkout — no payment is processed.
          </p>
        </aside>
      </form>
    </div>
  )
}