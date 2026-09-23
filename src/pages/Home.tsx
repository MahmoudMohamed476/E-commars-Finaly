import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import DealsSection from '../components/DealsSection'
import { categories, products } from '../data/products'

const quickCards = [
  { title: 'Sign in for the best experience', cta: 'Sign in securely →' },
  {
    title: 'Shop Electronics',
    cta: 'See more →',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=120&fit=crop&auto=format',
  },
  {
    title: 'Fashion Finds',
    cta: 'See more →',
    img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=120&fit=crop&auto=format',
  },
  {
    title: 'Home & Kitchen',
    cta: 'See more →',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=120&fit=crop&auto=format',
  },
]

export default function Home() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const { addToCart, openCart } = useCart()
  const gridRef = useRef<HTMLDivElement>(null)

  const allCategories = ['All', ...categories]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.includes(q))
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const isFiltering = !!query || activeCategory !== 'All'

  const selectCategory = (cat: string) => {
    setActiveCategory(cat)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen">
      {!isFiltering && (
        <>
          <Hero />
          <div className="relative z-10 mx-auto -mt-6 max-w-[1500px] px-4">
            <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {quickCards.map((card, i) => (
                <div
                  key={i}
                  className={`cursor-pointer rounded bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
                    card.img ? '' : 'flex flex-col'
                  }`}
                >
                  <h3 className="mb-2 font-display text-sm font-bold leading-tight text-[#0F1111]">
                    {card.title}
                  </h3>
                  {card.img && (
                    <img
                      src={card.img}
                      alt=""
                      className="mb-2 h-20 w-full rounded object-cover"
                    />
                  )}
                  {card.cta.startsWith('Sign in') ? (
                    <>
                      <div className="mt-auto rounded-full bg-[#FFD814] border border-[#FCD200] py-1 text-center text-xs font-medium text-[#0F1111]">
                        Sign in
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-[#007185] hover:text-[#C7511F]">
                      {card.cta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1500px] px-4">
            <Categories onSelect={selectCategory} />
          </div>
          <div className="mx-auto max-w-[1500px] px-4">
            <DealsSection onAdd={addToCart} />
          </div>
        </>
      )}

      <section ref={gridRef} className="py-6" style={{ scrollMarginTop: '140px' }}>
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'border-[#FF9900] bg-[#FF9900] font-semibold text-[#131921]'
                    : 'border-[#DDD] bg-white text-[#0F1111] hover:bg-[#F6F6F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#0F1111]">
              {query
                ? `Results for "${query}"`
                : activeCategory !== 'All'
                  ? activeCategory
                  : 'Featured Products'}
            </h2>
            <span className="text-sm text-[#555]">
              {filtered.length} results
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="mb-2 font-display text-2xl font-bold text-[#0F1111]">
                No results found
              </p>
              <p className="mb-4 text-[#555]">Try different keywords or browse our categories</p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All')
                  navigate('/')
                }}
                className="rounded-full bg-[#FFD814] border border-[#FCD200] px-6 py-2 font-medium text-[#0F1111] transition-colors hover:bg-[#F7CA00]"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={(p) => {
                    addToCart(p)
                    openCart()
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}