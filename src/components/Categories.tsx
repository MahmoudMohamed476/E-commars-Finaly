const categoryList = [
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Home',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Wearables',
    image:
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop&auto=format',
  },
  {
    name: 'Travel',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format',
  },
]

export default function Categories({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-375 px-4">
        <h2 className="mb-4 font-display text-xl font-bold text-[#0F1111]">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categoryList.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelect(cat.name)}
              className="group flex cursor-pointer flex-col items-center gap-2"
            >
              <div className="aspect-square w-full overflow-hidden rounded bg-[#F6F6F6]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-medium leading-tight text-[#0F1111] group-hover:text-[#C7511F]">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}