export interface OrderItem {
  product_id: string
  quantidade: number
}
export interface Order {
  items: OrderItem[]
}