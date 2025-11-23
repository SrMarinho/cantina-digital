export interface OrderItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  category?: string
}