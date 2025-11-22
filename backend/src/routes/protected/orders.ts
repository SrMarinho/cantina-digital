import express from "express"
import order_controller from "../../controllers/order_controller"

const orders_router = express.Router()

orders_router.get("/", order_controller.getUserOrders)
orders_router.get("/:id", order_controller.getOrder)
orders_router.post("/", order_controller.createOrder)

export default orders_router