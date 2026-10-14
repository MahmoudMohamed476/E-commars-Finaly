import { supabase } from './supabase'
import type { OrderDetails } from '../types'

export async function saveOrder(order: OrderDetails, userId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('orders').insert({
    user_id: userId,
    order_number: order.orderId,
    customer_name: order.customerName,
    email: order.email,
    address: order.address,
    city: order.city,
    postal_code: order.postalCode,
    payment_method: order.paymentMethod,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
  })
  if (error) throw error
}
