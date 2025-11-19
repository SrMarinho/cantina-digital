import express from "express"
import ProductsController from "../../controllers/products_controller"

const products_router = express.Router()

products_router.get("/", ProductsController.getAll)

export default products_router