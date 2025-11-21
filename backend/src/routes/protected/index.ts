import express from "express"
import products_router from "./products"
import auth_middleware from "../../middleware/auth"

const protected_router = express.Router()

protected_router.use(auth_middleware)

protected_router.use("/products", products_router)


export default protected_router