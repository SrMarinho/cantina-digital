import express from "express"
import auth_router from "./routes/public/auth"
import products_router from "./routes/protected/products"

const router = express.Router()

router.use("/auth", auth_router)
router.use("/products", products_router)

export default router
