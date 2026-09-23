import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { products } from '../data/products'
import type { Product } from '../types'
import ProductCard from './ProductCard'

function Countdown() {
  const [time, setTime] = useState({ h: 5, m: 34, s: 22 })

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s--
        if (s < 0) {
          s = 59
          m--
        }
        if (m < 0) {
          m = 59
          h--
        }
        if (h < 0) {
          h = 5
          m = 59
          s = 59
        }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock size={16} className="text-orange" />
      <span className="text-sm font-medium">Ends in:</span>
      <div className="flex items-center gap-1 font-display text-lg font-bold">
        <span className="rounded bg-navy px-2 py-0.5">{pad(time.h)}</span>
        <span className="text-orange">:</span>
        <span className="rounded bg-navy px-2 py-0.5">{pad(time.m)}</span>
        <span className="text-orange">:</span>
        <span className="rounded bg-navy px-2 py-0.5">{pad(time.s)}</span>
      </div>
    </div>
  )
}

export default function DealsSection({
  onAdd,
}: {
  onAdd: (product: Product) => void
}) {
  const deals = products.filter((p) => p.originalPrice).slice(0, 6)

  return (
    <section className="py-6">
      <div className="mx-auto max-w-375 px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-[#0F1111]">
              Today's Deals
            </h2>
            <Countdown />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  )
}