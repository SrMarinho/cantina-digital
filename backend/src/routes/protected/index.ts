import express from "express"
import auth_middleware from "../../middleware/auth"
import products_router from "./products"
import orders_router from "./orders"

const protected_router = express.Router()

protected_router.use(auth_middleware)

protected_router.use("/products", products_router)
protected_router.use("/orders", orders_router)


export default protected_router