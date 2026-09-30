export interface Product {
  id: number
  title: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  category: string
  description: string
  image: string
  badge?: 'Sale' | 'Hot' | 'New' | 'Best Seller'
  inStock: boolean
  stockCount: number
  features: string[]
  tags: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: number
  userName: string
  rating: number
  date: string
  comment: string
}

export interface OrderDetails {
  orderId: string
  customerName: string
  email: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
