import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import {
  products as seedProducts,
  getProduct as getSeedProduct,
} from '../data/products'
import { supabase } from '../lib/supabase'

interface ProductsContextValue {
  products: Product[]
  categories: string[]
  getProduct: (id: number) => Product | undefined
  loading: boolean
}

type ProductRow = {
  id: number
  title: string
  price: number
  original_price: number | null
  rating: number
  review_count: number
  category: string
  description: string
  image: string
  badge: Product['badge'] | null
  in_stock: boolean
  stock_count: number
  features: string[]
  tags: string[]
}

const COLUMNS =
  'id,title,price,original_price,rating,review_count,category,description,image,badge,in_stock,stock_count,features,tags'

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    title: r.title,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    rating: r.rating,
    reviewCount: r.review_count,
    category: r.category,
    description: r.description,
    image: r.image,
    badge: r.badge ?? undefined,
    inStock: r.in_stock,
    stockCount: r.stock_count,
    features: r.features,
    tags: r.tags,
  }
}

const seedCategories = [...new Set(seedProducts.map((p) => p.category))].sort()

// Seed data is the default so the app renders instantly (and keeps working
// with no Supabase keys); DB rows replace it once they load.
const ProductsContext = createContext<ProductsContextValue>({
  products: seedProducts,
  categories: seedCategories,
  getProduct: getSeedProduct,
  loading: false,
})

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [loading, setLoading] = useState(supabase !== null)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('products')
      .select(COLUMNS)
      .order('id')
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.length) setProducts((data as ProductRow[]).map(toProduct))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      categories: [...new Set(products.map((p) => p.category))].sort(),
      getProduct: (id) => products.find((p) => p.id === id),
      loading,
    }),
    [products, loading],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts(): ProductsContextValue {
  return useContext(ProductsContext)
}
