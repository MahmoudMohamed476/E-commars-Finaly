import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'Up to 40% off',
    subtitle: 'Electronics Sale',
    description: 'Shop headphones, laptops, wearables & more',
    cta: 'Shop Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400&h=500&fit=crop&auto=format',
    badge: 'Limited Time',
    color: '#131921',
  },
  {
    id: 2,
    title: 'New Season Arrivals',
    subtitle: "Men's & Women's Fashion",
    description: 'Discover the latest trends in clothing & accessories',
    cta: 'Shop Fashion',
    image:
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1400&h=500&fit=crop&auto=format',
    badge: 'New In',
    color: '#1a1a2e',
  },
  {
    id: 3,
    title: 'Home & Kitchen Deals',
    subtitle: 'Transform your space',
    description: 'Appliances, furniture, décor & more at great prices',
    cta: 'Shop Home',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=500&fit=crop&auto=format',
    badge: 'Save Big',
    color: '#2d1b00',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent((c) => (c + 1) % slides.length)

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '420px' }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${slide.color}ee 0%, ${slide.color}99 40%, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1500px] px-8">
              <div className="max-w-lg">
                <span className="mb-3 inline-block rounded bg-[#FF9900] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#131921]">
                  {slide.badge}
                </span>
                <h2 className="mb-1 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
                  {slide.title}
                </h2>
                <p className="mb-2 font-display text-xl font-semibold text-[#FF9900]">
                  {slide.subtitle}
                </p>
                <p className="mb-6 text-base text-white/80">{slide.description}</p>
                <button className="rounded bg-[#FF9900] px-8 py-3 font-display text-base font-bold text-[#131921] shadow-lg transition-colors hover:bg-[#E47911]">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'h-2 w-6 bg-[#FF9900]' : 'h-2 w-2 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}